/**
 * 3D 摇杆控制器 - 完整游戏版
 * 包含双角色切换、收集玩法和丰富的地图元素
 */

// 全局变量
let engine;
let scene;
let camera;
let player;
let raccoon;
let joystick;

// 当前控制的角色：'player' 或 'raccoon'
let currentCharacter = 'player';

// 当前视角模式：'thirdPerson' 或 'firstPerson'
let currentViewMode = 'thirdPerson';

// 第一人称交互控制器
let firstPersonInteraction = null;

// 第一人称视角旋转控制器（手机端第二个摇杆）
let viewRotationJoystick = null;

// 第一人称视角偏移量
let firstPersonYaw = 0;
let firstPersonPitch = 0;

// 金币收集系统状态
const coinSystem = {
    totalCoins: 15,       // 优化：从50枚减少到15枚，避免卡顿
    collectedCoins: 0,
    coinScore: 0,
    // 金币价值配置
    values: {
        coin: 10,        // 金币 10分
        star: 25,        // 星星 25分
        diamond: 50      // 钻石 50分
    }
};

// 游戏状态
const gameState = {
    score: 0,
    collectedItems: 0,
    totalItems: 20,
    isPlaying: true,
    lastSwitchTime: 0,
    switchCooldown: 2000 // 切换冷却时间（毫秒）
};

// 切换点
let switchPoints = [];
// 可收集物品
let collectibles = [];
// 障碍物
let obstacles = [];
// 装饰物
let decorations = [];

// 键盘状态
const keyboardState = {
    up: false,
    down: false,
    left: false,
    right: false,
    rotateLeft: false,
    rotateRight: false
};

// 键盘平滑过渡
let smoothVector = { x: 0, y: 0 };
const lerpSpeed = 15;

// 当前输入模式
let currentInputType = 'NONE';

// 玩家配置
const playerConfig = {
    speed: 12,
    firstPersonSpeed: 8  // 第一人称模式下的较低速度
};

// 画质配置 - 7个等级定义（画质差异最大化）
const qualitySettings = {
    // 超低画质 - 最低性能消耗，画面最模糊
    0: {
        name: '超低',
        pixelRatio: 0.15,          // 极低像素比，画面严重模糊锯齿
        shadowMapSize: 128,        // 最小阴影贴图
        shadowRange: 40,           // 阴影范围
        antialias: false,          // 关闭抗锯齿
        fogDistance: 10,           // 很近的雾效，远处几乎看不见
        collectibleCount: 4,       // 最少可收集物
        geometrySegments: 4,       // 最低几何精度
        shadowEnabled: false,      // 禁用阴影
        toneMappingExposure: 0.4   // 低对比度，画面发灰
    },
    // 低画质 - 适合低端设备
    1: {
        name: '低',
        pixelRatio: 0.35,          // 低像素比，有明显模糊感
        shadowMapSize: 256,        // 小阴影贴图
        shadowRange: 50,           // 阴影范围
        antialias: false,          // 关闭抗锯齿
        fogDistance: 25,           // 较近的雾效
        collectibleCount: 8,
        geometrySegments: 8,
        shadowEnabled: false,
        toneMappingExposure: 0.65
    },
    // 普通画质 - 默认设置
    2: {
        name: '普通',
        pixelRatio: 0.75,          // 略低于原生分辨率
        shadowMapSize: 2048,       // 标准阴影贴图
        shadowRange: 60,           // 阴影范围
        antialias: true,           // 开启抗锯齿
        fogDistance: 55,           // 标准雾效距离
        collectibleCount: 15,
        geometrySegments: 16,
        shadowEnabled: true,
        toneMappingExposure: 1.0
    },
    // 高画质 - 更好的视觉效果
    3: {
        name: '高',
        pixelRatio: 1.25,          // 超过原生分辨率
        shadowMapSize: 4096,       // 高质量阴影
        shadowRange: 70,           // 阴影范围
        antialias: true,
        fogDistance: 110,          // 较远雾效
        collectibleCount: 22,
        geometrySegments: 24,
        shadowEnabled: true,
        toneMappingExposure: 1.2
    },
    // 超清画质 - 高清晰度
    4: {
        name: '超清',
        pixelRatio: Math.min(window.devicePixelRatio * 3, 4),  // 3倍设备像素超采样，最高4倍
        shadowMapSize: 8192,       // 最高质量阴影
        shadowRange: 80,           // 阴影范围
        antialias: true,
        fogDistance: 300,          // 最远雾效，几乎看不见
        collectibleCount: 35,
        geometrySegments: 48,      // 超高精度几何
        shadowEnabled: true,
        toneMappingExposure: 1.5   // 高对比度，画面通透锐利
    },
    // 极致画质 - 极致视觉效果
    5: {
        name: '极致',
        pixelRatio: Math.min(window.devicePixelRatio * 4, 5),  // 4倍设备像素超采样，最高5倍
        shadowMapSize: 16384,      // 超大阴影贴图
        shadowRange: 90,           // 阴影范围
        antialias: true,
        fogDistance: 500,          // 几乎无雾效
        collectibleCount: 45,
        geometrySegments: 64,      // 极高几何精度
        shadowEnabled: true,
        toneMappingExposure: 1.8   // 高对比度
    },
    // 超极致画质 - 之前那个特别卡但效果最好的配置
    6: {
        name: '超极致',
        pixelRatio: Math.min(window.devicePixelRatio * 6, 8),  // 6倍设备像素超采样，最高8倍
        shadowMapSize: 32768,      // 超大阴影贴图，最精细阴影
        shadowRange: 100,          // 阴影范围
        antialias: true,
        fogDistance: 1000,         // 完全无雾效效果
        collectibleCount: 60,      // 最多可收集物
        geometrySegments: 128,     // 最高几何精度（圆滑曲面）
        shadowEnabled: true,
        toneMappingExposure: 2.0,  // 最高对比度
        postProcessing: true       // 启用后处理效果
    }
};

// 当前画质等级
let currentQualityLevel = 2; // 默认普通画质

// 原始可收集物配置
const originalCollectibleConfig = {
    totalCoins: 15,
    starCount: 4,
    diamondCount: 4
};

/**
 * 获取当前画质等级
 */
function getQualityLevel() {
    const selector = document.getElementById('quality-select');
    if (selector) {
        return parseInt(selector.value, 10);
    }
    return 2; // 默认普通画质
}

/**
 * 根据画质等级获取几何分段数
 */
function getGeometrySegments(baseSegments) {
    const level = getQualityLevel();
    if (level >= 6) {
        // 超极致：最高精度
        return Math.max(64, baseSegments * 4);
    } else if (level >= 5) {
        // 极致：高精度
        return Math.max(32, baseSegments * 2);
    } else if (level >= 4) {
        // 超清以上：中等偏上
        return Math.max(24, baseSegments * 1.5);
    } else if (level >= 3) {
        // 高画质：中等
        return baseSegments;
    } else {
        // 低画质：简化
        return Math.max(4, Math.floor(baseSegments * 0.5));
    }
}

/**
 * 根据画质等级获取纹理尺寸
 */
function getTextureSize(baseSize) {
    const level = getQualityLevel();
    if (level >= 6) {
        // 超极致：最高纹理质量
        return baseSize * 4;
    } else if (level >= 5) {
        // 极致：高纹理质量
        return baseSize * 2;
    } else if (level >= 4) {
        return baseSize * 1.5;
    } else {
        return baseSize;
    }
}

/**
 * 应用画质设置
 */
function applyQuality(level) {
    const settings = qualitySettings[level];
    if (!settings) {
        console.error('无效的画质等级:', level);
        return;
    }

    currentQualityLevel = level;
    console.log(`正在切换到${settings.name}画质...`);

    // 应用渲染器设置
    if (MiniMax.applyQualitySettings) {
        MiniMax.applyQualitySettings({
            pixelRatio: settings.pixelRatio,
            shadowMapSize: settings.shadowMapSize,
            antialias: settings.antialias,
            fogDistance: settings.fogDistance,
            shadowEnabled: settings.shadowEnabled,
            toneMappingExposure: settings.toneMappingExposure
        });
    }

    // 更新可收集物数量
    updateCollectibleCount(settings.collectibleCount);

    // 保存画质设置到本地存储
    localStorage.setItem('gameQuality', level);

    console.log(`已切换到${settings.name}画质，可收集物数量: ${settings.collectibleCount}`);
}

/**
 * 根据画质设置更新可收集物数量
 */
function updateCollectibleCount(totalCollectibles) {
    // 计算各类收集物的数量比例
    const coinRatio = 0.6;
    const starRatio = 0.2;
    const diamondRatio = 0.2;

    const coinCount = Math.max(3, Math.floor(totalCollectibles * coinRatio));
    const starCount = Math.max(1, Math.floor(totalCollectibles * starRatio));
    const diamondCount = Math.max(1, Math.floor(totalCollectibles * diamondRatio));

    // 更新全局配置
    coinSystem.totalCoins = coinCount;
    originalCollectibleConfig.totalCoins = coinCount;
    originalCollectibleConfig.starCount = starCount;
    originalCollectibleConfig.diamondCount = diamondCount;

    // 更新UI显示
    updateCoinDisplay();

    console.log(`可收集物配置已更新: 金币 ${coinCount}, 星星 ${starCount}, 钻石 ${diamondCount}`);
}

/**
 * 重新生成可收集物
 */
function recreateCollectibles() {
    // 移除现有的可收集物
    collectibles.forEach(item => {
        MiniMax._scene.remove(item);
    });
    collectibles = [];

    // 重新生成金币
    for (let i = 0; i < coinSystem.totalCoins; i++) {
        const x = (Math.random() - 0.5) * 70;
        const z = (Math.random() - 0.5) * 70;
        if (Math.abs(x) > 10 || Math.abs(z) > 5) {
            createCoin(x, z);
        } else {
            createCoin((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 70);
        }
    }

    // 重新生成星星和钻石
    for (let i = 0; i < originalCollectibleConfig.starCount; i++) {
        const x = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;
        createStar(x, z);
    }

    for (let i = 0; i < originalCollectibleConfig.diamondCount; i++) {
        const x = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;
        createDiamond(x, z);
    }

    // 重置收集状态
    coinSystem.collectedCoins = 0;
    coinSystem.coinScore = 0;
    gameState.collectedItems = 0;
    gameState.score = 0;

    updateCoinDisplay();
    console.log('可收集物已重新生成');
}
function createGroundTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 深色背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 512, 512);

    // 绘制六边形网格
    const hexSize = 32;
    for (let y = 0; y < 512; y += hexSize * 0.866) {
        const offsetX = (Math.floor(y / (hexSize * 0.866)) % 2) * (hexSize * 1.5);
        for (let x = -hexSize; x < 512 + hexSize; x += hexSize * 3) {
            drawHexagon(ctx, x + offsetX, y, hexSize - 2);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40, 40);

    return texture;
}

function drawHexagon(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
    }
    ctx.closePath();

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(30, 40, 70, 0.8)');
    gradient.addColorStop(1, 'rgba(20, 25, 45, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * 创建边界墙纹理
 */
function createWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // 深色背景
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 256, 256);

    // 绘制科技感条纹
    for (let y = 0; y < 256; y += 16) {
        const gradient = ctx.createLinearGradient(0, y, 256, y + 16);
        gradient.addColorStop(0, 'rgba(30, 40, 80, 0.3)');
        gradient.addColorStop(0.5, 'rgba(60, 100, 200, 0.6)');
        gradient.addColorStop(1, 'rgba(30, 40, 80, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, 256, 8);
    }

    // 添加装饰点
    for (let x = 0; x < 256; x += 32) {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x + 16, 128, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 添加扫描线效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let y = 0; y < 256; y += 4) {
        ctx.fillRect(0, y, 256, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}

/**
 * 创建边界墙
 */
function createBoundaryWalls() {
    const wallHeight = 8;
    const wallThickness = 0.5;
    const wallLength = 96;
    const wallTexture = createWallTexture();
    
    const wallMaterial = new THREE.MeshPhongMaterial({
        map: wallTexture,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });

    // 创建4面边界墙
    const wallPositions = [
        { x: 0, z: -48, rotY: 0 },           // 北边
        { x: 0, z: 48, rotY: 0 },            // 南边
        { x: -48, z: 0, rotY: Math.PI / 2 }, // 西边
        { x: 48, z: 0, rotY: Math.PI / 2 }   // 东边
    ];

    wallPositions.forEach(pos => {
        const wallGeometry = new THREE.BoxGeometry(wallLength, wallHeight, wallThickness);
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(pos.x, wallHeight / 2, pos.z);
        wall.rotation.y = pos.rotY;
        MiniMax._scene.add(wall);
    });

    // 添加顶部发光边
    const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x4facfe,
        transparent: true,
        opacity: 0.8
    });

    wallPositions.forEach(pos => {
        const edgeGeometry = new THREE.BufferGeometry();
        const edgePoints = [
            new THREE.Vector3(-wallLength/2, wallHeight, -wallThickness/2),
            new THREE.Vector3(wallLength/2, wallHeight, -wallThickness/2)
        ];
        edgeGeometry.setFromPoints(edgePoints);
        const edgeLine = new THREE.Line(edgeGeometry, edgeMaterial);
        edgeLine.position.set(pos.x, wallHeight, pos.z);
        edgeLine.rotation.y = pos.rotY;
        MiniMax._scene.add(edgeLine);
    });
}

/**
 * 创建切换点
 */
function createSwitchPoint(x, z, color, label) {
    const group = new THREE.Group();
    group.userData = { label: label, color: color, isSwitchPoint: true };

    // 底座
    const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 0.3, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a4a });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.15;
    group.add(base);

    // 发光柱子
    const pillarGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16);
    const pillarMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85
    });
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.y = 1.25;
    group.add(pillar);

    // 顶部光环
    const ringGeometry = new THREE.TorusGeometry(0.4, 0.06, 16, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.5;
    group.add(ring);

    // 文字标签
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 128, 32);

    const labelTexture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true
    });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.scale.set(3, 0.75, 1);
    labelSprite.position.y = 3.2;
    group.add(labelSprite);

    group.position.set(x, 0, z);
    MiniMax._scene.add(group);

    return group;
}

/**
 * 创建金币 - 根据画质等级调整精细程度
 */
function createCoin(x, z) {
    const group = new THREE.Group();
    const level = getQualityLevel();
    const coinRadius = 0.4;
    const coinThickness = 0.08;

    // 根据画质选择几何分段数
    const coinSegments = getGeometrySegments(8);

    // 金币主体 - 根据画质等级调整
    const coinGeometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, coinSegments);
    const coinMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: level >= 5 ? 0.95 : 0.8,
        roughness: level >= 5 ? 0.15 : 0.3,
        emissive: 0xffa500,
        emissiveIntensity: level >= 5 ? 0.25 : 0.15
    });
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.rotation.x = Math.PI / 2;
    group.add(coin);

    // 金币边缘高光环 - 超极致和极致特有
    if (level >= 5) {
        const ringGeometry = new THREE.TorusGeometry(coinRadius - 0.02, 0.02, coinSegments, coinSegments);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0xffee00,
            metalness: 1.0,
            roughness: 0.1,
            emissive: 0xffcc00,
            emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = coinThickness / 2;
        group.add(ring);
    }

    // 中心星形 - 根据画质调整纹理大小
    const starCanvas = document.createElement('canvas');
    const starTextureSize = getTextureSize(64);
    starCanvas.width = starTextureSize;
    starCanvas.height = starTextureSize;
    const starCtx = starCanvas.getContext('2d');

    // 绘制更精细的五角星
    const scale = starTextureSize / 64;
    starCtx.fillStyle = '#ffaa00';
    starCtx.beginPath();
    const starOuterRadius = 20 * scale;
    const starInnerRadius = 8 * scale;
    const centerX = starTextureSize / 2;
    const centerY = starTextureSize / 2;

    for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        if (i === 0) starCtx.moveTo(centerX + Math.cos(outerAngle) * starOuterRadius, centerY + Math.sin(outerAngle) * starOuterRadius);
        else starCtx.lineTo(centerX + Math.cos(outerAngle) * starOuterRadius, centerY + Math.sin(outerAngle) * starOuterRadius);
        starCtx.lineTo(centerX + Math.cos(innerAngle) * starInnerRadius, centerY + Math.sin(innerAngle) * starInnerRadius);
    }
    starCtx.closePath();
    starCtx.fill();

    // 添加星形内部细节（仅高画质以上）
    if (level >= 5) {
        starCtx.strokeStyle = '#ffcc00';
        starCtx.lineWidth = 2 * scale;
        starCtx.stroke();
    }

    const starTexture = new THREE.CanvasTexture(starCanvas);
    const starSpriteMaterial = new THREE.SpriteMaterial({ map: starTexture, transparent: true });
    const starSprite = new THREE.Sprite(starSpriteMaterial);
    starSprite.scale.set(0.4, 0.4, 1);
    starSprite.position.z = coinThickness / 2 + 0.01;
    group.add(starSprite);

    // 光晕效果 - 根据画质调整
    const glowCanvas = document.createElement('canvas');
    const glowTextureSize = getTextureSize(32);
    glowCanvas.width = glowTextureSize;
    glowCanvas.height = glowTextureSize;
    const glowCtx = glowCanvas.getContext('2d');
    const gradient = glowCtx.createRadialGradient(glowTextureSize / 2, glowTextureSize / 2, 0, glowTextureSize / 2, glowTextureSize / 2, glowTextureSize / 2);

    if (level >= 6) {
        // 超极致：更强的光晕
        gradient.addColorStop(0, 'rgba(255, 230, 100, 0.5)');
        gradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.35)');
        gradient.addColorStop(0.7, 'rgba(255, 180, 0, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
    } else if (level >= 5) {
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
        gradient.addColorStop(0.4, 'rgba(255, 200, 0, 0.25)');
        gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
    } else {
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    }

    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, glowTextureSize, glowTextureSize);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowSpriteMaterial = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false });
    const glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.scale.set(level >= 5 ? 1.5 : 1.2, level >= 5 ? 1.5 : 1.2, 1);
    group.add(glowSprite);

    // 点光源 - 仅超极致画质添加
    if (level >= 6) {
        const pointLight = new THREE.PointLight(0xffd700, 0.5, 3);
        pointLight.position.set(0, 0, 0.5);
        group.add(pointLight);
    }

    group.position.set(x, 0.6, z);
    group.userData = {
        type: 'coin',
        collected: false,
        rotationSpeed: 0.02,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: 0.6,
        isAnimating: false,
        animationProgress: 0
    };

    MiniMax._scene.add(group);
    collectibles.push(group);

    return group;
}

/**
 * 创建可收集的星星 - 根据画质等级调整精细程度
 */
function createStar(x, z) {
    const group = new THREE.Group();
    const level = getQualityLevel();

    // 根据画质选择几何分段数
    const starSegments = getGeometrySegments(8);

    if (level >= 6) {
        // 超极致：使用更精细的二十面体
        const starGeometry = new THREE.IcosahedronGeometry(0.4, 1);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffa500,
            emissiveIntensity: 0.4,
            metalness: 0.7,
            roughness: 0.2,
            flatShading: false
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        group.add(star);

        // 添加星星光芒效果
        for (let i = 0; i < 4; i++) {
            const rayGeometry = new THREE.ConeGeometry(0.03, 0.5, 6);
            const rayMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.6
            });
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.position.y = 0.5;
            ray.rotation.z = (Math.PI / 2) * i;
            group.add(ray);
        }
    } else if (level >= 5) {
        // 极致：使用十二面体
        const starGeometry = new THREE.DodecahedronGeometry(0.38, 0);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffa500,
            emissiveIntensity: 0.35,
            metalness: 0.6,
            roughness: 0.3
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        group.add(star);

        // 添加简单光芒
        for (let i = 0; i < 4; i++) {
            const rayGeometry = new THREE.ConeGeometry(0.025, 0.4, 4);
            const rayMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.5
            });
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.position.y = 0.45;
            ray.rotation.z = (Math.PI / 2) * i;
            group.add(ray);
        }
    } else {
        // 普通及以下：使用四面体
        const starGeometry = new THREE.TetrahedronGeometry(0.35, 0);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffa500,
            emissiveIntensity: 0.25,
            metalness: 0.5,
            roughness: 0.4
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        group.add(star);
    }

    // 星星光晕 - 根据画质调整
    const glowCanvas = document.createElement('canvas');
    const glowTextureSize = getTextureSize(32);
    glowCanvas.width = glowTextureSize;
    glowCanvas.height = glowTextureSize;
    const glowCtx = glowCanvas.getContext('2d');
    const gradient = glowCtx.createRadialGradient(glowTextureSize / 2, glowTextureSize / 2, 0, glowTextureSize / 2, glowTextureSize / 2, glowTextureSize / 2);

    if (level >= 6) {
        gradient.addColorStop(0, 'rgba(255, 230, 100, 0.55)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.25)');
        gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
    } else if (level >= 5) {
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
    } else {
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    }

    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, glowTextureSize, glowTextureSize);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowSpriteMaterial = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false });
    const glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.scale.set(level >= 5 ? 1.3 : 1, level >= 5 ? 1.3 : 1, 1);
    group.add(glowSprite);

    // 超极致添加点光源
    if (level >= 6) {
        const pointLight = new THREE.PointLight(0xffd700, 0.4, 2.5);
        group.add(pointLight);
    }

    group.position.set(x, 0.6, z);
    group.userData = {
        type: 'star',
        collected: false,
        rotationSpeed: 0.02,
        floatOffset: Math.random() * Math.PI * 2
    };

    MiniMax._scene.add(group);
    collectibles.push(group);

    return group;
}

/**
 * 创建钻石 - 根据画质等级调整精细程度
 */
function createDiamond(x, z) {
    const group = new THREE.Group();
    const level = getQualityLevel();

    // 根据画质选择几何分段数
    const diamondSegments = getGeometrySegments(8);

    if (level >= 6) {
        // 超极致：使用双八面体组合，模拟更复杂的钻石切割
        // 顶部
        const topGeometry = new THREE.OctahedronGeometry(0.32, 0);
        const diamondMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0088ff,
            emissiveIntensity: 0.45,
            metalness: 0.85,
            roughness: 0.1,
            transparent: true,
            opacity: 0.9,
            flatShading: false
        });
        const top = new THREE.Mesh(topGeometry, diamondMaterial);
        top.position.y = 0.15;
        group.add(top);

        // 底部
        const bottom = new THREE.Mesh(topGeometry, diamondMaterial);
        bottom.position.y = -0.15;
        group.add(bottom);

        // 添加内部折射效果模拟
        const innerGeometry = new THREE.OctahedronGeometry(0.15, 0);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ffff,
            transparent: true,
            opacity: 0.5
        });
        const inner = new THREE.Mesh(innerGeometry, innerMaterial);
        group.add(inner);

        // 多个小切面闪光效果
        for (let i = 0; i < 6; i++) {
            const facetGeometry = new THREE.CircleGeometry(0.05, 6);
            const facetMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const facet = new THREE.Mesh(facetGeometry, facetMaterial);
            const angle = (i / 6) * Math.PI * 2;
            facet.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
            facet.rotation.x = Math.PI / 2;
            group.add(facet);
        }
    } else if (level >= 5) {
        // 极致：使用八面体加内部细节
        const diamondGeometry = new THREE.OctahedronGeometry(0.3, 1);
        const diamondMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0088ff,
            emissiveIntensity: 0.4,
            metalness: 0.8,
            roughness: 0.15,
            transparent: true,
            opacity: 0.9
        });
        const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
        group.add(diamond);

        // 添加切面效果
        for (let i = 0; i < 4; i++) {
            const facetGeometry = new THREE.CircleGeometry(0.04, 5);
            const facetMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const facet = new THREE.Mesh(facetGeometry, facetMaterial);
            const angle = (i / 4) * Math.PI * 2;
            facet.position.set(Math.cos(angle) * 0.18, 0, Math.sin(angle) * 0.18);
            facet.rotation.x = Math.PI / 2;
            group.add(facet);
        }
    } else {
        // 普通及以下：简化的八面体
        const diamondGeometry = new THREE.OctahedronGeometry(0.3, 0);
        const diamondMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0088ff,
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.2,
            transparent: true,
            opacity: 0.85
        });
        const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
        group.add(diamond);
    }

    // 钻石光晕 - 根据画质调整
    const glowCanvas = document.createElement('canvas');
    const glowTextureSize = getTextureSize(32);
    glowCanvas.width = glowTextureSize;
    glowCanvas.height = glowTextureSize;
    const glowCtx = glowCanvas.getContext('2d');
    const gradient = glowCtx.createRadialGradient(glowTextureSize / 2, glowTextureSize / 2, 0, glowTextureSize / 2, glowTextureSize / 2, glowTextureSize / 2);

    if (level >= 6) {
        gradient.addColorStop(0, 'rgba(100, 255, 255, 0.55)');
        gradient.addColorStop(0.4, 'rgba(0, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
    } else if (level >= 5) {
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
        gradient.addColorStop(0.5, 'rgba(0, 220, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
    } else {
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    }

    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, glowTextureSize, glowTextureSize);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowSpriteMaterial = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false });
    const glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.scale.set(level >= 5 ? 1.3 : 1, level >= 5 ? 1.3 : 1, 1);
    group.add(glowSprite);

    // 超极致添加点光源
    if (level >= 6) {
        const pointLight = new THREE.PointLight(0x00ffff, 0.5, 2.5);
        group.add(pointLight);
    }

    group.position.set(x, 0.6, z);
    group.userData = {
        type: 'diamond',
        collected: false,
        rotationSpeed: 0.025,
        floatOffset: Math.random() * Math.PI * 2
    };

    MiniMax._scene.add(group);
    collectibles.push(group);

    return group;
}

/**
 * 创建树木 - 根据画质等级调整精细程度
 */
function createTree(x, z) {
    const group = new THREE.Group();
    const level = getQualityLevel();

    // 根据画质等级选择树干和树冠的分段数
    const trunkSegments = getGeometrySegments(8);
    const leavesSegments = getGeometrySegments(8);

    // 树干 - 根据画质调整
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.35, 1.8, trunkSegments);
    const trunkMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a3728,
        shininess: level >= 5 ? 50 : 20
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.9;
    group.add(trunk);

    // 树冠 - 根据画质等级调整层数和精细度
    const leavesMaterial = new THREE.MeshPhongMaterial({
        color: 0x2d5a3c,
        shininess: level >= 5 ? 80 : 30,
        specular: level >= 5 ? 0x445544 : 0x222222
    });

    if (level >= 6) {
        // 超极致：三层精细树冠
        const leavesGeometry1 = new THREE.ConeGeometry(1.4, 2.5, leavesSegments + 8);
        const leaves1 = new THREE.Mesh(leavesGeometry1, leavesMaterial);
        leaves1.position.y = 3.2;
        group.add(leaves1);

        const leavesGeometry2 = new THREE.ConeGeometry(1.1, 2.0, leavesSegments + 8);
        const leaves2 = new THREE.Mesh(leavesGeometry2, leavesMaterial);
        leaves2.position.y = 2.2;
        group.add(leaves2);

        const leavesGeometry3 = new THREE.ConeGeometry(0.8, 1.5, leavesSegments + 8);
        const leaves3 = new THREE.Mesh(leavesGeometry3, leavesMaterial);
        leaves3.position.y = 1.4;
        group.add(leaves3);
    } else if (level >= 5) {
        // 极致：双层树冠
        const leavesGeometry1 = new THREE.ConeGeometry(1.3, 2.2, leavesSegments + 4);
        const leaves1 = new THREE.Mesh(leavesGeometry1, leavesMaterial);
        leaves1.position.y = 2.8;
        group.add(leaves1);

        const leavesGeometry2 = new THREE.ConeGeometry(1.0, 1.8, leavesSegments + 4);
        const leaves2 = new THREE.Mesh(leavesGeometry2, leavesMaterial);
        leaves2.position.y = 1.8;
        group.add(leaves2);
    } else {
        // 普通及以下：单层树冠
        const leavesGeometry = new THREE.ConeGeometry(1, 2, leavesSegments);
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 2.5;
        group.add(leaves);
    }

    group.position.set(x, 0, z);
    MiniMax._scene.add(group);
    decorations.push(group);

    return group;
}

/**
 * 创建岩石
 */
function createRock(x, z, scale = 1) {
    const group = new THREE.Group();

    const rockGeometry = new THREE.DodecahedronGeometry(0.5 * scale, 0);
    const rockMaterial = new THREE.MeshPhongMaterial({
        color: 0x5a5a6a,
        shininess: 20
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.y = 0.3 * scale;
    rock.rotation.set(
        Math.random() * 0.5,
        Math.random() * Math.PI,
        Math.random() * 0.5
    );
    group.add(rock);

    group.position.set(x, 0, z);
    MiniMax._scene.add(group);
    obstacles.push(group);

    return group;
}

/**
 * 创建传送门（终点）
 */
function createPortal(x, z) {
    const group = new THREE.Group();
    group.userData = { isPortal: true, activated: false };

    // 底座
    const baseGeometry = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
    const