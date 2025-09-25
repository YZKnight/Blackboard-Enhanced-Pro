import { courseInfoCatch } from "./fetchCourse";


// fetch Calendar Info
export async function calendarInfoCatch() {
    try {
        var orig_todo_items = await get_calendar();
        var todo_items = await extractItems(orig_todo_items);
        todo_items = await setColor(todo_items);
        todo_items = await enrichRoleAndSubmission(todo_items);
        console.log("fetchCalendar.js Success");
        // console.log(todo_items)



        return todo_items;
    }
    catch (err) {
        console.log("fetchCalendar.js Error: ", err);
    }


};


async function get_calendar() {
    const url = '/webapps/calendar/calendarData/selectedCalendarEvents';
    const start_date = new Date();
    // start from one month before today
    start_date.setMonth(start_date.getMonth() - 1);
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 1);
    const params = "?start=" + start_date.getTime() + "&end=" + end_date.getTime() + "&course_id=&mode=personal";

    return fetch(url + params, {
        method: 'GET'
    }).then(res => res.json())
        .then(data => {
            // console.log(data)
            return data;
        })
        .catch(console.log)
}


// 处理json文件: origin_todo_items => todo_items
async function extractItems(_orig_todo_items) {
    let course_db;
    try {
        course_db = await courseInfoCatch();
    } catch (err) { console.log }

    // console.log(course_db)
    var _todo_items = [];
    for (let i = 0; i < _orig_todo_items.length; i++) {
        const it = _orig_todo_items[i];
        const courseEntry = course_db[it['calendarName']];
        _todo_items.push({
            "id": i, // react key only
            "course": it['calendarName'],
            "todoItem": it['title'],
            "deadline": it['end'],
            "href": courseEntry ? courseEntry['href'] : '#',
            // extra fields for behavior
            "eventType": it['eventType'],
            "launchId": it['id'], // used to jump to attempt page for assignments
            "itemSourceId": it['itemSourceId'],
            "courseId": courseEntry ? courseEntry['id'] : null,
        });
    }
    
    if (_todo_items.length === 0) {
        const _tmp_ddl = new Date('2023-09-12')
        _todo_items.push({
            "id": 0,
            "course": 'No DDL Currently',
            'todoItem': 'HAVE A NICE DAY',
            // "deadline": _tmp_ddl,
            "href": '#',
        })
    } else {
        // 按照时间顺序排序
        _todo_items.sort((a, b) => {
            return Date.parse(a.deadline) - Date.parse(b.deadline);
        });
    }

    console.log(_todo_items)
    return _todo_items;
};


// 添加渐变颜色
async function setColor(_todo_items) {
    // 渐变准备 1
    const generateGradientColors = (color1, color2, steps) => {
        // Convert color1 to RGB values
        const rgb1 = hexToRgb(color1);

        // Convert color2 to RGB values
        const rgb2 = hexToRgb(color2);

        // Generate gradient colors
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

    // 渐变准备 2: Convert a hexadecimal color code to an RGB object
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };

    // 渐变准备 3: Convert an RGB object to a hexadecimal color code
    const rgbToHex = (r, g, b) => {
        const hex = ((r << 16) | (g << 8) | b).toString(16);
        return "#" + hex.padStart(6, "0");
    }

    // 渐变准备 4: Interpolate a value between two numbers
    const interpolate = (start, end, step, totalSteps) => {
        return start + ((end - start) * step) / totalSteps;
    }

    const colorChoices = [
        ['#ff4e4f', '#ff9d81'],
        ['#032e71', '#b8e9fc'],
        ['#ff2121', '#d14631']
    ];
    const colorArr = generateGradientColors(colorChoices[1][0], colorChoices[1][1], _todo_items.length);
    for (let i = 0; i < _todo_items.length; i++) {
        _todo_items[i]['color'] = colorArr[i];
    }
    return _todo_items;
};

// 角色感知：学生显示是否提交；非学生显示提交份数，并为标题提供“需评分”跳转
async function enrichRoleAndSubmission(_todo_items) {
    // 获取课程角色
    const roleCache = {};
    const getCourseRole = async (courseId) => {
        if (!courseId) return 'Student';
        if (roleCache[courseId]) return roleCache[courseId];
        const url = `/learn/api/public/v1/courses/${encodeURIComponent(courseId)}/users/me`;
        try {
            const res = await fetch(url, { method: 'GET' });
            const data = await res.json();
            const role = data && data.courseRoleId ? data.courseRoleId : 'Student';
            roleCache[courseId] = role;
            return role;
        } catch (e) {
            console.log('getCourseRole error', e);
            roleCache[courseId] = 'Student';
            return 'Student';
        }
    };

    // 获取尝试数量
    const getAttemptCount = async (courseId, itemSourceId) => {
        if (!courseId || !itemSourceId) return 0;
        const url = `/learn/api/public/v2/courses/${encodeURIComponent(courseId)}/gradebook/columns/${encodeURIComponent(itemSourceId)}/attempts`;
        try {
            const res = await fetch(url, { method: 'GET' });
            const data = await res.json();
            const arr = (data && Array.isArray(data.results)) ? data.results : [];
            return arr.length;
        } catch (e) {
            console.log('getAttemptCount error', e);
            return 0;
        }
    };

    // 预先获取所有课程角色（去重）
    const courseIds = Array.from(new Set(_todo_items.map(it => it.courseId).filter(Boolean)));
    await Promise.all(courseIds.map(id => getCourseRole(id)));

    const enriched = await Promise.all(
        _todo_items.map(async (it) => {
            if (it.eventType !== 'Assignment') return it;
            const role = await getCourseRole(it.courseId);
            const isStudentRole = (role === 'Student');
            const attemptCount = await getAttemptCount(it.courseId, it.itemSourceId);
            const submitted = attemptCount > 0; // 对学生：是否提交；对老师：只用于兼容
            const needsGradingUrl = it.courseId
                ? `https://pibb.scu.edu.cn/webapps/gradebook/do/instructor/viewNeedsGrading?course_id=${encodeURIComponent(it.courseId)}`
                : null;
            return {
                ...it,
                isStudentRole,
                roleName: role,
                attemptCount,
                submitted,
                needsGradingUrl,
            };
        })
    );
    return enriched;
}
