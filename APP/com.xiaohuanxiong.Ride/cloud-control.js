// ==================== Ride IDE 云控配置 ====================
// 状态定义：
// 0 - 无公告
// 1 - 普通公告
// 2 - 重要公告
// 4 - 系统维护

window.CLOUD_STATUS = 4;   // 当前为无公告，可按需修改为 1,2,4

// 普通公告内容（仅当 CLOUD_STATUS=1 时生效）
window.CLOUD_NOTICE_NORMAL = "欢迎使用 Ride IDE！新功能已上线。";

// 重要公告内容（仅当 CLOUD_STATUS=2 时生效）
window.CLOUD_NOTICE_IMPORTANT = '由于更换编辑器后bug有点多，目前正在修bug，近期将不再进行更新，望悉知';
// 维护模式内容（仅当 CLOUD_STATUS=4 时生效）
window.CLOUD_MAINTENANCE_TITLE = "系统维护中";
window.CLOUD_MAINTENANCE_CONTENT = "Ride IDE 正在进行维护升级，预计需要 100 分钟。";
window.CLOUD_MAINTENANCE_TIME = "2025-05-20 13:00 ～ 14:40";

// UI 按钮云控配置（true=显示，false=隐藏）
window.CLOUD_UI_CONFIG = {
    newFile: true,       // 新建按钮
    saveFile: true,      // 保存按钮
    download: false,      // 下载按钮
    openLocal: true,     // 本地文件按钮
    run: true,           // 运行按钮
    feedback: true,      // 反馈群按钮
    about: true,         // 关于按钮
    toggleFiles: true    // 移动端侧边栏切换按钮
};