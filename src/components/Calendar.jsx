import './Calendar.css'


import { useEffect, useState } from 'react';
import { GM_setValue, GM_getValue } from '$'

// ms => x天x小时x分钟x秒
const formatDuration = (ms) => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    let result = '';
    if (days > 0) {
        result += days + '天';
    }
    if (hours > 0) {
        result += hours + '小时';
    }
    if (minutes > 0) {
        result += minutes + '分钟';
    }
    if (seconds > 0) {
        result += seconds + '秒';
    }
    return result;
};

// format due date time to local string, 24h
const formatDue = (isoLike) => {
    if (!isoLike) return '-';
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
    });
}


export function Calendar(props) {
    const variant = props.variant || 'overlay'; // 'overlay' | 'module'
    const draggableEnabled = variant === 'overlay';
    const showGraded = !!props.showGraded;

    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState([0, 0]);
    const [loc, setLoc] = useState(() => draggableEnabled ? GM_getValue('loc', [150, 150]) : [0, 0]);
    const [now, setNow] = useState(Date.now());

    const handleMouseDown = (e) => {
        if (!draggableEnabled) return;
        if (e.target && (e.target.closest('a') || e.target.closest('button'))) return;
        setDragging(true)
        setDragOffset([e.clientX - loc[0], e.clientY - loc[1]])
    };


    const handleMouseMove = (e) => {
        if (draggableEnabled && dragging) {
            setLoc([e.clientX - dragOffset[0], e.clientY - dragOffset[1]])
            GM_setValue('loc', [e.clientX - dragOffset[0], e.clientY - dragOffset[1]])
        }
    };

    const handleMouseUp = () => {
        if (!draggableEnabled) return;
        setDragging(false);
    }

    // global ticking for countdown
    useEffect(() => {
        const it = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(it);
    }, []);

    // Local DB for graded state (non-student role)
    const [gradedDb, setGradedDb] = useState(() => GM_getValue('gradedDB', {}));
    const isGraded = (todo) => {
        if (!todo) return false;
        const key = `${todo.courseId || ''}:${todo.itemSourceId || ''}`;
        return !!gradedDb[key];
    };
    const toggleGraded = (todo) => {
        const key = `${todo.courseId || ''}:${todo.itemSourceId || ''}`;
        const next = { ...gradedDb, [key]: !gradedDb[key] };
        setGradedDb(next);
        GM_setValue('gradedDB', next);
    };

    // Filter out graded ones for non-student when showGraded is false
    const itemsToShow = (props.todo_items || []).filter(it => {
        if (it && it.eventType === 'Assignment' && typeof it.isStudentRole !== 'undefined' && !it.isStudentRole) {
            if (!showGraded && isGraded(it)) return false;
        }
        return true;
    });

    const cards = itemsToShow.map((todo) => (
        <CalendarCard
            key={todo.id}
            todo={todo}
            now={now}
            isGraded={isGraded(todo)}
            onToggleGraded={() => toggleGraded(todo)}
            draggableEnabled={draggableEnabled}
            handleMouseDown={handleMouseDown}
        />
    ));

    useEffect(() => {
        if (!draggableEnabled) return;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return (() => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        })
    }, [dragging, draggableEnabled]);


    return (<div>
        <div className="calendar-container"
            style={
                draggableEnabled
                    ? { top: loc[1], left: loc[0] }
                    : { position: 'static', top: 'auto', left: 'auto', width: '100%', opacity: 1 }
            }
        >
            <div className='calendar-list calendar-cards'>
                {cards}
            </div>
        </div>
    </div>)
}

function CalendarCard({ todo, now, isGraded, onToggleGraded, draggableEnabled, handleMouseDown }) {
    const deadlineMs = todo['deadline'] ? Date.parse(todo['deadline']) : NaN;
    const validDeadline = !isNaN(deadlineMs);
    const remain = validDeadline ? (deadlineMs - now) : NaN;
    const within24h = validDeadline ? (remain <= 24 * 60 * 60 * 1000) : false;
    const overdue = validDeadline ? (remain < 0) : false;
    const cntText = validDeadline ? (overdue ? '已截止' : formatDuration(remain)) : '-';
    const cntClass = overdue || within24h ? 'red' : 'green';
    const accentClass = overdue || within24h ? 'accent-red' : 'accent-green';

    let assignHref = null;
    if (todo['eventType'] === 'Assignment') {
        if (typeof todo.isStudentRole !== 'undefined' && !todo.isStudentRole && todo.courseId) {
            // 非学生：跳转到“需评分”页面
            assignHref = todo.needsGradingUrl || `https://pibb.scu.edu.cn/webapps/gradebook/do/instructor/viewNeedsGrading?course_id=${encodeURIComponent(todo.courseId)}`;
        } else if (todo['launchId']) {
            // 学生：跳转到作业尝试页
            assignHref = `https://pibb.scu.edu.cn/webapps/calendar/launch/attempt/${encodeURIComponent(todo['launchId'])}`;
        }
    }
    const titleText = `${todo['todoItem'] || ''}`;

    const [expanded, setExpanded] = useState(false);
    const [attachments, setAttachments] = useState(null); // null=not loaded; []=no attachments
    const [contentId, setContentId] = useState(null);
    const [loadingAtt, setLoadingAtt] = useState(false);
    const [errorAtt, setErrorAtt] = useState(null);

    const fetchAttachments = async () => {
        if (attachments !== null) return; // loaded
        if (todo.eventType !== 'Assignment') { setAttachments([]); setContentId(null); return; }
        if (!todo.courseId || !todo.itemSourceId) { setAttachments([]); setContentId(null); return; }
        try {
            setLoadingAtt(true);
            setErrorAtt(null);
            // fetch column details to get contentId
            const colUrl = `/learn/api/public/v2/courses/${encodeURIComponent(todo.courseId)}/gradebook/columns/${encodeURIComponent(todo.itemSourceId)}`;
            const colRes = await fetch(colUrl, { method: 'GET' });
            const col = await colRes.json();
            const cId = col && col.contentId;
            if (!cId) { setContentId(null); setAttachments([]); setLoadingAtt(false); return; }
            // fetch attachments
            setContentId(cId);
            const attUrl = `/learn/api/public/v1/courses/${encodeURIComponent(todo.courseId)}/contents/${encodeURIComponent(cId)}/attachments`;
            const attRes = await fetch(attUrl, { method: 'GET' });
            const attData = await attRes.json();
            const list = attData && Array.isArray(attData.results) ? attData.results : [];
            setAttachments(list);
        } catch (e) {
            setErrorAtt('加载附件失败');
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

    const roleText = (typeof todo.roleName === 'string' && todo.roleName)
        ? todo.roleName
        : ((typeof todo.isStudentRole !== 'undefined' && !todo.isStudentRole) ? 'Instructor' : 'Student');

    return (
        <div
            className={`calendar-card ${accentClass}`}
            onMouseDown={handleMouseDown}
            style={{ cursor: draggableEnabled ? 'move' : 'default' }}
        >
            {todo['eventType'] ? (
                <div className='line event-type'>
                    <span className='left'>
                        {todo['eventType'] === 'Assignment' ? `Assignment - ${roleText}` : todo['eventType']}
                        {todo['eventType'] === 'Assignment' ? (
                            (typeof todo.isStudentRole !== 'undefined' && !todo.isStudentRole)
                                ? (
                                    <>
                                        <span className='status-badge submitted'>已提交{Number.isFinite(todo.attemptCount) ? todo.attemptCount : 0}份</span>
                                        {typeof todo.gradedCount === 'number' ? (
                                            <span className='status-badge submitted'>已批改{Number.isFinite(todo.gradedCount) ? todo.gradedCount : 0}份</span>
                                        ) : null}
                                    </>
                                )
                                : (
                                    (typeof todo['submitted'] !== 'undefined') && (
                                        <span className={`status-badge ${todo['submitted'] ? 'submitted' : 'pending'}`}>
                                            {todo['submitted'] ? '已提交' : '未提交'}
                                        </span>
                                    )
                                )
                        ) : null}
                    </span>
                    <span className='right' style={{ display: 'inline-flex', gap: '6px' }}>
                        {typeof todo.isStudentRole !== 'undefined' && !todo.isStudentRole && todo.eventType === 'Assignment' && todo.courseId && todo.itemSourceId ? (
                            <button
                                type='button'
                                className={`attachments-link ${isGraded ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); onToggleGraded && onToggleGraded(); }}
                                aria-pressed={isGraded}
                                title='标记为已批阅'
                            >
                                <span>{isGraded ? '已批阅' : '未批阅'}</span>
                            </button>
                        ) : null}
                        <button
                            type='button'
                            className={`attachments-link ${expanded ? 'active' : ''}`}
                            onClick={onToggle}
                            aria-expanded={expanded}
                            aria-label={expanded ? '收起附件' : '查看附件'}
                        >
                            <svg className='icon' viewBox='0 0 24 24' width='14' height='14' aria-hidden='true'>
                                <path fill='currentColor' d='M16.5 6.5L9 14a3 3 0 11-4.243-4.243l8.485-8.485a5 5 0 117.071 7.071l-9.193 9.193a7 7 0 11-9.9-9.9l7.778-7.778 1.414 1.414L2.636 7.15a5 5 0 107.071 7.071l9.193-9.193a3 3 0 10-4.243-4.243L6.172 8.271l1.414 1.414L16.5 2.771' />
                            </svg>
                            <span>{expanded ? '收起附件' : '附件'}</span>
                        </button>
                    </span>
                </div>
            ) : null}
            <div className='line assignment'>
                {assignHref ? (
                    <a href={assignHref}>{titleText}</a>
                ) : (
                    <span>{titleText}</span>
                )}
            </div>
            <div className='line course'>
                {todo['href'] && todo['href'] !== '#' ? (
                    <a href={todo['href']}>{todo['course']}</a>
                ) : (
                    <span>{todo['course']}</span>
                )}
            </div>
            <div className='line due'>Due: {formatDue(todo['deadline'])}</div>
            <div className='line countdown'>
                <span className={`countdown-pill ${cntClass}`}>{cntText}</span>
            </div>

            {expanded && (
                <div className='attachments-list'>
                    {loadingAtt && <div className='attachment-item'>加载中...</div>}
                    {errorAtt && <div className='attachment-item'>{errorAtt}</div>}
                    {!loadingAtt && !errorAtt && attachments && attachments.length === 0 && (
                        <div className='attachment-item'>无附件</div>
                    )}
                    {!loadingAtt && !errorAtt && attachments && attachments.length > 0 && (
                        attachments.map(att => {
                            const href = contentId
                                ? `https://pibb.scu.edu.cn/learn/api/public/v1/courses/${encodeURIComponent(todo.courseId)}/contents/${encodeURIComponent(contentId)}/attachments/${encodeURIComponent(att.id)}/download`
                                : '#';
                            return (
                                <div key={att.id} className='attachment-item'>
                                    <a href={href} target='_blank' rel='noreferrer'>
                                        {att.fileName || '附件'}
                                    </a>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
