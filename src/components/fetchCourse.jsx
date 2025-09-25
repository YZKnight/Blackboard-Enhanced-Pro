export async function courseInfoCatch() {
    try {
        const orig_course_info = await get_course_id();
        const course_db = store_course_id(orig_course_info);
        console.log("fetchCourse.js Success");
        return course_db;
    } catch (err) {
        console.log("fetchCourse.js Error: ", err);
    }
}


// 通过公开 API 获取课程（日历）列表
async function get_course_id() {
    const url = '/learn/api/public/v1/calendars/';
    return await fetch(url, { method: 'GET' })
        .then(res => res.json())
        .catch(console.log);
}

// 从 API 结果中提取课程信息（按 name 建索引）
function store_course_id(_orig_course_info) {
    const _course_db = {};
    if (!_orig_course_info) return _course_db;

    const list = Array.isArray(_orig_course_info)
        ? _orig_course_info
        : (_orig_course_info.results || []);

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!item || !item.id || !item.name) continue;
        // 过滤非课程类目
        if (item.id === 'INSTITUTION' || item.id === 'PERSONAL') continue;
        // 遇到重名课程，保留先出现的，避免来回覆盖
        if (_course_db[item.name]) continue;

        const course_id = item.id;
        const course_name = item.name;
        const launcher = `https://pibb.scu.edu.cn/webapps/blackboard/execute/launcher?type=Course&id=${encodeURIComponent(course_id)}&url=`;
        _course_db[course_name] = {
            id: course_id,
            href: launcher,
        };
    }

    return _course_db;
}
