// 云控变量
var CLOUD_STATUS = 0;
// 0=无, 1=普通, 2=重要, 4=维护公告

// 普通公告（状态1）
var CLOUD_NOTICE_NORMAL = "本APP将于20:00开服<br>bug反馈社区808417324";

// 重要公告（状态2）
var CLOUD_NOTICE_IMPORTANT = "开服公告";

// 维护公告（状态4）
var CLOUD_MAINTENANCE_TITLE = "系统维护通知";
var CLOUD_MAINTENANCE_CONTENT = "云端服务正在升级维护，期间部分功能暂不可用，本地编辑不受影响。<br>bug反馈社区808417324";
var CLOUD_MAINTENANCE_TIME = "2026年4月6日 18:00 - 22:00";

window.CLOUD_UI_CONFIG = {
    newFile: true,      // 显示新建按钮
    saveFile: true,     // 显示保存按钮
    download: false,    // 隐藏下载按钮
    openLocal: true,    // 显示本地文件按钮
    run: true,          // 显示运行按钮
    feedback: ture,    // 隐藏反馈群按钮
    about: true,        // 显示关于按钮
    toggleFiles: true   // 显示移动端侧边栏切换按钮
};