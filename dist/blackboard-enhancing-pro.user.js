// ==UserScript==
// @name         Blackboard 增强 Pro | Blackboard Enhanced Pro
// @namespace    npm/vite-plugin-monkey
// @version      1.0.2
// @author       Miang
// @description  Blackboard 增强插件，For SCUPIANS
// @license      MIT
// @match        https://pibb.scu.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' .calendar-container{position:fixed;z-index:10000;width:280px;opacity:.8}.portlet#module\\:_bbep_calendar .course{padding:0!important}.calendar-list{width:100%;height:80%;overflow-y:scroll;pointer-events:auto;max-height:300px;scrollbar-width:none;-ms-overflow-style:none}.calendar-list ::-webkit-scrollbar{width:0;background:transparent}.calendar-list::-webkit-scrollbar{width:0;height:0}.calendar-list-flat{width:100%;background:#fff}.calendar-cards{width:100%}.calendar-card{background:#ffffff;border:none;border-left:4px solid #137333;border-radius:8px;margin:8px;padding:8px 10px;box-shadow:0 1px 2px #0000000a;display:flex;flex-direction:column;gap:4px}.calendar-card.accent-red{border-left-color:#d93025}.calendar-card.accent-green{border-left-color:#137333}.calendar-card .line{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;color:#374151}.calendar-card .line.assignment{font-size:15px;font-weight:600;color:#111827}.calendar-card .line.assignment a{color:inherit;text-decoration:none}.calendar-card .line.assignment a:hover{text-decoration:underline}.calendar-card .line.event-type{font-size:12px;color:#6b7280;text-transform:none;display:flex;align-items:center;justify-content:space-between}.calendar-card .line.event-type .status-badge{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:9999px;font-size:11px;line-height:1.6}.calendar-card .line.event-type .status-badge.submitted{background:#e6f4ea;color:#137333}.calendar-card .line.event-type .status-badge.pending{background:#f3f4f6;color:#4b5563}.calendar-card .line.course a{color:#0366d6;text-decoration:none}.calendar-card .line.course a:hover{text-decoration:underline}.calendar-card .line.due{font-variant-numeric:tabular-nums}.calendar-card .meta{display:none}.calendar-card .meta .course a{color:#0366d6;text-decoration:none}.calendar-card .meta .course a:hover{text-decoration:underline}.countdown-pill{padding:2px 8px;border-radius:9999px;font-weight:700;font-size:12px}.countdown-pill.green{background:#e6f4ea;color:#137333}.countdown-pill.red{background:#fce8e6;color:#d93025}.calendar-card .attachments{margin-top:2px}.attachments-link,.attachments-toggle{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:9999px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;cursor:pointer;font-weight:600}.attachments-link .icon{opacity:.8}.attachments-link:hover,.attachments-toggle:hover{background:#f3f4f6;border-color:#cbd5e1}.attachments-link:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}.attachments-link.active{background:#eef2ff;border-color:#c7d2fe;color:#1d4ed8}.attachments-list{margin-top:6px;padding-left:2px;border-top:1px dashed #e5e7eb;padding-top:6px}.attachment-item a{color:#0366d6;text-decoration:none}.attachment-item a:hover{text-decoration:underline}.portlet#module\\:_bbep_calendar .bbep-toggle-btn{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:9999px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;cursor:pointer;font-weight:600}.portlet#module\\:_bbep_calendar .bbep-toggle-btn:hover{background:#f3f4f6;border-color:#cbd5e1}.portlet#module\\:_bbep_calendar .bbep-toggle-btn.active{background:#eef2ff;border-color:#c7d2fe;color:#1d4ed8}.portlet#module\\:_bbep_calendar .bbep-switch{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#374151}.portlet#module\\:_bbep_calendar .bbep-switch input{position:absolute;opacity:0;width:0;height:0}.portlet#module\\:_bbep_calendar .bbep-slider{width:28px;height:16px;background:#e5e7eb;border:1px solid #d1d5db;border-radius:9999px;position:relative;transition:background-color .2s ease,border-color .2s ease}.portlet#module\\:_bbep_calendar .bbep-switch:focus-within .bbep-slider{box-shadow:0 0 0 2px #93c5fd}.portlet#module\\:_bbep_calendar .bbep-slider:after{content:"";position:absolute;top:50%;left:2px;transform:translateY(-50%);width:12px;height:12px;background:#ffffff;border-radius:9999px;box-shadow:0 1px 2px #00000026;transition:left .2s ease}.portlet#module\\:_bbep_calendar .bbep-switch input:checked+.bbep-slider{background:#60a5fa;border-color:#3b82f6}.portlet#module\\:_bbep_calendar .bbep-switch input:checked+.bbep-slider:after{left:14px}.calendar-header,.calendar-row{display:grid;grid-template-columns:2fr 1.2fr 1.4fr 1fr;align-items:center;gap:8px;padding:8px 12px}.calendar-header{position:sticky;top:0;z-index:1;background:#f7f7f9;font-weight:600;border-bottom:1px solid #e5e5ea}.calendar-row{border-bottom:1px solid #ececec}.calendar-row .col-assignment{font-weight:600;color:#1f2328}.calendar-row .col-course a{color:#0366d6;text-decoration:none}.calendar-row .col-course a:hover{text-decoration:underline}.calendar-row .col-due{color:#444;font-variant-numeric:tabular-nums}.calendar-row .col-countdown{font-weight:700}.calendar-row .col-countdown.green{color:#137333}.calendar-row .col-countdown.red{color:#d93025}.calendar-item{width:95%;height:auto;margin-top:8px;border-radius:18px;margin-left:5px;pointer-events:auto;display:flex;flex-direction:column;align-items:left;cursor:move;-webkit-user-select:none;user-select:none}.calendar-item .assignment{margin-top:10px;margin-left:12px;margin-right:12px;font-size:17px;font-weight:700;color:#f5f5f6}.calendar-item .course-name{display:inline;margin-top:5px;margin-left:12px;margin-right:8px;font-weight:700;font-size:10px;color:#e0e0ef;cursor:pointer}.calendar-item .count-down{margin-left:12px;margin-bottom:10px;font-weight:700;font-size:22px;color:#e0e0ce}.memo-container{width:100%;height:auto;background-color:#dff0f4}.memo-container .memo-box{width:100%;height:288px;display:flex;flex-direction:column;align-items:center}.memo-container .memo-box .memo-list{border:1px solid #ccc;margin-top:20px;width:calc(100% - 32px);height:100%;overflow-y:scroll;pointer-events:auto}.memo-container .memo-box .memo-list .memo-input{height:300%;width:calc(100% - 10px);background-color:#fff;padding:5px;outline:none}.memo-container .memo-box .btn-box{margin-top:10px;width:100%;height:47.6px;position:relative}.memo-container .memo-box .btn-box .btn-save{background-color:#dadada;border:0 solid;width:46px;height:27.6px;position:absolute;right:70px;display:flex;justify-content:center;align-items:center;cursor:pointer}.memo-container .memo-box .btn-box .btn-save:hover{background-color:#fff}.memo-container .memo-box .btn-box .btn-clear{background-color:#333;border:0 solid;width:46px;height:27.6px;position:absolute;right:16px;display:flex;justify-content:center;align-items:center;color:#fff;cursor:pointer}.bbep-preview-toolbar{width:100%;display:flex;justify-content:flex-end;gap:8px;margin:6px 0 8px}.bbep-preview-memo{width:100%;margin:6px 0 8px}.bbep-preview-memo .memo-container .memo-box{height:auto}.bbep-preview-memo .memo-container .memo-list{height:auto;max-height:none;overflow:visible}.bbep-preview-memo .memo-container .memo-input{height:auto!important;min-height:1.6em;line-height:1.4}.memo-title{font-size:12px;color:#6b7280;margin:0 2px 2px}.bbep-download-btn{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:9999px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;text-decoration:none}.bbep-download-btn:hover{background:#f3f4f6;border-color:#cbd5e1}.bbep-deductions-bar{width:100%;background:#ffffff;padding:6px 6px 2px;border:1px solid #f3f4f6;box-sizing:border-box;overflow:hidden}.bbep-deductions-grid{display:grid;gap:6px;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));align-items:start;width:100%;box-sizing:border-box}.bbep-deductions-grid .grid-span-2{grid-column:span 2}.bbep-ded-meta-block{display:flex;flex-direction:column;gap:6px;padding:4px 3px;border:1px solid #f5f5f5;border-radius:6px;background:#fcfcfc;box-sizing:border-box}.bbep-header-meta{display:inline-flex;gap:8px;align-items:center;margin-left:8px}.bbep-header-meta .meta-item{display:inline-flex;gap:4px;align-items:center}.bbep-header-meta label{font-size:12px;color:#374151}.bbep-ded-cell{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 3px;border:1px solid #f5f5f5;border-radius:6px;background:#fcfcfc;box-sizing:border-box}.bbep-ded-label{font-size:10px;color:#6b7280}.bbep-ded-input{width:56px;padding:3px 6px;border:1px solid #e5e7eb;border-radius:6px;background:#ffffff;box-sizing:border-box}.bbep-ded-input:focus{outline:2px solid #93c5fd;outline-offset:1px}.bbep-ded-count,.bbep-ded-step{display:inline-flex;align-items:center;gap:6px}.bbep-ded-count label{font-size:12px;color:#374151}.bbep-ded-count-input,.bbep-ded-step-input{width:64px;padding:3px 6px;border:1px solid #d1d5db;border-radius:6px} ');

(function (React, require$$0) {
  'use strict';

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  async function courseInfoCatch() {
    try {
      const orig_course_info = await get_course_id();
      const course_db = store_course_id(orig_course_info);
      console.log("fetchCourse.js Success");
      return course_db;
    } catch (err) {
      console.log("fetchCourse.js Error: ", err);
    }
  }
  async function get_course_id() {
    const url = "/learn/api/public/v1/calendars/";
    return await fetch(url, { method: "GET" }).then((res) => res.json()).catch(console.log);
  }
  function store_course_id(_orig_course_info) {
    const _course_db = {};
    if (!_orig_course_info)
      return _course_db;
    const list = Array.isArray(_orig_course_info) ? _orig_course_info : _orig_course_info.results || [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item || !item.id || !item.name)
        continue;
      if (item.id === "INSTITUTION" || item.id === "PERSONAL")
        continue;
      if (_course_db[item.name])
        continue;
      const course_id = item.id;
      const course_name = item.name;
      const launcher = `https://pibb.scu.edu.cn/webapps/blackboard/execute/launcher?type=Course&id=${encodeURIComponent(course_id)}&url=`;
      _course_db[course_name] = {
        id: course_id,
        href: launcher
      };
    }
    return _course_db;
  }
  async function calendarInfoCatch() {
    try {
      var orig_todo_items = await get_calendar();
      var todo_items = await extractItems(orig_todo_items);
      todo_items = await setColor(todo_items);
      todo_items = await enrichRoleAndSubmission(todo_items);
      console.log("fetchCalendar.js Success");
      return todo_items;
    } catch (err) {
      console.log("fetchCalendar.js Error: ", err);
    }
  }
  async function get_calendar() {
    const url = "/webapps/calendar/calendarData/selectedCalendarEvents";
    const start_date = /* @__PURE__ */ new Date();
    start_date.setMonth(start_date.getMonth() - 1);
    const end_date = /* @__PURE__ */ new Date();
    end_date.setMonth(end_date.getMonth() + 1);
    const params = "?start=" + start_date.getTime() + "&end=" + end_date.getTime() + "&course_id=&mode=personal";
    return fetch(url + params, {
      method: "GET"
    }).then((res) => res.json()).then((data) => {
      return data;
    }).catch(console.log);
  }
  async function extractItems(_orig_todo_items) {
    let course_db;
    try {
      course_db = await courseInfoCatch();
    } catch (err) {
    }
    var _todo_items = [];
    for (let i = 0; i < _orig_todo_items.length; i++) {
      const it = _orig_todo_items[i];
      const courseEntry = course_db[it["calendarName"]];
      _todo_items.push({
        "id": i,
        // react key only
        "course": it["calendarName"],
        "todoItem": it["title"],
        "deadline": it["end"],
        "href": courseEntry ? courseEntry["href"] : "#",
        // extra fields for behavior
        "eventType": it["eventType"],
        "launchId": it["id"],
        // used to jump to attempt page for assignments
        "itemSourceId": it["itemSourceId"],
        "courseId": courseEntry ? courseEntry["id"] : null
      });
    }
    if (_todo_items.length === 0) {
      _todo_items.push({
        "id": 0,
        "course": "No DDL Currently",
        "todoItem": "HAVE A NICE DAY",
        // "deadline": _tmp_ddl,
        "href": "#"
      });
    } else {
      _todo_items.sort((a, b) => {
        return Date.parse(a.deadline) - Date.parse(b.deadline);
      });
    }
    console.log(_todo_items);
    return _todo_items;
  }
  async function setColor(_todo_items) {
    const generateGradientColors = (color1, color2, steps) => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const colors = [];
      for (let i = 0; i <= steps; i++) {
        const r = interpolate(rgb1.r, rgb2.r, i, steps);
        const g = interpolate(rgb1.g, rgb2.g, i, steps);
        const b = interpolate(rgb1.b, rgb2.b, i, steps);
        const hex = rgbToHex(r, g, b);
        colors.push(hex);
      }
      return colors;
    };
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgbToHex = (r, g, b) => {
      const hex = (r << 16 | g << 8 | b).toString(16);
      return "#" + hex.padStart(6, "0");
    };
    const interpolate = (start, end, step, totalSteps) => {
      return start + (end - start) * step / totalSteps;
    };
    const colorChoices = [
      ["#ff4e4f", "#ff9d81"],
      ["#032e71", "#b8e9fc"],
      ["#ff2121", "#d14631"]
    ];
    const colorArr = generateGradientColors(colorChoices[1][0], colorChoices[1][1], _todo_items.length);
    for (let i = 0; i < _todo_items.length; i++) {
      _todo_items[i]["color"] = colorArr[i];
    }
    return _todo_items;
  }
  async function enrichRoleAndSubmission(_todo_items) {
    const roleCache = {};
    const getCourseRole = async (courseId) => {
      if (!courseId)
        return "Student";
      if (roleCache[courseId])
        return roleCache[courseId];
      const url = `/learn/api/public/v1/courses/${encodeURIComponent(courseId)}/users/me`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        const role = data && data.courseRoleId ? data.courseRoleId : "Student";
        roleCache[courseId] = role;
        return role;
      } catch (e) {
        console.log("getCourseRole error", e);
        roleCache[courseId] = "Student";
        return "Student";
      }
    };
    const getAttemptCount = async (courseId, itemSourceId) => {
      if (!courseId || !itemSourceId)
        return 0;
      const url = `/learn/api/public/v2/courses/${encodeURIComponent(courseId)}/gradebook/columns/${encodeURIComponent(itemSourceId)}/attempts`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        const arr = data && Array.isArray(data.results) ? data.results : [];
        return arr.length;
      } catch (e) {
        console.log("getAttemptCount error", e);
        return 0;
      }
    };
    const courseIds = Array.from(new Set(_todo_items.map((it) => it.courseId).filter(Boolean)));
    await Promise.all(courseIds.map((id) => getCourseRole(id)));
    const enriched = await Promise.all(
      _todo_items.map(async (it) => {
        if (it.eventType !== "Assignment")
          return it;
        const role = await getCourseRole(it.courseId);
        const isStudentRole = role === "Student";
        const attemptCount = await getAttemptCount(it.courseId, it.itemSourceId);
        const submitted = attemptCount > 0;
        const needsGradingUrl = it.courseId ? `https://pibb.scu.edu.cn/webapps/gradebook/do/instructor/viewNeedsGrading?course_id=${encodeURIComponent(it.courseId)}` : null;
        return {
          ...it,
          isStudentRole,
          roleName: role,
          attemptCount,
          submitted,
          needsGradingUrl
        };
      })
    );
    return enriched;
  }
  var client = {};
  var m = require$$0;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const formatDuration = (ms) => {
    const second = 1e3;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor(ms % day / hour);
    const minutes = Math.floor(ms % hour / minute);
    const seconds = Math.floor(ms % minute / second);
    let result = "";
    if (days > 0) {
      result += days + "天";
    }
    if (hours > 0) {
      result += hours + "小时";
    }
    if (minutes > 0) {
      result += minutes + "分钟";
    }
    if (seconds > 0) {
      result += seconds + "秒";
    }
    return result;
  };
  const formatDue = (isoLike) => {
    if (!isoLike)
      return "-";
    const d = new Date(isoLike);
    if (isNaN(d.getTime()))
      return "-";
    return d.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };
  function Calendar(props) {
    const variant = props.variant || "overlay";
    const draggableEnabled = variant === "overlay";
    const showGraded = !!props.showGraded;
    const [dragging, setDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState([0, 0]);
    const [loc, setLoc] = React.useState(() => draggableEnabled ? _GM_getValue("loc", [150, 150]) : [0, 0]);
    const [now, setNow] = React.useState(Date.now());
    const handleMouseDown = (e) => {
      if (!draggableEnabled)
        return;
      if (e.target && (e.target.closest("a") || e.target.closest("button")))
        return;
      setDragging(true);
      setDragOffset([e.clientX - loc[0], e.clientY - loc[1]]);
    };
    const handleMouseMove = (e) => {
      if (draggableEnabled && dragging) {
        setLoc([e.clientX - dragOffset[0], e.clientY - dragOffset[1]]);
        _GM_setValue("loc", [e.clientX - dragOffset[0], e.clientY - dragOffset[1]]);
      }
    };
    const handleMouseUp = () => {
      if (!draggableEnabled)
        return;
      setDragging(false);
    };
    React.useEffect(() => {
      const it = setInterval(() => setNow(Date.now()), 1e3);
      return () => clearInterval(it);
    }, []);
    const [gradedDb, setGradedDb] = React.useState(() => _GM_getValue("gradedDB", {}));
    const isGraded = (todo) => {
      if (!todo)
        return false;
      const key = `${todo.courseId || ""}:${todo.itemSourceId || ""}`;
      return !!gradedDb[key];
    };
    const toggleGraded = (todo) => {
      const key = `${todo.courseId || ""}:${todo.itemSourceId || ""}`;
      const next = { ...gradedDb, [key]: !gradedDb[key] };
      setGradedDb(next);
      _GM_setValue("gradedDB", next);
    };
    const itemsToShow = (props.todo_items || []).filter((it) => {
      if (it && it.eventType === "Assignment" && typeof it.isStudentRole !== "undefined" && !it.isStudentRole) {
        if (!showGraded && isGraded(it))
          return false;
      }
      return true;
    });
    const cards = itemsToShow.map((todo) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      CalendarCard,
      {
        todo,
        now,
        isGraded: isGraded(todo),
        onToggleGraded: () => toggleGraded(todo),
        draggableEnabled,
        handleMouseDown
      },
      todo.id
    ));
    React.useEffect(() => {
      if (!draggableEnabled)
        return;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging, draggableEnabled]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "calendar-container",
        style: draggableEnabled ? { top: loc[1], left: loc[0] } : { position: "static", top: "auto", left: "auto", width: "100%", opacity: 1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendar-list calendar-cards", children: cards })
      }
    ) });
  }
  function CalendarCard({ todo, now, isGraded, onToggleGraded, draggableEnabled, handleMouseDown }) {
    const deadlineMs = todo["deadline"] ? Date.parse(todo["deadline"]) : NaN;
    const validDeadline = !isNaN(deadlineMs);
    const remain = validDeadline ? deadlineMs - now : NaN;
    const within24h = validDeadline ? remain <= 24 * 60 * 60 * 1e3 : false;
    const overdue = validDeadline ? remain < 0 : false;
    const cntText = validDeadline ? overdue ? "已截止" : formatDuration(remain) : "-";
    const cntClass = overdue || within24h ? "red" : "green";
    const accentClass = overdue || within24h ? "accent-red" : "accent-green";
    let assignHref = null;
    if (todo["eventType"] === "Assignment") {
      if (typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole && todo.courseId) {
        assignHref = todo.needsGradingUrl || `https://pibb.scu.edu.cn/webapps/gradebook/do/instructor/viewNeedsGrading?course_id=${encodeURIComponent(todo.courseId)}`;
      } else if (todo["launchId"]) {
        assignHref = `https://pibb.scu.edu.cn/webapps/calendar/launch/attempt/${encodeURIComponent(todo["launchId"])}`;
      }
    }
    const titleText = `${todo["todoItem"] || ""}`;
    const [expanded, setExpanded] = React.useState(false);
    const [attachments, setAttachments] = React.useState(null);
    const [contentId, setContentId] = React.useState(null);
    const [loadingAtt, setLoadingAtt] = React.useState(false);
    const [errorAtt, setErrorAtt] = React.useState(null);
    const fetchAttachments = async () => {
      if (attachments !== null)
        return;
      if (todo.eventType !== "Assignment") {
        setAttachments([]);
        setContentId(null);
        return;
      }
      if (!todo.courseId || !todo.itemSourceId) {
        setAttachments([]);
        setContentId(null);
        return;
      }
      try {
        setLoadingAtt(true);
        setErrorAtt(null);
        const colUrl = `/learn/api/public/v2/courses/${encodeURIComponent(todo.courseId)}/gradebook/columns/${encodeURIComponent(todo.itemSourceId)}`;
        const colRes = await fetch(colUrl, { method: "GET" });
        const col = await colRes.json();
        const cId = col && col.contentId;
        if (!cId) {
          setContentId(null);
          setAttachments([]);
          setLoadingAtt(false);
          return;
        }
        setContentId(cId);
        const attUrl = `/learn/api/public/v1/courses/${encodeURIComponent(todo.courseId)}/contents/${encodeURIComponent(cId)}/attachments`;
        const attRes = await fetch(attUrl, { method: "GET" });
        const attData = await attRes.json();
        const list = attData && Array.isArray(attData.results) ? attData.results : [];
        setAttachments(list);
      } catch (e) {
        setErrorAtt("加载附件失败");
        setAttachments([]);
      } finally {
        setLoadingAtt(false);
      }
    };
    const onToggle = async () => {
      const next = !expanded;
      setExpanded(next);
      if (next) {
        await fetchAttachments();
      }
    };
    const roleText = typeof todo.roleName === "string" && todo.roleName ? todo.roleName : typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole ? "Instructor" : "Student";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `calendar-card ${accentClass}`,
        onMouseDown: handleMouseDown,
        style: { cursor: draggableEnabled ? "move" : "default" },
        children: [
          todo["eventType"] ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "line event-type", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "left", children: [
              todo["eventType"] === "Assignment" ? `Assignment - ${roleText}` : todo["eventType"],
              todo["eventType"] === "Assignment" ? typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-badge submitted", children: [
                "已提交",
                Number.isFinite(todo.attemptCount) ? todo.attemptCount : 0,
                "份"
              ] }) : typeof todo["submitted"] !== "undefined" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-badge ${todo["submitted"] ? "submitted" : "pending"}`, children: todo["submitted"] ? "已提交" : "未提交" }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "right", style: { display: "inline-flex", gap: "6px" }, children: [
              typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole && todo.eventType === "Assignment" && todo.courseId && todo.itemSourceId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: `attachments-link ${isGraded ? "active" : ""}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    onToggleGraded && onToggleGraded();
                  },
                  "aria-pressed": isGraded,
                  title: "标记为已批阅",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isGraded ? "已批阅" : "未批阅" })
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `attachments-link ${expanded ? "active" : ""}`,
                  onClick: onToggle,
                  "aria-expanded": expanded,
                  "aria-label": expanded ? "收起附件" : "查看附件",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "icon", viewBox: "0 0 24 24", width: "14", height: "14", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M16.5 6.5L9 14a3 3 0 11-4.243-4.243l8.485-8.485a5 5 0 117.071 7.071l-9.193 9.193a7 7 0 11-9.9-9.9l7.778-7.778 1.414 1.414L2.636 7.15a5 5 0 107.071 7.071l9.193-9.193a3 3 0 10-4.243-4.243L6.172 8.271l1.414 1.414L16.5 2.771" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: expanded ? "收起附件" : "附件" })
                  ]
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line assignment", children: assignHref ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: assignHref, children: titleText }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: titleText }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line course", children: todo["href"] && todo["href"] !== "#" ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: todo["href"], children: todo["course"] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: todo["course"] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "line due", children: [
            "Due: ",
            formatDue(todo["deadline"])
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line countdown", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `countdown-pill ${cntClass}`, children: cntText }) }),
          expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "attachments-list", children: [
            loadingAtt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: "加载中..." }),
            errorAtt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: errorAtt }),
            !loadingAtt && !errorAtt && attachments && attachments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: "无附件" }),
            !loadingAtt && !errorAtt && attachments && attachments.length > 0 && attachments.map((att) => {
              const href = contentId ? `https://pibb.scu.edu.cn/learn/api/public/v1/courses/${encodeURIComponent(todo.courseId)}/contents/${encodeURIComponent(contentId)}/attachments/${encodeURIComponent(att.id)}/download` : "#";
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: "_blank", rel: "noreferrer", children: att.fileName || "附件" }) }, att.id);
            })
          ] })
        ]
      }
    );
  }
  function writeDeductionsToFeedback(values) {
    try {
      const iframe = document.querySelector("#feedbacktext_ifr");
      if (!iframe || !iframe.contentDocument)
        return;
      const doc = iframe.contentDocument;
      const body = doc.documentElement.querySelector("body");
      if (!body)
        return;
      const lines = [];
      for (let i = 0; i < values.length; i++) {
        const v = Number(values[i]) || 0;
        if (v > 0)
          lines.push(`${i + 1}.-${v}`);
      }
      let holder = doc.getElementById("bbep-deductions");
      if (!holder) {
        holder = doc.createElement("div");
        holder.id = "bbep-deductions";
        body.insertBefore(holder, body.firstChild);
      }
      holder.innerHTML = "";
      lines.forEach((l2) => {
        const lineDiv = doc.createElement("div");
        lineDiv.textContent = l2;
        holder.appendChild(lineDiv);
      });
      body.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (e) {
    }
  }
  function DeductionsToolbar() {
    const [count, setCount] = React.useState(() => _GM_getValue("bbep_ded_count", 5));
    const [step, setStep] = React.useState(() => _GM_getValue("bbep_ded_step", 1));
    const [values, setValues] = React.useState(() => {
      const n2 = typeof count === "number" ? count : 5;
      return new Array(n2).fill(0);
    });
    React.useEffect(() => {
      setValues((prev) => {
        const next = [...prev];
        if (count > next.length) {
          while (next.length < count)
            next.push(0);
        } else if (count < next.length) {
          next.length = count;
        }
        return next;
      });
    }, [count]);
    React.useEffect(() => {
      _GM_setValue("bbep_ded_count", count);
      writeDeductionsToFeedback(values);
    }, [count, values]);
    React.useEffect(() => {
      _GM_setValue("bbep_ded_step", step);
    }, [step]);
    React.useEffect(() => {
      const onCfg = (e) => {
        const d = e.detail || {};
        if (typeof d.count === "number")
          setCount(d.count);
        if (typeof d.step === "number")
          setStep(d.step);
      };
      window.addEventListener("bbep:dedConfig", onCfg);
      return () => window.removeEventListener("bbep:dedConfig", onCfg);
    }, []);
    const handleValueChange = (idx, v) => {
      const num = Math.max(0, parseFloat(v || "")) || 0;
      setValues((prev) => {
        const next = [...prev];
        next[idx] = num;
        return next;
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bbep-deductions-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bbep-deductions-grid", children: values.map((val, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bbep-ded-cell", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bbep-ded-label", children: i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "bbep-ded-input",
          type: "number",
          min: "0",
          step,
          placeholder: "0",
          value: val === 0 ? "" : val,
          onChange: (e) => handleValueChange(i, e.target.value)
        }
      )
    ] }, i)) }) });
  }
  function Memo({ props }) {
    const onInput = (e) => {
      const text = e.currentTarget.innerText;
      props.setEnv({
        ...props.env,
        assignment: {
          ...props.env.assignment,
          memo: text
        }
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-list", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-input", contentEditable: true, onInput, children: props.env.assignment.memo }) }) }) });
  }
  class DownloadPreviewer {
    constructor(gradeProps) {
      this.timer = null;
      this.objectUrl = null;
      this.inited = false;
      this.iframe = null;
      this.container = null;
      this.maxHeightPx = null;
      this.toolbar = null;
      this.dedRoot = null;
      this.memoRoot = null;
      this.gradeProps = gradeProps;
      this.hiddenEls = [];
      this.checkDOMReady();
    }
    checkDOMReady() {
      this.timer = setInterval(() => {
        try {
          const btn = document.querySelector("#downloadPanelButton");
          const previewer = document.querySelector("#previewer");
          const inner = document.querySelector("#previewerInner");
          if (btn && previewer && inner && !this.inited) {
            this.inited = true;
            clearInterval(this.timer);
            this.timer = null;
            this.replaceWithIframe(btn.getAttribute("href"), inner);
          }
        } catch (e) {
        }
      }, 500);
    }
    async replaceWithIframe(href, container) {
      try {
        const loading = document.getElementById("loadingMessage");
        if (loading)
          loading.style.display = "";
        const blob = await this._downloadPdfWithRetry(href, 3);
        if (!blob) {
          if (loading)
            loading.style.display = "none";
          const extra = document.getElementById("downloadPanelExtraMessage");
          if (extra) {
            extra.textContent = "无法在线预览，请重新刷新页面。若仍不行，请点击下方“Download”查看。";
            extra.style.display = "";
          }
          return;
        }
        if (this.objectUrl)
          URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = URL.createObjectURL(blob);
        try {
          const outer = document.getElementById("previewer");
          let h = 0;
          if (outer)
            h = outer.getBoundingClientRect().height;
          if (!h && container)
            h = container.getBoundingClientRect().height;
          if (h)
            this.maxHeightPx = Math.max(100, Math.floor(h));
        } catch (_) {
        }
        while (container.firstChild)
          container.removeChild(container.firstChild);
        const dedMount = document.createElement("div");
        container.appendChild(dedMount);
        try {
          this.dedRoot = client.createRoot(dedMount);
          this.dedRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(DeductionsToolbar, {}));
        } catch (_) {
        }
        const memoHost = document.createElement("div");
        memoHost.className = "bbep-preview-memo";
        container.appendChild(memoHost);
        try {
          this.memoRoot = client.createRoot(memoHost);
          this.memoRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Memo, { props: this.gradeProps }));
        } catch (_) {
        }
        this.toolbar = memoHost;
        const iframe = document.createElement("iframe");
        iframe.src = this.objectUrl;
        iframe.style.width = "100%";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";
        iframe.setAttribute("title", "Assignment Preview");
        container.appendChild(iframe);
        this.iframe = iframe;
        this.container = container;
        this.updateIframeHeight();
        iframe.onload = () => {
          try {
            iframe.style.visibility = "";
            this.updateIframeHeight();
          } catch (_) {
          }
          const downloadPanel = document.getElementById("downloadPanel");
          if (downloadPanel)
            downloadPanel.style.display = "none";
          if (loading)
            loading.style.display = "none";
          this.collapseTopAreas();
          setTimeout(() => this.scrollToPanelButton(), 0);
        };
      } catch (e) {
        const loading = document.getElementById("loadingMessage");
        if (loading)
          loading.style.display = "none";
      }
    }
    collapseTopAreas() {
      const targets = ["#globalNavPageNavArea", "#breadcrumbs", "#actionbar"];
      targets.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          const prev = el.style.display;
          this.hiddenEls.push({ el, prev });
          el.style.display = "none";
        }
      });
    }
    scrollToPanelButton() {
      try {
        const el = document.getElementById("panelbutton2");
        if (!el)
          return;
        if (el.scrollIntoView) {
          el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        } else {
          const y = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 8;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } catch (_) {
      }
    }
    updateIframeHeight() {
      if (!this.iframe || !this.container)
        return;
      try {
        let base = this.maxHeightPx;
        if (!base) {
          const outer = document.getElementById("previewer");
          if (outer)
            base = Math.floor(outer.getBoundingClientRect().height);
          if (!base && this.container)
            base = Math.floor(this.container.getBoundingClientRect().height);
        }
        if (!base || base <= 0)
          base = 600;
        const toolbarH = this.toolbar ? Math.ceil(this.toolbar.getBoundingClientRect().height) : 0;
        let desired = base - toolbarH;
        if (desired < 120)
          desired = 120;
        this.iframe.style.height = desired + "px";
      } catch (_) {
      }
    }
    async _downloadPdfWithRetry(href, maxAttempts = 3) {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch(href, { method: "GET" });
          if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          let isPdf = false;
          const ct = (res.headers.get("content-type") || "").toLowerCase();
          if (ct.includes("application/pdf")) {
            isPdf = true;
          } else {
            try {
              const head = await blob.slice(0, 5).text();
              if (head && head.startsWith("%PDF"))
                isPdf = true;
            } catch (_) {
            }
          }
          if (isPdf)
            return blob;
          throw new Error("Not PDF");
        } catch (e) {
          if (attempt < maxAttempts) {
            await sleep(600 * attempt);
            continue;
          } else {
            return null;
          }
        }
      }
      return null;
    }
    remove() {
      if (this.timer)
        clearInterval(this.timer);
      if (this.objectUrl) {
        try {
          URL.revokeObjectURL(this.objectUrl);
        } catch (_) {
        }
      }
      if (this.dedRoot) {
        try {
          this.dedRoot.unmount();
        } catch (_) {
        }
        this.dedRoot = null;
      }
      if (this.memoRoot) {
        try {
          this.memoRoot.unmount();
        } catch (_) {
        }
        this.memoRoot = null;
      }
      if (this.hiddenEls && this.hiddenEls.length) {
        this.hiddenEls.forEach(({ el, prev }) => {
          try {
            el.style.display = prev;
          } catch (_) {
          }
        });
        this.hiddenEls = [];
      }
    }
  }
  function HeaderDedMeta() {
    const [count, setCount] = React.useState(() => _GM_getValue("bbep_ded_count", 5));
    const [step, setStep] = React.useState(() => _GM_getValue("bbep_ded_step", 1));
    React.useEffect(() => {
      _GM_setValue("bbep_ded_count", count);
      window.dispatchEvent(new CustomEvent("bbep:dedConfig", { detail: { count } }));
    }, [count]);
    React.useEffect(() => {
      _GM_setValue("bbep_ded_step", step);
      window.dispatchEvent(new CustomEvent("bbep:dedConfig", { detail: { step } }));
    }, [step]);
    const onCount = (e) => {
      const v = Math.max(1, Math.min(100, parseInt(e.target.value || "0", 10)));
      setCount(v);
    };
    const onStep = (e) => {
      let v = parseFloat(e.target.value || "");
      if (!isFinite(v) || v <= 0)
        v = 1;
      v = Math.min(100, Math.max(1e-3, v));
      setStep(v);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bbep-header-meta", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "meta-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "题目数" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "bbep-ded-count-input",
            type: "number",
            min: "1",
            max: "100",
            value: count,
            onChange: onCount
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "meta-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "步长" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "bbep-ded-step-input",
            type: "number",
            min: "0.001",
            step: "0.1",
            value: step,
            onChange: onStep
          }
        )
      ] })
    ] });
  }
  class PrettierPage {
    constructor() {
      this.expand;
      this.fb;
      this.checkDOMReady();
    }
    checkDOMReady() {
      try {
        const checkInterval = setInterval(() => {
          this.expand = document.querySelector("#currentAttempt_gradeDataPanel");
          this.fb = document.querySelector("#feedbacktext_tbl > tbody > tr > td > span");
          const help = document.getElementById("helpPageTitle");
          if (this.expand && this.fb) {
            this.expand.style.display = "";
            this.fb.remove();
            clearInterval(checkInterval);
          }
          if (help) {
            try {
              help.remove();
            } catch (_) {
            }
          }
        }, 500);
      } catch (err) {
      }
    }
  }
  class AutoCalculator {
    constructor() {
      this.textArea;
      this.fillSpace;
      this.totolGrade;
      this.lastGrade;
      this.checkDOMReady();
    }
    checkDOMReady() {
      const checkInterval = setInterval(() => {
        try {
          this.textArea = this.return_textArea();
          this.fillSpace = this.return_fillSpace();
          this.totolGrade = this.return_totalGrade();
          this.lastGrade = this.return_lastGrade();
          if (this.textArea && this.fillSpace && this.totolGrade && this.lastGrade) {
            clearInterval(checkInterval);
            this.setupEventListeners();
          }
        } catch (err) {
        }
      }, 500);
    }
    setupEventListeners() {
      this.textArea.addEventListener("input", this.handleInput.bind(this));
      if (this.lastGrade != "-") {
        this.fillSpace.value = this.lastGrade;
      } else {
        this.fillSpace.value = this.totolGrade;
      }
    }
    return_textArea() {
      return document.querySelector("#feedbacktext_ifr").contentDocument.documentElement.querySelector("body");
    }
    return_fillSpace() {
      return document.querySelector("#currentAttempt_grade");
    }
    return_totalGrade() {
      return parseFloat(document.querySelector("#currentAttempt_pointsPossible").innerHTML.split("/")[1]);
    }
    return_lastGrade() {
      return document.querySelector("#aggregateGrade").value;
    }
    handleInput(e) {
      const numsArr = e.target.innerHTML.match(/-\d+(\.\d+)?/g);
      if (!numsArr) {
        this.fillSpace.value = this.totolGrade;
      } else {
        let grade = this.totolGrade;
        numsArr.forEach((num) => {
          grade += parseFloat(num);
        });
        this.fillSpace.value = grade;
      }
    }
    remove() {
      if (this.textArea) {
        this.textArea.removeEventListener("input", this.handleInput);
      }
    }
  }
  function GradeAssignment(props) {
    React.useEffect(() => {
      new PrettierPage();
      const AC = new AutoCalculator();
      const DP = new DownloadPreviewer(props);
      const bro = document.querySelector("#currentAttempt_submission");
      const app = document.createElement("div");
      bro.parentNode.style.height = "auto";
      bro.parentNode.insertBefore(app, bro);
      const root = client.createRoot(app);
      root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {}));
      let headerRoot = null;
      let headerHost = null;
      try {
        const titleExtra = document.getElementById("_titlebarExtraContent") || document.getElementById("pageTitleBar");
        if (titleExtra) {
          headerHost = document.createElement("span");
          headerHost.className = "bbep-header-meta-container";
          titleExtra.appendChild(headerHost);
          headerRoot = client.createRoot(headerHost);
          headerRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(HeaderDedMeta, {}));
        }
      } catch (_) {
      }
      return () => {
        if (root) {
          root.unmount();
        }
        AC.remove();
        DP.remove();
        if (headerRoot) {
          try {
            headerRoot.unmount();
          } catch (_) {
          }
          if (headerHost && headerHost.parentNode)
            headerHost.parentNode.removeChild(headerHost);
        }
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  function App() {
    const [env, setEnv] = React.useState(
      _GM_getValue("env", {
        calendar: {
          display: true,
          showSubmitted: true,
          showGraded: false
        },
        assignment: {
          display: true,
          memo: ""
        }
      })
    );
    const [todoItems, setTodoItems] = React.useState(null);
    React.useEffect(() => {
      const fetchTodoItems = async () => {
        const items = await calendarInfoCatch();
        setTodoItems(items);
      };
      fetchTodoItems();
    }, []);
    React.useEffect(() => {
      _GM_setValue("env", env);
      console.log("Setting Saved");
    }, [env]);
    React.useEffect(() => {
      const isPortal = window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal");
      if (!isPortal || !env.calendar.display || !todoItems)
        return;
      const host = document.getElementById("column2") || document.querySelector("#column1") || document.querySelector(".column-3") || document.body;
      let moduleEl = document.getElementById("module:_bbep_calendar");
      if (!moduleEl) {
        moduleEl = document.createElement("div");
        moduleEl.className = "portlet clearfix reorderableModule";
        moduleEl.id = "module:_bbep_calendar";
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
        try {
          if (host && (host.firstElementChild || host.firstChild)) {
            host.insertBefore(moduleEl, host.firstElementChild || host.firstChild);
          } else if (host) {
            host.appendChild(moduleEl);
          }
        } catch (_) {
          host.appendChild(moduleEl);
        }
      }
      const toggleInput = moduleEl.querySelector("#bbep_toggle_show_submitted");
      if (toggleInput) {
        toggleInput.checked = !!env.calendar.showSubmitted;
        toggleInput.setAttribute("aria-checked", env.calendar.showSubmitted ? "true" : "false");
        toggleInput.onchange = (e) => {
          const checked = !!e.target.checked;
          setEnv((prev) => ({
            ...prev,
            calendar: { ...prev.calendar, showSubmitted: checked }
          }));
        };
      }
      const toggleGraded = moduleEl.querySelector("#bbep_toggle_show_graded");
      if (toggleGraded) {
        toggleGraded.checked = !!env.calendar.showGraded;
        toggleGraded.setAttribute("aria-checked", env.calendar.showGraded ? "true" : "false");
        toggleGraded.onchange = (e) => {
          const checked = !!e.target.checked;
          setEnv((prev) => ({
            ...prev,
            calendar: { ...prev.calendar, showGraded: checked }
          }));
        };
      }
      const mountPoint = moduleEl.querySelector("#div_bbep_calendar_root");
      const root = client.createRoot(mountPoint);
      const itemsFiltered = env.calendar.showSubmitted ? todoItems : todoItems.filter((it) => !(it.eventType === "Assignment" && it.submitted));
      const itemsForRender = (itemsFiltered || []).slice().sort((a, b) => {
        const aSub = a.eventType === "Assignment" && a.submitted ? 1 : 0;
        const bSub = b.eventType === "Assignment" && b.submitted ? 1 : 0;
        if (aSub !== bSub)
          return aSub - bSub;
        const ad = a.deadline ? Date.parse(a.deadline) : Infinity;
        const bd = b.deadline ? Date.parse(b.deadline) : Infinity;
        return ad - bd;
      });
      root.render(
        /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { todo_items: itemsForRender, showGraded: env.calendar.showGraded, variant: "module" }) })
      );
      return () => {
        try {
          root.unmount();
        } catch (_) {
        }
      };
    }, [todoItems, env.calendar.display, env.calendar.showSubmitted]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/assignment/gradeAssignmentRedirector") && env.assignment.display ? /* @__PURE__ */ jsxRuntimeExports.jsx(GradeAssignment, { env, setEnv }) : null });
  }
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
  );

})(React, ReactDOM);