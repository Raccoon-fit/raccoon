
/**
 * Ride IDE - 简洁纯文本代码编辑器
 * 无语法高亮，支持文件管理、本地存储、代码运行
 */

(function() {
    'use strict';

    // ===== 存储键名 =====
    const STORAGE_KEYS = {
        FILES: 'ride_files',
        CURRENT_FILE: 'ride_current_file',
        OPEN_TABS: 'ride_open_tabs',
        SETTINGS: 'ride_settings'
    };

    // ===== 状态管理 =====
    const state = {
        currentFile: null,
        files: {},
        openTabs: [],
        modifiedFiles: new Set(),
        fileHandle: null,
        directoryHandle: null
    };

    // ===== 默认文件 =====
    const defaultFiles = {
        'main.py': {
            content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ride IDE - 你的第一个Python程序
"""

def main():
    """主函数"""
    print("欢迎使用 Ride IDE!")
    print("=" * 40)
    
    # 你的代码可以真正保存和运行!
    message = "开始你的编程之旅吧"
    print(f"\n{message}")
    
    # 演示计算
    result = calculate(10, 20)
    print(f"10 + 20 = {result}")
    
    # 列表遍历
    colors = ["紫色", "蓝色", "绿色", "橙色"]
    print("\n喜欢的颜色:")
    for i, color in enumerate(colors, 1):
        print(f"  {i}. {color}")
    
    print("\n" + "=" * 40)
    print("程序执行完成!")

def calculate(a, b):
    """简单的加法"""
    return a + b

def greet(name):
    """问候函数"""
    return f"你好, {name}!"

if __name__ == "__main__":
    main()
`,
            language: 'python',
            saved: true
        },
        'test.js': {
            content: `// JavaScript 测试文件
// Ride IDE 支持多种语言!

console.log("欢迎使用 Ride IDE!");
console.log("=".repeat(40));

// 变量声明
const message = "JavaScript 代码运行成功";
console.log(message);

// 函数
function greet(name) {
    return \`你好, \${name}!\`;
}

console.log(greet("开发者"));

// 数组操作
const colors = ["红色", "绿色", "蓝色"];
console.log("\n颜色列表:");
colors.forEach((color, index) => {
    console.log(\`  \${index + 1}. \${color}\`);
});

// 对象
const user = {
    name: "Developer",
    level: 5,
    skills: ["Python", "JavaScript", "HTML"]
};

console.log(\`用户: \${user.name}\`);
console.log(\`等级: \${user.level}\`);

console.log("\n" + "=".repeat(40));
console.log("执行完成!");
`,
            language: 'javascript',
            saved: true
        },
        'index.html': {
            content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网页</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>这是 Ride IDE 生成的 HTML 文件</p>
</body>
</html>
`,
            language: 'html',
            saved: true
        },
        'README.md': {
            content: `# Ride IDE - 简洁代码编辑器

## 功能特点

- 本地存储 - 文件保存在浏览器本地
- 文件管理 - 创建、打开、删除文件
- 代码运行 - 支持 Python 和 JavaScript
- 简洁设计 - 无语法高亮，专注于代码本身

## 使用说明

1. 新建文件 - 点击工具栏的"新建"按钮
2. 保存文件 - 点击"保存"按钮或按 Ctrl+S
3. 运行代码 - 点击"运行"按钮
4. 下载文件 - 点击"下载"按钮

## 快捷键

- Ctrl+S - 保存文件
- Ctrl+N - 新建文件
- F5 - 运行代码

---
*Happy Coding!*
`,
            language: 'markdown',
            saved: true
        }
    };

    // ===== 初始化 =====
    function init() {
        // 加载保存的文件
        loadFromStorage();
        
        // 初始化默认文件（如果还没有）
        if (Object.keys(state.files).length === 0) {
            Object.keys(defaultFiles).forEach(name => {
                state.files[name] = { ...defaultFiles[name] };
            });
        }
        
        // 初始化状态
        state.currentFile = state.currentFile || 'main.py';
        if (state.openTabs.length === 0) {
            state.openTabs = ['main.py'];
        }
        
        // 设置事件监听
        setupEventListeners();
        setupModalListeners();
        
        // 初始化UI
        renderFileList();
        renderTabs();
        updateStorageUsage();
        
        // 加载当前文件
        openFile(state.currentFile);
        
        console.log('Ride IDE 已加载');
    }

    // ===== 本地存储操作 =====
    function loadFromStorage() {
        try {
            const files = localStorage.getItem(STORAGE_KEYS.FILES);
            if (files) {
                state.files = JSON.parse(files);
            }
            
            const currentFile = localStorage.getItem(STORAGE_KEYS.CURRENT_FILE);
            if (currentFile) {
                state.currentFile = currentFile;
            }
            
            const openTabs = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
            if (openTabs) {
                state.openTabs = JSON.parse(openTabs);
            }
        } catch (e) {
            console.warn('加载本地存储失败:', e);
        }
    }

    function saveToStorage() {
        try {
            // 减少保存频率，只保存必要的数据
            localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(state.files));
            localStorage.setItem(STORAGE_KEYS.CURRENT_FILE, state.currentFile || '');
            localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(state.openTabs));
        } catch (e) {
            console.warn('保存到本地存储失败:', e);
            showToast('存储空间不足!', 'error');
        }
    }

    let lastStorageUsage = 0;
    function updateStorageUsage() {
        // 节流存储空间统计，每秒最多一次
        const now = Date.now();
        if (now - lastStorageUsage < 1000) return;
        lastStorageUsage = now;
        
        try {
            const used = JSON.stringify(state.files).length;
            const max = 5 * 1024 * 1024; // 5MB
            const percent = Math.min((used / max) * 100, 100);
            
            const usedEl = document.getElementById('storageUsed');
            if (usedEl) {
                usedEl.style.width = percent + '%';
            }
        } catch (e) {
            console.warn('计算存储空间失败:', e);
        }
    }

    // ===== 事件监听 =====
    function setupEventListeners() {
        // 工具栏按钮
        const newFileBtn = document.getElementById('newFileBtn');
        const saveFileBtn = document.getElementById('saveFileBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const runBtn = document.getElementById('runBtn');
        
        if (newFileBtn) newFileBtn.addEventListener('click', newFile);
        if (saveFileBtn) saveFileBtn.addEventListener('click', saveFile);
        if (downloadBtn) downloadBtn.addEventListener('click', function() {
            if (state.currentFile) downloadFile(state.currentFile);
        });
        if (runBtn) runBtn.addEventListener('click', runCode);
        
        // 侧边栏按钮
        const newFileTreeBtn = document.getElementById('newFileTreeBtn');
        const refreshFilesBtn = document.getElementById('refreshFilesBtn');
        
        if (newFileTreeBtn) newFileTreeBtn.addEventListener('click', newFile);
        if (refreshFilesBtn) refreshFilesBtn.addEventListener('click', refreshFiles);
        
        // 终端按钮
        const clearTerminalBtn = document.getElementById('clearTerminal');
        const terminalToggleBtn = document.getElementById('terminalToggle');
        
        if (clearTerminalBtn) clearTerminalBtn.addEventListener('click', clearTerminal);
        if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', toggleTerminal);
        
        // 手机端侧边栏按钮
        const toggleFilesBtn = document.getElementById('toggleFilesBtn');
        const closeSidebarBtn = document.getElementById('closeSidebarBtn');
        const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
        
        if (toggleFilesBtn) toggleFilesBtn.addEventListener('click', toggleMobileSidebar);
        if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', hideMobileSidebar);
        if (mobileSidebarOverlay) {
            mobileSidebarOverlay.addEventListener('click', hideMobileSidebar);
        }
        
        // 文件树点击
        const fileList = document.getElementById('fileList');
        if (fileList) {
            fileList.addEventListener('click', handleFileTreeClick);
            fileList.addEventListener('contextmenu', handleFileRightClick);
        }
        
        // 标签点击
        const tabsContainer = document.getElementById('tabsContainer');
        if (tabsContainer) {
            tabsContainer.addEventListener('click', handleTabClick);
        }
        
        // 编辑器输入事件
        const codeEditor = document.getElementById('codeEditor');
        if (codeEditor) {
            codeEditor.addEventListener('input', handleEditorInput);
            codeEditor.addEventListener('scroll', handleEditorScroll);
            codeEditor.addEventListener('keydown', handleEditorKeydown);
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', handleGlobalShortcuts);
    }

    // ===== 编辑器事件处理 =====
    let inputTimeout = null;
    let storageTimeout = null;

    function handleEditorInput() {
        const codeEditor = document.getElementById('codeEditor');
        if (!codeEditor || !state.currentFile) return;
        
        // 更新文件内容
        const content = codeEditor.value;
        state.files[state.currentFile].content = content;
        state.modifiedFiles.add(state.currentFile);
        
        // 防抖更新行号 - 减少频繁DOM操作
        if (inputTimeout) clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            updateLineNumbers(content);
            updateModifiedIndicator();
        }, 50); // 50ms延迟
        
        // 防抖保存到存储 - 避免频繁IO
        if (storageTimeout) clearTimeout(storageTimeout);
        storageTimeout = setTimeout(() => {
            saveToStorage();
            updateStorageUsage();
        }, 500); // 500ms延迟保存
    }

    function handleEditorScroll() {
        const codeEditor = document.getElementById('codeEditor');
        const lineNumbers = document.getElementById('lineNumbers');
        
        if (codeEditor && lineNumbers) {
            // 使用transform代替scrollTop，性能更好
            lineNumbers.style.transform = `translateY(-${codeEditor.scrollTop}px)`;
        }
    }

    function handleEditorKeydown(e) {
        // Tab 键处理
        if (e.key === 'Tab') {
            e.preventDefault();
            const codeEditor = document.getElementById('codeEditor');
            if (codeEditor) {
                const start = codeEditor.selectionStart;
                const end = codeEditor.selectionEnd;
                const value = codeEditor.value;
                
                codeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
                codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
                
                handleEditorInput();
            }
        }
        
        // Ctrl+S 保存
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        
        // F5 运行
        if (e.key === 'F5') {
            e.preventDefault();
            runCode();
        }
    }

    function updateLineNumbers(content) {
        const lineNumbers = document.getElementById('lineNumbers');
        if (!lineNumbers) return;

        // 计算实际行数
        if (content === '') {
            // 空内容显示 01
            lineNumbers.textContent = '01';
            return;
        }

        // 使用 split 计算行数
        const lines = content.split('\n');
        let actualLines = lines.length;

        // 如果最后一行是空的（因为末尾有换行符），不计入行数
        // 但如果整个内容只有一个换行符 "\n"，应该显示 1 行
        if (lines[lines.length - 1] === '' && lines.length > 1) {
            actualLines = lines.length - 1;
        }

        // 确保至少显示 1 行
        actualLines = Math.max(1, actualLines);

        // 计算零填充宽度
        const digitCount = Math.max(2, String(actualLines).length);

        // 生成行号 - 确保每行都有对应的行号
        let numbersText = '';
        for (let i = 1; i <= actualLines; i++) {
            numbersText += String(i).padStart(digitCount, '0') + '\n';
        }

        // 去除末尾多余的换行符，保留一个用于对齐
        numbersText = numbersText.replace(/\n+$/, '');

        lineNumbers.textContent = numbersText;
    }

    // ===== 全局快捷键 =====
    function handleGlobalShortcuts(e) {
        // Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        // Ctrl+N
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            newFile();
        }
        // F5
        if (e.key === 'F5') {
            e.preventDefault();
            runCode();
        }
    }

    // ===== 文件操作 =====
    function handleFileTreeClick(e) {
        const item = e.target.closest('.file-item');
        if (item && item.dataset.file) {
            e.preventDefault();
            openFile(item.dataset.file);
        }
    }

    function handleFileRightClick(e) {
        const item = e.target.closest('.file-item');
        if (item && item.dataset.file) {
            e.preventDefault();
            showFileContextMenu(e, item.dataset.file);
        }
    }

    function showFileContextMenu(e, fileName) {
        // 移除已存在的菜单
        const existing = document.querySelector('.context-menu');
        if (existing) existing.remove();
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = '<div class="menu-item" data-action="open">打开</div>' +
            '<div class="menu-item" data-action="download">下载</div>' +
            '<div class="menu-item" data-action="delete" style="color: #f7768e;">删除</div>';
        
        menu.style.cssText = 'position:fixed;left:' + e.pageX + 'px;top:' + e.pageY + 
            'px;background:#1f2029;border:1px solid #3a3b4a;border-radius:8px;padding:4px 0;' +
            'z-index:10000;min-width:120px;';
        
        menu.querySelectorAll('.menu-item').forEach(function(mi) {
            mi.style.cssText = 'padding:8px 16px;cursor:pointer;color:#c0caf5;font-size:13px;' +
                'transition:background 0.15s;';
            mi.addEventListener('mouseenter', function() {
                this.style.background = '#2a2b3a';
            });
            mi.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
            mi.addEventListener('click', function() {
                const action = this.dataset.action;
                menu.remove();
                
                if (action === 'open') {
                    openFile(fileName);
                } else if (action === 'download') {
                    downloadFile(fileName);
                } else if (action === 'delete') {
                    deleteFile(fileName);
                }
            });
        });
        
        document.body.appendChild(menu);
        
        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }

    // ===== 标签操作 =====
    function handleTabClick(e) {
        const tab = e.target.closest('.tab');
        if (tab && tab.dataset.file) {
            if (!e.target.classList.contains('tab-close')) {
                openFile(tab.dataset.file);
            }
        }
        
        // 关闭标签
        if (e.target.classList.contains('tab-close')) {
            closeTab(e.target.closest('.tab').dataset.file);
        }
    }

    // ===== 打开文件 =====
    function openFile(path) {
        if (!state.files.hasOwnProperty(path)) {
            showToast('文件不存在!', 'error');
            return;
        }

        // 如果文件已修改，自动保存
        if (state.modifiedFiles.has(path)) {
            saveToStorage();
        }

        // 添加到打开的标签
        if (!state.openTabs.includes(path)) {
            state.openTabs.push(path);
        }

        // 设置当前文件
        state.currentFile = path;

        // 更新编辑器内容
        const file = state.files[path];
        const codeEditor = document.getElementById('codeEditor');
        const lineNumbers = document.getElementById('lineNumbers');
        if (codeEditor) {
            // 移除动画类
            codeEditor.classList.remove('content-fade-in');
            void codeEditor.offsetWidth; // 触发重绘
            codeEditor.value = file.content;
            updateLineNumbers(file.content);
            codeEditor.focus();
        }

        // 为新打开的文件添加动画
        if (lineNumbers) {
            lineNumbers.classList.remove('line-fade-in');
            void lineNumbers.offsetWidth;
            lineNumbers.classList.add('line-fade-in');
        }

        // 更新UI
        renderTabs();
        renderFileList();
        updateFileInfo();
        
        // 清除修改标记
        state.modifiedFiles.delete(path);
        updateModifiedIndicator();
        
        // 高亮当前文件
        highlightCurrentFile(path);
        
        saveToStorage();
    }
    
    // 高亮当前文件
    function highlightCurrentFile(path) {
        // 移除之前的动画类
        document.querySelectorAll('.file-item.just-opened').forEach(function(item) {
            item.classList.remove('just-opened');
        });
        
        // 为当前文件添加动画
        setTimeout(function() {
            const currentItem = document.querySelector('.file-item[data-file="' + escapeHtml(path) + '"]');
            if (currentItem) {
                currentItem.classList.add('just-opened');
            }
        }, 50);
    }

    // ===== 保存文件 =====
    function saveFile() {
        if (!state.currentFile) {
            showToast('没有打开的文件!', 'warning');
            return;
        }

        // 更新文件内容
        const codeEditor = document.getElementById('codeEditor');
        if (codeEditor) {
            state.files[state.currentFile].content = codeEditor.value;
        }

        // 清除修改标记
        state.modifiedFiles.delete(state.currentFile);
        updateModifiedIndicator();

        // 保存到存储
        saveToStorage();
        updateStorageUsage();
        
        // 标记为已保存
        state.files[state.currentFile].saved = true;
        
        showToast('已保存: ' + state.currentFile, 'success');
    }

    // ===== 新建文件 =====
    function newFile() {
        showModal('新建文件', '输入文件名 (例如: script.py, app.js, data.json):', 'untitled.py', function(name) {
            if (name && name.trim()) {
                const path = name.trim();
                
                // 检查是否已存在
                if (state.files.hasOwnProperty(path)) {
                    showToast('文件已存在!', 'warning');
                    openFile(path);
                    return;
                }

                // 创建新文件
                const language = detectLanguage(path);
                const content = getDefaultContent(language, path);
                
                state.files[path] = {
                    content: content,
                    language: language,
                    saved: false
                };
                
                // 添加到打开的标签
                state.openTabs.push(path);
                
                // 打开文件
                openFile(path);
                
                // 更新文件列表
                renderFileList();
                
                showToast('已创建: ' + path, 'success');
            }
        });
    }

    // ===== 删除文件 =====
    function deleteFile(path) {
        const deletePath = path;
        showModal('删除文件', '确定要删除 ' + path + ' 吗?', '', function(confirmed) {
            if (confirmed) {
                delete state.files[deletePath];
                
                // 从打开的标签移除
                const index = state.openTabs.indexOf(deletePath);
                if (index > -1) {
                    state.openTabs.splice(index, 1);
                }
                
                // 如果删除的是当前文件
                if (state.currentFile === deletePath) {
                    if (state.openTabs.length > 0) {
                        openFile(state.openTabs[0]);
                    } else {
                        state.currentFile = null;
                        const codeEditor = document.getElementById('codeEditor');
                        if (codeEditor) codeEditor.value = '';
                    }
                }
                
                // 移除修改标记
                state.modifiedFiles.delete(deletePath);
                
                // 更新UI
                renderFileList();
                renderTabs();
                saveToStorage();
                updateStorageUsage();
                
                showToast('已删除: ' + deletePath, 'success');
            }
        });
    }

    // ===== 关闭标签 =====
    function closeTab(path) {
        // 如果文件已修改，提示保存
        if (state.modifiedFiles.has(path)) {
            const closePath = path;
            showModal('保存文件', closePath + ' 已修改，是否保存?', '', function(save) {
                if (save) {
                    const codeEditor = document.getElementById('codeEditor');
                    state.files[closePath].content = codeEditor ? codeEditor.value : '';
                    state.modifiedFiles.delete(closePath);
                    updateModifiedIndicator();
                    saveToStorage();
                }
                
                const index = state.openTabs.indexOf(closePath);
                if (index > -1) {
                    state.openTabs.splice(index, 1);
                    
                    // 如果关闭的是当前文件
                    if (closePath === state.currentFile) {
                        if (state.openTabs.length > 0) {
                            openFile(state.openTabs[Math.max(0, index - 1)]);
                        } else {
                            state.currentFile = null;
                            const codeEditor = document.getElementById('codeEditor');
                            if (codeEditor) codeEditor.value = '';
                        }
                    }
                    
                    renderTabs();
                    saveToStorage();
                }
            });
        } else {
            const index = state.openTabs.indexOf(path);
            if (index > -1) {
                state.openTabs.splice(index, 1);
                
                // 如果关闭的是当前文件
                if (path === state.currentFile) {
                    if (state.openTabs.length > 0) {
                        openFile(state.openTabs[Math.max(0, index - 1)]);
                    } else {
                        state.currentFile = null;
                    }
                }
                
                renderTabs();
                saveToStorage();
            }
        }
    }

    // ===== 下载文件 =====
    function downloadFile(path) {
        if (!state.files[path]) {
            showToast('文件不存在!', 'error');
            return;
        }

        const file = state.files[path];
        const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = path;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('已下载: ' + path, 'success');
    }

    // ===== 刷新文件列表 =====
    function refreshFiles() {
        renderFileList();
        showToast('已刷新', 'success');
    }

    // ===== 手机端侧边栏控制 =====
    function toggleMobileSidebar() {
        const sidePanel = document.getElementById('sidePanel');
        const overlay = document.getElementById('mobileSidebarOverlay');
        
        if (sidePanel && overlay) {
            sidePanel.classList.toggle('expanded-mobile');
            overlay.classList.toggle('active');
        }
    }

    function hideMobileSidebar() {
        const sidePanel = document.getElementById('sidePanel');
        const overlay = document.getElementById('mobileSidebarOverlay');
        
        if (sidePanel && overlay) {
            sidePanel.classList.remove('expanded-mobile');
            overlay.classList.remove('active');
        }
    }

    // ===== UI 渲染 =====
    let lastRenderTime = 0;
    const RENDER_THROTTLE = 100; // 100ms throttle

    function renderFileList() {
        // 节流渲染
        const now = Date.now();
        if (now - lastRenderTime < RENDER_THROTTLE) return;
        lastRenderTime = now;
        
        const container = document.getElementById('fileList');
        if (!container) return;

        const files = Object.keys(state.files).sort();
        
        // 使用DocumentFragment优化DOM操作
        const fragment = document.createDocumentFragment();
        
        files.forEach(function(path) {
            const file = state.files[path];
            const icon = getFileIcon(path);
            const isActive = path === state.currentFile;
            const isModified = state.modifiedFiles.has(path);
            
            const div = document.createElement('div');
            div.className = 'file-item' + (isActive ? ' active' : '') + (isModified ? ' modified' : '');
            div.dataset.file = path;
            div.innerHTML = '<span class="file-icon">' + icon + '</span>' +
                '<span class="file-name">' + escapeHtml(path) + '</span>';
            
            fragment.appendChild(div);
        });
        
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    function renderTabs() {
        // 节流渲染
        const now = Date.now();
        if (now - lastRenderTime < RENDER_THROTTLE) return;
        lastRenderTime = now;
        
        const container = document.getElementById('tabsContainer');
        if (!container) return;

        container.innerHTML = state.openTabs.map(function(path) {
            const icon = getFileIcon(path);
            const isActive = path === state.currentFile;
            const isModified = state.modifiedFiles.has(path);
            
            return '<div class="tab ' + (isActive ? 'active' : '') + 
                (isModified ? ' modified' : '') + '" data-file="' + escapeHtml(path) + '">' +
                '<span class="tab-icon">' + icon + '</span>' +
                '<span class="tab-name">' + escapeHtml(path) + '</span>' +
                '<span class="tab-close">×</span></div>';
        }).join('');
    }

    function updateModifiedIndicator() {
        // 更新文件列表中的修改标记
        document.querySelectorAll('.file-item').forEach(function(item) {
            const path = item.dataset.file;
            if (state.modifiedFiles.has(path)) {
                item.classList.add('modified');
            } else {
                item.classList.remove('modified');
            }
        });
    }

    function updateFileInfo() {
        const currentFileName = document.getElementById('currentFileName');
        const fileInfo = document.getElementById('fileInfo');
        
        if (currentFileName) currentFileName.textContent = state.currentFile || '无文件';
        
        if (fileInfo && state.currentFile && state.files[state.currentFile]) {
            const file = state.files[state.currentFile];
            const lines = file.content.split('\n').length;
            const chars = file.content.length;
            fileInfo.textContent = lines + ' 行, ' + formatSize(chars);
        }
    }

    // ===== 终端操作 =====
    function runCode() {
        const codeEditor = document.getElementById('codeEditor');
        const code = codeEditor ? codeEditor.value : '';
        const language = state.files[state.currentFile]?.language || detectLanguage(state.currentFile);

        if (!code.trim()) {
            showToast('没有代码可运行!', 'warning');
            return;
        }

        // 清除终端
        clearTerminal();
        
        // 显示运行命令
        addTerminalLine('➜', 'workspace', language + ' ' + (state.currentFile || 'script'));

        // 显示运行中
        addTerminalOutput('正在运行...', 'warning');

        setTimeout(function() {
            executeCode(code, language);
        }, 300);
    }

    function executeCode(code, language) {
        if (language === 'python') {
            executePython(code);
        } else if (language === 'javascript' || language === 'js') {
            executeJavaScript(code);
        } else if (language === 'html') {
            executeHTML(code);
        } else if (language === 'json') {
            try {
                JSON.parse(code);
                addTerminalOutput('JSON 格式正确', 'success');
            } catch (e) {
                addTerminalOutput('JSON 错误: ' + e.message, 'error');
            }
        } else {
            addTerminalOutput('暂不支持 ' + language + ' 语言的执行', 'warning');
            addTerminalOutput('目前支持 Python、JavaScript 和 HTML', 'success');
        }
    }

    function executePython(code) {
        const outputs = [];
        
        // 提取 print 语句
        const printRegex = /print\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)/g;
        let match;
        
        while ((match = printRegex.exec(code)) !== null) {
            const content = match[1] || match[2];
            if (content) {
                outputs.push(content);
            }
        }
        
        // 移除旧的输出，只保留新的
        const terminal = document.getElementById('terminalBody');
        if (terminal) {
            const lastLine = terminal.lastElementChild;
            terminal.innerHTML = '';
            if (lastLine) {
                terminal.appendChild(lastLine);
            }
        }
        
        if (outputs.length > 0) {
            outputs.forEach(function(output) {
                addTerminalOutput(output);
            });
        } else {
            addTerminalOutput('(程序执行完成，无输出)');
        }
        
        addTerminalOutput('');
        addTerminalOutput('执行完成 (Python)', 'success');
        addTerminalOutput('共输出 ' + outputs.length + ' 行', 'success');
    }

    function executeJavaScript(code) {
        const outputs = [];
        
        // 提取 console.log
        const logRegex = /console\.log\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)/g;
        let match;
        
        while ((match = logRegex.exec(code)) !== null) {
            const content = match[1] || match[2];
            if (content) {
                outputs.push(content);
            }
        }
        
        // 移除旧的输出
        const terminal = document.getElementById('terminalBody');
        if (terminal) {
            const lastLine = terminal.lastElementChild;
            terminal.innerHTML = '';
            if (lastLine) {
                terminal.appendChild(lastLine);
            }
        }
        
        if (outputs.length > 0) {
            outputs.forEach(function(output) {
                addTerminalOutput(output);
            });
        } else {
            addTerminalOutput('(程序执行完成，无输出)');
        }
        
        addTerminalOutput('');
        addTerminalOutput('执行完成 (JavaScript)', 'success');
        addTerminalOutput('共输出 ' + outputs.length + ' 行', 'success');
    }

    function executeHTML(code) {
        // 在新窗口打开 HTML
        const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        addTerminalOutput('已在新窗口打开 HTML', 'success');
    }

    function addTerminalLine(prompt, path, command) {
        const body = document.getElementById('terminalBody');
        if (!body) return;

        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = '<span class="term-prompt">' + prompt + '</span> ' +
            '<span class="term-path">' + path + '</span> ' +
            '<span class="term-command">' + command + '</span>';
        body.appendChild(line);
        scrollTerminal();
    }

    function addTerminalOutput(text, type) {
        const body = document.getElementById('terminalBody');
        if (!body) return;

        const line = document.createElement('div');
        line.className = 'terminal-line ' + (type || '');
        line.innerHTML = '<span>' + escapeHtml(text) + '</span>';
        body.appendChild(line);

        // 添加空白行确保最后一行显示完整
        addTerminalSpacer();
    }

    function clearTerminal() {
        const body = document.getElementById('terminalBody');
        if (body) {
            body.innerHTML = '<div class="terminal-line"><span class="term-prompt">➜</span> <span class="term-path">workspace</span> <span class="term-cursor">_</span></div>';
            addTerminalSpacer();
        }
    }

    function toggleTerminal() {
        const section = document.getElementById('terminalSection');
        const toggleBtn = document.getElementById('terminalToggle');
        
        if (section && toggleBtn) {
            section.classList.toggle('collapsed');
            const isCollapsed = section.classList.contains('collapsed');
            toggleBtn.textContent = isCollapsed ? '▲' : '▼';
            toggleBtn.title = isCollapsed ? '展开' : '收起';
        }
    }

    function scrollTerminal() {
        const body = document.getElementById('terminalBody');
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }

    // 添加末尾空白行（确保最后一行内容完整显示）
    function addTerminalSpacer() {
        const body = document.getElementById('terminalBody');
        if (!body) return;

        // 移除旧的空白行
        const oldSpacer = body.querySelector('.terminal-spacer');
        if (oldSpacer) {
            oldSpacer.remove();
        }

        // 添加新的空白行
        const spacer = document.createElement('div');
        spacer.className = 'terminal-spacer';
        spacer.innerHTML = '&nbsp;';
        body.appendChild(spacer);

        // 滚动到底部
        body.scrollTop = body.scrollHeight;
    }

    // ===== 工具函数 =====
    function getLanguage(path) {
        const ext = getExtension(path);
        const map = {
            'py': 'python', 'js': 'javascript', 'ts': 'typescript',
            'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown',
            'txt': 'plaintext', 'sh': 'shell'
        };
        return map[ext] || 'plaintext';
    }

    function getExtension(path) {
        const parts = path.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    function getFileIcon(path) {
        const ext = getExtension(path);
        const icons = {
            'py': '🐍', 'js': '📜', 'ts': '📘',
            'html': '🌐', 'css': '🎨', 'json': '📋',
            'md': '📝', 'txt': '📄', 'sh': '💻',
            'jpg': '🖼️', 'png': '🖼️', 'gif': '🖼️'
        };
        return icons[ext] || '📄';
    }

    function detectLanguage(path) {
        return getLanguage(path);
    }

    function getDefaultContent(language, path) {
        if (language === 'python') {
            return '#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n# 新文件: ' + path + '\n\nprint("Hello, World!")\n';
        } else if (language === 'javascript') {
            return '// ' + path + '\nconsole.log("Hello, World!");\n';
        } else if (language === 'json') {
            return '{\n  "name": "' + path.replace('.json', '') + '",\n  "version": "1.0.0"\n}\n';
        } else if (language === 'html') {
            return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8">\n  <title>' + path + '</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>\n';
        } else if (language === 'css') {
            return '/* ' + path + ' */\n\nbody {\n  font-family: sans-serif;\n}\n';
        } else {
            return '# ' + path + '\n';
        }
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&#039;');
    }

    // ===== 自定义模态对话框 =====
    let modalCallback = null;

    function showModal(title, message, placeholder, callback) {
        const overlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalInput = document.getElementById('modalInput');
        
        if (!overlay || !modalTitle || !modalMessage || !modalInput) return;
        
        // 保存回调函数
        modalCallback = callback;
        
        // 设置对话框内容
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalInput.value = placeholder || '';
        modalInput.placeholder = placeholder || '';
        modalInput.focus();
        
        // 显示对话框
        overlay.classList.add('active');
    }

    function hideModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        modalCallback = null;
    }

    function handleModalConfirm() {
        const modalInput = document.getElementById('modalInput');
        const value = modalInput ? modalInput.value : '';
        
        // 先保存回调函数，再隐藏弹窗
        const callback = modalCallback;
        hideModal();
        
        if (callback) {
            callback(value);
        }
    }

    function handleModalCancel() {
        const callback = modalCallback;
        hideModal();
        
        if (callback) {
            callback(null);
        }
    }

    function setupModalListeners() {
        const overlay = document.getElementById('modalOverlay');
        const closeBtn = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('modalCancel');
        const confirmBtn = document.getElementById('modalConfirm');
        const modalInput = document.getElementById('modalInput');
        
        if (overlay) {
            // 点击遮罩层关闭
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    handleModalCancel();
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', handleModalCancel);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', handleModalCancel);
        }
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', handleModalConfirm);
        }
        
        if (modalInput) {
            // 回车键确认
            modalInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleModalConfirm();
                }
                if (e.key === 'Escape') {
                    handleModalCancel();
                }
            });
        }
    }

    function showToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast ' + (type || '');
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 2000);
    }

    // ===== 启动应用 =====
    document.addEventListener('DOMContentLoaded', init);

    // 全局函数暴露
    window.openFile = openFile;
    window.saveFile = saveFile;
    window.newFile = newFile;
    window.runCode = runCode;
    window.downloadFile = downloadFile;

})();
