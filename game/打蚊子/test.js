const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 收集控制台错误
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    page.on('pageerror', err => {
        errors.push(err.message);
    });

    const filePath = 'file://' + path.resolve(__dirname, 'index.html');
    console.log('Loading:', filePath);

    try {
        await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✅ Page loaded successfully');

        // 检查关键元素
        const title = await page.title();
        console.log('📄 Page title:', title);

        const startBtn = await page.$('#startBtn');
        if (startBtn) {
            console.log('✅ Start button found');
        } else {
            console.log('❌ Start button NOT found');
        }

        const canvas = await page.$('#gameCanvas');
        if (canvas) {
            console.log('✅ Game canvas found');
        } else {
            console.log('❌ Game canvas NOT found');
        }

        // 检查游戏对象
        const gameExists = await page.evaluate(() => {
            return typeof game !== 'undefined' && game !== null;
        });
        console.log(gameExists ? '✅ Game object initialized' : '❌ Game object NOT initialized');

        // 报告错误
        if (errors.length > 0) {
            console.log('\n❌ Console errors:');
            errors.forEach(e => console.log('  -', e));
        } else {
            console.log('✅ No console errors');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    }

    await browser.close();
    console.log('\n🎮 Test completed');
})();
