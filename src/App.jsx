import { calendarInfoCatch } from "./components/fetchCalendar";
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { Calendar } from "./components/Calendar";
import { GradeAssignment } from "./components/GradeAssignment";
import StudentSubmissionPreview from './components/assignment/StudentSubmissionPreview';
import MyGrades from './components/MyGrades';
import { fetchAllMyGrades } from './components/fetchMyGrades';


import {
  GM_setValue,
  GM_getValue,
  GM_registerMenuCommand,
  GM_unregisterMenuCommand
} from '$'


function menuControl(env, setEnv) {

}


function App() {
  const [env, setEnv] = useState(
    GM_getValue('env', {
      calendar: {
        display: true,
        showSubmitted: true,
        showGraded: false
      },
      assignment: {
        display: true,
        memo: ''
      }
    })
  );

  menuControl(env, setEnv)
  const [todoItems, setTodoItems] = useState(null);
  const [myGradesItems, setMyGradesItems] = useState(null);

  useEffect(() => {
    // Only fetch calendar/attempts on the Portal tabAction page to avoid waste on other routes
    const isPortalTabAction = window.location.href.startsWith('https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction');
    if (!isPortalTabAction) return;
    const fetchTodoItems = async () => {
      const items = await calendarInfoCatch();
      setTodoItems(items);
    }
    fetchTodoItems();
  }, [])


  useEffect(() => {
    GM_setValue('env', env)
    console.log('Setting Saved')
  }, [env]);


  // Mount Calendar as a Blackboard module inside column when on portal page
  useEffect(() => {
    // Only render DDL Poster on the Portal tabAction page
    const isPortalTabAction = window.location.href.startsWith('https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction');
    if (!isPortalTabAction || !env.calendar.display || !todoItems) return;

    // Try to find host column (prefer #column2)
    const host = document.getElementById('column2')
      || document.querySelector('#column1')
      || document.querySelector('.column-3')
      || document.body;

    // Avoid duplicate module
    let moduleEl = document.getElementById('module:_bbep_calendar');
    if (!moduleEl) {
      moduleEl = document.createElement('div');
      moduleEl.className = 'portlet clearfix reorderableModule';
      moduleEl.id = 'module:_bbep_calendar';

      // Build module chrome (no native toggle/close/reorder controls)
      const html = `
        <h2 class="clearfix" style="cursor: default;">
          <span class="moduleTitle">DDL Poster</span>
          <span class="bbep-actions" style="float:right; display:flex; gap:8px; align-items:center;">
            <label class="bbep-switch">
              <span class="bbep-switch-text">显示已提交</span>
              <input id="bbep_toggle_show_submitted" type="checkbox" />
              <span class="bbep-slider" aria-hidden="true"></span>
            </label>
            <label class="bbep-switch">
              <span class="bbep-switch-text">显示已批阅</span>
              <input id="bbep_toggle_show_graded" type="checkbox" />
              <span class="bbep-slider" aria-hidden="true"></span>
            </label>
          </span>
        </h2>
        <div class="collapsible" style="overflow: auto;" aria-expanded="true" id="BBEP_Calendar_Module">
          <div id="div_bbep_calendar_root"></div>
        </div>
      `;
      moduleEl.innerHTML = html;
      // Insert the module at the very top of Column2
      try {
        if (host && (host.firstElementChild || host.firstChild)) {
          host.insertBefore(moduleEl, host.firstElementChild || host.firstChild);
        } else if (host) {
          host.appendChild(moduleEl);
        }
      } catch (_) {
        // Fallback to append if insertBefore fails for any reason
        host.appendChild(moduleEl);
      }

      // Removed native toggle/close/reorder controls for this module
    }

    // Update/attach showSubmitted toggle switch
    const toggleInput = moduleEl.querySelector('#bbep_toggle_show_submitted');
    if (toggleInput) {
      toggleInput.checked = !!env.calendar.showSubmitted;
      toggleInput.setAttribute('aria-checked', env.calendar.showSubmitted ? 'true' : 'false');
      toggleInput.onchange = (e) => {
        const checked = !!e.target.checked;
        setEnv((prev) => ({
          ...prev,
          calendar: { ...prev.calendar, showSubmitted: checked },
        }));
      };
    }

    const toggleGraded = moduleEl.querySelector('#bbep_toggle_show_graded');
    if (toggleGraded) {
      toggleGraded.checked = !!env.calendar.showGraded;
      toggleGraded.setAttribute('aria-checked', env.calendar.showGraded ? 'true' : 'false');
      toggleGraded.onchange = (e) => {
        const checked = !!e.target.checked;
        setEnv((prev) => ({
          ...prev,
          calendar: { ...prev.calendar, showGraded: checked },
        }));
      };
    }

    const mountPoint = moduleEl.querySelector('#div_bbep_calendar_root');
    const root = ReactDOM.createRoot(mountPoint);
    const itemsFiltered = env.calendar.showSubmitted
      ? todoItems
      : todoItems.filter(it => !(it.eventType === 'Assignment' && it.submitted));

    // Submitted assignments go to the end of the list
    const itemsForRender = (itemsFiltered || []).slice().sort((a, b) => {
      const aSub = (a.eventType === 'Assignment' && a.submitted) ? 1 : 0;
      const bSub = (b.eventType === 'Assignment' && b.submitted) ? 1 : 0;
      if (aSub !== bSub) return aSub - bSub; // 0 before 1
      // keep existing chronological order as secondary criterion
      const ad = a.deadline ? Date.parse(a.deadline) : Infinity;
      const bd = b.deadline ? Date.parse(b.deadline) : Infinity;
      return ad - bd;
    });
    root.render(
      <React.StrictMode>
        <Calendar todo_items={itemsForRender} showGraded={env.calendar.showGraded} variant="module" />
      </React.StrictMode>
    );

    return () => {
      try { root.unmount(); } catch (_) {}
      // keep module chrome unless leaving portal page; do not remove here
    };
  }, [todoItems, env.calendar.display, env.calendar.showSubmitted]);

  // Prefetch My Grades data and mount module directly below DDL Poster once ready
  useEffect(() => {
    const isPortalTabAction = window.location.href.startsWith('https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction');
    if (!isPortalTabAction) return;

    let alive = true;
    (async () => {
      try {
        const data = await fetchAllMyGrades();
        if (alive) setMyGradesItems(data);
      } catch (_) {}
    })();

    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const isPortalTabAction = window.location.href.startsWith('https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction');
    if (!isPortalTabAction || !myGradesItems) return;

    const poster = document.getElementById('module:_bbep_calendar');
    const host = (poster && poster.parentElement)
      || document.getElementById('column2')
      || document.querySelector('#column2')
      || document.getElementById('column1')
      || document.querySelector('#column1');
    if (!host) return;

    let moduleEl = document.getElementById('module:_bbep_mygrades');
    if (!moduleEl) {
      moduleEl = document.createElement('div');
      moduleEl.className = 'portlet clearfix reorderableModule';
      moduleEl.id = 'module:_bbep_mygrades';
      const html = `
        <h2 class="clearfix" style="cursor: default;">
          <span class="moduleTitle">My Grades</span>
        </h2>
        <div class="collapsible" style="overflow: auto; display: block; height: 320px;" aria-expanded="true" id="BBEP_MyGrades_Module">
          <div id="div_bbep_mygrades_root"></div>
        </div>
      `;
      moduleEl.innerHTML = html;
      try {
        if (poster && poster.parentElement === host) {
          const next = poster.nextSibling;
          if (next) host.insertBefore(moduleEl, next); else host.appendChild(moduleEl);
        } else {
          host.appendChild(moduleEl);
        }
      } catch (_) { host.appendChild(moduleEl); }
    } else {
      // Ensure correct placement under DDL Poster if already exists
      try {
        if (poster && poster.parentElement === host) {
          const next = poster.nextSibling;
          if (moduleEl.parentElement !== host || (next && next !== moduleEl)) {
            if (next) host.insertBefore(moduleEl, next); else host.appendChild(moduleEl);
          }
        }
      } catch (_) {}
    }

    const mountPoint = moduleEl.querySelector('#div_bbep_mygrades_root');
    const coll = moduleEl.querySelector('#BBEP_MyGrades_Module');
    if (coll) {
      try {
        coll.style.display = 'block';
        coll.style.height = '320px';
        coll.style.maxHeight = '320px';
        coll.setAttribute('aria-expanded', 'true');
      } catch (_) {}
    }
    if (!mountPoint) return;
    if (mountPoint.dataset.bbepMounted === '1') return;
    const root = ReactDOM.createRoot(mountPoint);
    root.render(
      <React.StrictMode>
        <MyGrades items={myGradesItems} />
      </React.StrictMode>
    );
    mountPoint.dataset.bbepMounted = '1';

    return () => {
      try { root.unmount(); } catch (_) {}
    };
  }, [myGradesItems]);


  return <>
    {window.location.href.startsWith('https://pibb.scu.edu.cn/webapps/assignment/gradeAssignmentRedirector') && env.assignment.display ? (
      <GradeAssignment env={env} setEnv={setEnv} />
    ) : null}
    {window.location.href.startsWith('https://pibb.scu.edu.cn/webapps/assignment/uploadAssignment') && env.assignment.display ? (
      <StudentSubmissionPreview />
    ) : null}
  </>
}

export { App }
