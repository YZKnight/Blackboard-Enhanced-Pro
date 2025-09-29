import { courseInfoCatch } from './fetchCourse';

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
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const wrapper = doc.querySelector('#grades_wrapper');
    if (!wrapper) return { items: [], debug };
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

export async function fetchAllMyGrades() {
  const courseDb = await courseInfoCatch();
  const entries = Object.entries(courseDb).map(([name, v]) => ({ id: v.id, name }));
  const out = [];
  const debugAll = { time: Date.now(), courseCount: entries.length, courses: [] };
  const batchSize = 4;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(c => fetchCourseMyGrades(c)));
    for (const r of batchResults) {
      if (r && r.items) out.push(...r.items);
      if (r && r.debug) debugAll.courses.push(r.debug);
    }
  }
  // Sort desc by last activity (fallback to due date)
  out.sort((a, b) => {
    const la = isFinite(a.lastActivityMs) ? a.lastActivityMs : (isFinite(a.dueMs) ? a.dueMs : -Infinity);
    const lb = isFinite(b.lastActivityMs) ? b.lastActivityMs : (isFinite(b.dueMs) ? b.dueMs : -Infinity);
    return lb - la;
  });
  // Keep only items with actual grade values
  const hasRealGrade = (t) => {
    if (!t) return false;
    const s = String(t).trim();
    if (!s) return false;
    if (s === '-' || s.startsWith('-')) return false;
    return true;
  };
  const gradedOnly = out.filter(it => hasRealGrade(it.gradeText));
  try {
    console.groupCollapsed('[BBEP MyGrades] Aggregated Grades JSON');
    console.log(JSON.stringify({ summary: { time: debugAll.time, courseCount: debugAll.courseCount, itemCount: gradedOnly.length }, detail: debugAll }, null, 2));
    console.groupEnd();
  } catch (_) {}
  return gradedOnly;
}

