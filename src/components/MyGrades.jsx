import React, { useEffect, useState } from 'react';
import { fetchAllMyGrades } from './fetchMyGrades';

async function fetchCourseMyGrades(course) {
  const url = `/webapps/bb-mygrades-BBLEARN/myGrades?course_id=${encodeURIComponent(course.id)}&stream_name=mygrades&is_stream=false`;
  try {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    const html = await res.text();
    const debug = {
      courseId: course.id,
      courseName: course.name,
      url,
      httpStatus: res.status,
      hasWrapper: false,
      rowCount: 0,
      itemsExtracted: 0,
      itemsPreview: [],
      notes: [],
    };
    if (!res.ok) { debug.notes.push(`HTTP ${res.status}`); }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const wrapper = doc.querySelector('#grades_wrapper');
    if (!wrapper) {
      return { items: [], debug };
    }
    debug.hasWrapper = true;
    const rows = Array.from(wrapper.querySelectorAll('div.sortable_item_row[role="row"], div.row[role="row"], div[role="row"]'));
    debug.rowCount = rows.length;
    const items = [];
    for (const row of rows) {
      try {
        const lastMsStr = row.getAttribute('lastactivity');
        const dueMsStr = row.getAttribute('duedate');
        const lastMs = lastMsStr && lastMsStr !== '9223372036854775807' ? parseInt(lastMsStr, 10) : NaN;
        const dueMs = dueMsStr && dueMsStr !== '9223372036854775807' ? parseInt(dueMsStr, 10) : NaN;

        const cellGradable = row.querySelector('.cell.gradable');
        const cellActivity = row.querySelector('.cell.activity');
        const cellGrade = row.querySelector('.cell.grade');

        const nameEl = cellGradable ? (cellGradable.querySelector('a[id]') || cellGradable.querySelector('span[id]')) : null;
        const itemName = nameEl ? (nameEl.textContent || '').trim() : '';
        const itemType = cellGradable ? ((cellGradable.querySelector('.itemCat')?.textContent || '').trim() || (row.classList.contains('calculatedRow') ? 'Calculated' : '')) : '';
        const dueText = cellGradable ? ((cellGradable.querySelector('.activityType')?.textContent || '').trim()) : '';

        const lastActivityText = cellActivity ? ((cellActivity.querySelector('.lastActivityDate')?.textContent || '').trim()) : '';
        // Some themes place multiple spans; prefer the last .grade text node if multiple
        let gradeMain = '';
        if (cellGrade) {
          const gNodes = cellGrade.querySelectorAll('.grade');
          if (gNodes && gNodes.length) {
            gradeMain = (gNodes[gNodes.length - 1].textContent || '').trim();
          } else {
            gradeMain = (cellGrade.textContent || '').trim();
          }
        }
        const pointsText = cellGrade ? ((cellGrade.querySelector('.pointsPossible')?.textContent || '').trim()) : '';

        // Keep all rows; some 'calculatedRow' may show '-' initially
        const item = {
          courseId: course.id,
          courseName: course.name,
          itemType,
          itemName,
          gradeText: gradeMain + (pointsText ? ` ${pointsText}` : ''),
          lastActivityMs: isFinite(lastMs) ? lastMs : NaN,
          lastActivityText,
          dueMs: isFinite(dueMs) ? dueMs : NaN,
          dueText,
        };
        items.push(item);
        debug.itemsPreview.push({
          itemType,
          itemName,
          gradeText: item.gradeText,
          lastActivityText,
          lastActivityMs: item.lastActivityMs,
          dueText,
          dueMs: item.dueMs,
          rowClass: row.className,
        });
      } catch (e) { debug.notes.push(`parse row failed: ${String((e && e.message) || e)}`); }
    }
    debug.itemsExtracted = items.length;
    return { items, debug };
  } catch (_) {
    return { items: [], debug: { courseId: course.id, courseName: course.name, url, error: 'fetch failed' } };
  }
}

async function fetchAllGrades() {
  const courseDb = await courseInfoCatch();
  const entries = Object.entries(courseDb).map(([name, v]) => ({ id: v.id, name }));
  // Fetch in small parallel batches to avoid overloading
  const out = [];
  const debugAll = { time: Date.now(), courseCount: entries.length, courses: [] };
  const batchSize = 4;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(c => fetchCourseMyGrades(c)));
    for (const r of batchResults) {
      if (Array.isArray(r)) {
        out.push(...r);
      } else if (r && r.items) {
        out.push(...r.items);
        if (r.debug) debugAll.courses.push(r.debug);
      }
    }
  }
  // Sort by last activity desc; fallback to due date desc if last missing
  out.sort((a, b) => {
    const la = isFinite(a.lastActivityMs) ? a.lastActivityMs : (isFinite(a.dueMs) ? a.dueMs : -Infinity);
    const lb = isFinite(b.lastActivityMs) ? b.lastActivityMs : (isFinite(b.dueMs) ? b.dueMs : -Infinity);
    return lb - la;
  });
  try {
    console.groupCollapsed('[BBEP MyGrades] Aggregated Grades JSON');
    console.log(JSON.stringify({ summary: { time: debugAll.time, courseCount: debugAll.courseCount, itemCount: out.length }, detail: debugAll }, null, 2));
    console.groupEnd();
  } catch (_) {}
  return out;
}

function formatDateTime(ms) {
  if (!isFinite(ms)) return '';
  try {
    const d = new Date(ms);
    return d.toLocaleString();
  } catch (_) { return ''; }
}

export default function MyGrades({ items: presetItems }) {
  const [items, setItems] = useState(presetItems || null);
  const [error, setError] = useState(null);
  const [ts, setTs] = useState(Date.now());

  useEffect(() => {
    try {
      if (Array.isArray(items)) {
        console.log('[BBEP MyGrades] render items length:', items.length);
      }
    } catch (_) {}
  }, [items]);

  useEffect(() => {
    if (presetItems && Array.isArray(presetItems)) {
      setItems(presetItems);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const data = await fetchAllMyGrades();
        if (alive) setItems(data);
      } catch (e) {
        if (alive) setError('Failed to load grades');
      }
    })();
    return () => { alive = false; };
  }, [ts, presetItems]);

  const toolbar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px 0' }}>
      <div style={{ fontSize: '12px', color: '#666' }}>Updated: {new Date(ts).toLocaleTimeString()}</div>
      {!presetItems && (
        <button className="genericButton" onClick={() => { setItems(null); setTs(Date.now()); }} style={{ fontSize: '12px' }}>Refresh</button>
      )}
    </div>
  );

  if (error) return <div>{toolbar}<div style={{ padding: '8px', color: '#b00' }}>{error}</div></div>;
  if (!items) return <div>{toolbar}<div style={{ padding: '8px' }}>Loading grades…</div></div>;
  if (!items.length) return <div>{toolbar}<div style={{ padding: '8px' }}>No recent grades.</div></div>;

  return (
    <div style={{ padding: '0 8px 12px' }}>
      {toolbar}
      <div style={{ display: 'grid', gap: '8px' }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderRadius: '6px', background: '#f6f7f9', border: '1px solid #e3e6ea' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.courseName}{it.itemType ? ` - ${it.itemType}` : ''}
              </div>
              <div style={{ fontSize: '13px', color: '#222', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.itemName || '(Unnamed)'}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {it.dueText || (isFinite(it.dueMs) ? `Due: ${formatDateTime(it.dueMs)}` : '')}
              </div>
            </div>
            <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 700, fontSize: '18px', color: '#111' }}>{it.gradeText}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {it.lastActivityText || (isFinite(it.lastActivityMs) ? formatDateTime(it.lastActivityMs) : '')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
