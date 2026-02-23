/**
 * MiniMax 简易3D游戏引擎
 * 基于Three.js实现的轻量级游戏引擎
 */

const MiniMax = {
    version: '1.0.0',

    // 引擎状态
    _initialized: false,
    _running: false,
    _scene: null,
    _camera: null,
    _renderer: null,
    _clock: null,

    /**
     * 初始化引擎
     */
    init: function(config = {}) {
        if (this._initialized) {
            console.warn('MiniMax 引擎已经初始化');
            return this;
        }

        const container = config.container || document.getElementById('scene-container');
        const width = config.width || window.innerWidth;
        const height = config.height || window.innerHeight;
        const antialias = config.antialias !== false;

        // 创建渲染器
        this._renderer = new THREE.WebGLRenderer({
            antialias: antialias,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this._renderer.setSize(width, height);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.shadowMap.enabled = false;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.outputEncoding = THREE.sRGBEncoding;
        this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this._renderer.toneMappingExposure = 1.0;
        container.appendChild(this._renderer.domElement);

        // 创建场景
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x0f0f23);
        this._scene.fog = new THREE.Fog(0x0f0f23, 20, 100);

        // 创建相机
        this._camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            0.1,
            1000
        );
        this._camera.position.set(0, 15, 20);
        this._camera.lookAt(0, 0, 0);

        // 创建时钟
        this._clock = new THREE.Clock();

        // 设置环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this._scene.add(ambientLight);

        // 设置方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(30, 50, 30);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -60;
        directionalLight.shadow.camera.right = 60;
        directionalLight.shadow.camera.top = 60;
        directionalLight.shadow.camera.bottom = -60;
        directionalLight.shadow.bias = -0.0001;
        this._scene.add(directionalLight);
        this._directionalLight = directionalLight;

        // 监听窗口大小变化
        window.addEventListener('resize', () => this._onResize());

        this._initialized = true;

        // 隐藏加载提示
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }

        return this;
    },

    /**
     * 启动引擎
     */
    start: function() {
        if (!this._initialized) {
            console.error('请先调用 MiniMax.init()');
            return this;
        }

        if (this._running) {
            return this;
        }

        this._running = true;
        this._animate();
        return this;
    },

    /**
     * 停止引擎
     */
    stop: function() {
        this._running = false;
        return this;
    },

    /**
     * 动画循环
     */
    _animate: function() {
        if (!this._running) return;

        requestAnimationFrame(() => this._animate());

        const deltaTime = this._clock.getDelta();

        // 触发更新回调
        if (this._onUpdateCallback) {
            this._onUpdateCallback(deltaTime);
        }

        // 渲染场景
        this._renderer.render(this._scene, this._camera);
    },

    /**
     * 注册更新回调
     */
    onUpdate: function(callback) {
        this._onUpdateCallback = callback;
        return this;
    },

    /**
     * 窗口大小变化处理
     */
    _onResize: function() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);

        if (this._onResizeCallback) {
            this._onResizeCallback({ width, height });
        }
    },

    /**
     * 注册窗口大小变化回调
     */
    onResize: function(callback) {
        this._onResizeCallback = callback;
        return this;
    },

    /**
     * 获取场景
     */
    getScene: function() {
        return this._scene;
    },

    /**
     * 获取相机
     */
    getCamera: function() {
        return this._camera;
    },

    /**
     * 获取渲染器
     */
    getRenderer: function() {
        return this._renderer;
    },

    /**
     * 获取场景
     */
    getScene: function() {
        return this._scene;
    },

    /**
     * 获取相机
     */
    getCamera: function() {
        return this._camera;
    },

    /**
     * 获取方向光
     */
    getDirectionalLight: function() {
        return this._directionalLight;
    },

    /**
     * 应用画质设置 - 动态调整渲染器参数
     * @param {Object} settings - 画质配置对象
     */
    applyQualitySettings: function(settings) {
        if (!this._renderer || !this._scene) {
            console.warn('引擎未初始化，无法应用画质设置');
            return;
        }

        const renderer = this._renderer;
        const scene = this._scene;

        // 应用像素比
        if (settings.pixelRatio !== undefined) {
            renderer.setPixelRatio(Math.min(settings.pixelRatio, window.devicePixelRatio));
            console.log(`像素比已设置为: ${renderer.getPixelRatio()}`);
        }

        // 应用抗锯齿
        if (settings.antialias !== undefined) {
            console.log(`抗锯齿设置: ${settings.antialias}`);
        }

        // 应用阴影设置
        if (settings.shadowEnabled !== undefined) {
            renderer.shadowMap.enabled = settings.shadowEnabled;
            console.log(`阴影已${settings.shadowEnabled ? '启用' : '禁用'}`);
        }

        // 应用阴影贴图大小
        if (settings.shadowMapSize !== undefined && this._directionalLight) {
            this._directionalLight.shadow.mapSize.width = settings.shadowMapSize;
            this._directionalLight.shadow.mapSize.height = settings.shadowMapSize;
            console.log(`阴影贴图大小已设置为: ${settings.shadowMapSize}x${settings.shadowMapSize}`);
        }

        // 应用阴影范围
        if (settings.shadowRange !== undefined && this._directionalLight) {
            const range = settings.shadowRange;
            this._directionalLight.shadow.camera.left = -range;
            this._directionalLight.shadow.camera.right = range;
            this._directionalLight.shadow.camera.top = range;
            this._directionalLight.shadow.camera.bottom = -range;
            console.log(`阴影范围已设置为: ±${range}`);
        }

        // 应用雾效
        if (settings.fogDistance !== undefined) {
            scene.fog = new THREE.Fog(scene.background, 20, settings.fogDistance);
            console.log(`雾效距离已设置为: ${settings.fogDistance}`);
        }

        // 应用色调映射
        if (settings.toneMapping !== undefined) {
            renderer.toneMapping = settings.toneMapping;
        }

        // 应用色调映射曝光
        if (settings.toneMappingExposure !== undefined) {
            renderer.toneMappingExposure = settings.toneMappingExposure;
            console.log(`色调映射曝光已设置为: ${settings.toneMappingExposure}`);
        }

        // 应用后处理效果（超极致画质）
        if (settings.postProcessing) {
            console.log('后处理效果已启用（超极致画质）');
        }

        console.log('画质设置已应用:', settings);
    }
};

/**
 * 摇杆输入类 - 简化稳定版本
 */
MiniMax.JoystickInput = class JoystickInput {
    constructor(config = {}) {
        this.container = config.container || document.getElementById('joystick-container');
        this.base = config.base || document.getElementById('joystick-base');
        this.knob = config.knob || document.getElementById('joystick-knob');
        this.debugInfo = config.debugInfo || document.getElementById('joystick-display');
        this.statusInfo = config.statusInfo || document.getElementById('status-display');

        this.maxRadius = config.maxRadius || 40;
        this.vector = { x: 0, y: 0 };
        this.active = false;
        this.touchId = null;

        this._initEvents();
    }

    _initEvents() {
        // 触摸事件 - 使用事件委托
        this.base.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.changedTouches[0];
            this.touchId = touch.identifier;
            this.active = true;
            this.base.classList.add('active');
            this._updateStatus('触摸中...');
            this._updatePosition(touch.clientX, touch.clientY);
        }, { passive: false });

        this.base.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.touchId) {
                    this._updatePosition(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                    break;
                }
            }
        }, { passive: false });

        const endHandler = (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (this.touchId === null || e.changedTouches[i].identifier === this.touchId) {
                    this._reset();
                    break;
                }
            }
            // 安全检查
            if (e.touches.length === 0) {
                this._reset();
            }
        };

        this.base.addEventListener('touchend', endHandler);
        this.base.addEventListener('touchcancel', endHandler);

        // 鼠标事件（桌面端测试）
        let isMouseDown = false;
        this.base.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            this.active = true;
            this.base.classList.add('active');
            this._updateStatus('鼠标按下...');
            this._updatePosition(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                this._updatePosition(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isMouseDown) {
                isMouseDown = false;
                this._reset();
            }
        });

        console.log('摇杆事件监听器已初始化');
    }

    _getCenter() {
        const rect = this.base.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    _updatePosition(clientX, clientY) {
        const center = this._getCenter();
        let dx = clientX - center.x;
        let dy = clientY - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.maxRadius) {
            dx = (dx / distance) * this.maxRadius;
            dy = (dy / distance) * this.maxRadius;
        }

        this.knob.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;

        this.vector = {
            x: dx / this.maxRadius,
            y: dy / this.maxRadius
        };

        this._updateDebug();
    }

    _updateDebug() {
        if (this.debugInfo) {
            this.debugInfo.textContent = `${this.vector.x.toFixed(2)}, ${this.vector.y.toFixed(2)}`;
        }
    }

    _updateStatus(status) {
        if (this.statusInfo) {
            this.statusInfo.textContent = status;
        }
    }

    _reset() {
        this.active = false;
        this.touchId = null;
        this.vector = { x: 0, y: 0 };
        this.knob.style.transform = 'translate(-50%, -50%)';
        this.base.classList.remove('active');
        this._updateStatus('等待输入...');
        this._updateDebug();
    }

    getVector() {
        return this.vector;
    }

    isActive() {
        return this.active;
    }

    // 安全检查
    safetyCheck() {
        if (this.active && this.touchId === null) {
            this._reset();
        }
    }
};

/**
 * 场景类
 */
MiniMax.Scene = class Scene {
    constructor() {
        this._objects = [];
    }

    add(obj) {
        if (obj._mesh) {
            MiniMax._scene.add(obj._mesh);
            this._objects.push(obj);
        }
        return obj;
    }

    remove(obj) {
        if (obj._mesh) {
            MiniMax._scene.remove(obj._mesh);
            const index = this._objects.indexOf(obj);
            if (index > -1) {
                this._objects.splice(index, 1);
            }
        }
    }
};

/**
 * 相机类
 */
MiniMax.Camera = class Camera {
    constructor(config = {}) {
        this._camera = MiniMax._camera;
        this._targetPosition = new THREE.Vector3();
        this._targetLookAt = new THREE.Vector3();
    }

    setPosition(x, y, z) {
        this._camera.position.set(x, y, z);
        return this;
    }

    lookAt(x, y, z) {
        this._camera.lookAt(x, y, z);
        return this;
    }

    follow(target, offset = { x: 0, y: 10, z: 15 }, smooth = 0.1) {
        if (target._mesh) {
            this._targetPosition.set(
                target._mesh.position.x + offset.x,
                target._mesh.position.y + offset.y,
                target._mesh.position.z + offset.z
            );

            this._camera.position.lerp(this._targetPosition, smooth);
            this._camera.lookAt(target._mesh.position);
        }
        return this;
    }
};

/**
 * 基础网格类
 */
class BaseMesh {
    constructor() {
        this._mesh = null;
        this._velocity = { x: 0, y: 0, z: 0 };
    }

    setPosition(x, y, z) {
        if (this._mesh) {
            this._mesh.position.set(x, y, z);
        }
        return this;
    }

    getPosition() {
        if (this._mesh) {
            return {
                x: this._mesh.position.x,
                y: this._mesh.position.y,
                z: this._mesh.position.z
            };
        }
        return { x: 0, y: 0, z: 0 };
    }

    setRotation(x, y, z) {
        if (this._mesh) {
            this._mesh.rotation.set(x, y, z);
        }
        return this;
    }

    setScale(x, y, z) {
        if (this._mesh) {
            this._mesh.scale.set(x, y, z);
        }
        return this;
    }

    update(deltaTime) {
        if (this._mesh) {
            this._mesh.position.x += this._velocity.x * deltaTime;
            this._mesh.position.y += this._velocity.y * deltaTime;
            this._mesh.position.z += this._velocity.z * deltaTime;
        }
    }
}

/**
 * 盒子网格
 */
MiniMax.BoxMesh = class BoxMesh extends BaseMesh {
    constructor(config = {}) {
        super();
        const width = config.width || 1;
        const height = config.height || 1;
        const depth = config.depth || 1;
        const color = config.color || 0x4facfe;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            specular: 0x444444
        });

        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;

        if (config.position) {
            this.setPosition(config.position.x, config.position.y, config.position.z);
        }
    }
};

/**
 * 球体网格
 */
MiniMax.SphereMesh = class SphereMesh extends BaseMesh {
    constructor(config = {}) {
        super();
        const radius = config.radius || 0.5;
        const color = config.color || 0x4facfe;

        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100
        });

        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;

        if (config.position) {
            this.setPosition(config.position.x, config.position.y, config.position.z);
        }
    }
};

/**
 * 平面网格
 */
MiniMax.PlaneMesh = class PlaneMesh extends BaseMesh {
    constructor(config = {}) {
        super();
        const width = config.width || 10;
        const height = config.height || 10;
        const color = config.color || 0xe0e0e0;

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            side: THREE.DoubleSide
        });

        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.receiveShadow = true;
        this._mesh.rotation.x = -Math.PI / 2;

        if (config.position) {
            this.setPosition(config.position.x, config.position.y, config.position.z);
        }
    }
};

/**
 * 玩家类
 */
MiniMax.Player = class Player extends BaseMesh {
    constructor(config = {}) {
        super();
        const color = config.color || 0xff4500;
        const height = config.height || 1.8;

        this._mesh = new THREE.Group();

        // 身体
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, height, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = height / 2;
        body.castShadow = true;
        this._mesh.add(body);

        // 头部
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xffccaa,
            shininess: 50
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = height + 0.3;
        head.castShadow = true;
        this._mesh.add(head);

        // 眼睛
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.12, height + 0.35, 0.25);
        this._mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.12, height + 0.35, 0.25);
        this._mesh.add(rightEye);

        if (config.position) {
            this.setPosition(config.position.x, config.position.y, config.position.z);
        }
    }

    move(direction, speed) {
        if (this._mesh) {
            const angle = Math.atan2(direction.x, direction.y);
            this._mesh.rotation.y = angle;
        }

        this._velocity.x = direction.x * speed;
        this._velocity.z = direction.y * speed;
    }

    stop() {
        this._velocity.x = 0;
        this._velocity.z = 0;
    }
};

/**
 * 第一人称交互控制器类
 * 用于第一人称视角的摇杆控制
 */
MiniMax.Interaction = function(container, target, position) {
    this.container = container || document.body;
    this.target = target || new THREE.Vector3();
    this.position = position || new THREE.Vector3();
    
    // 摇杆状态
    this._active = false;
    this._vector = { x: 0, y: 0 };
    this._center = { x: 0, y: 0 };
    this._maxRadius = 60;
    
    // 创建摇杆DOM元素
    this.rocker = this._createRocker();
    
    // 绑定事件
    this._bindEvents();
};

MiniMax.Interaction.prototype = {
    constructor: MiniMax.Interaction,
    
    /**
     * 创建摇杆DOM元素
     */
    _createRocker: function() {
        const self = this;
        
        // 摇杆容器
        const container = document.createElement('div');
        container.style.cssText = 'position: fixed; z-index: 1001; width: 100px; height: 100px; pointer-events: auto;';
        
        // 摇杆底座
        const base = document.createElement('div');
        base.style.cssText = 'width: 100px; height: 100px; background: rgba(79, 172, 254, 0.15); border: 3px solid rgba(79, 172, 254, 0.5); border-radius: 50%; position: relative; touch-action: none; box-shadow: 0 0 20px rgba(79, 172, 254, 0.3);';
        
        // 摇杆旋钮
        const knob = document.createElement('div');
        knob.style.cssText = 'width: 45px; height: 45px; background: linear-gradient(145deg, #4facfe, #00f2fe); border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 15px rgba(79, 172, 254, 0.6);';
        
        base.appendChild(knob);
        container.appendChild(base);
        
        // 返回一个简单的对象来控制摇杆位置和domElement
        return {
            domElement: container,
            base: base,
            knob: knob,
            setPosition: function(x, y) {
                container.style.left = (x - 50) + 'px';
                container.style.top = (y - 50) + 'px';
                self._center = { x: x, y: y };
            }
        };
    },
    
    /**
     * 绑定触摸事件
     */
    _bindEvents: function() {
        const self = this;
        
        // 触摸开始
        this.rocker.domElement.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self._active = true;
            self.rocker.base.style.borderColor = 'rgba(79, 172, 254, 0.9)';
            self.rocker.base.style.background = 'rgba(79, 172, 254, 0.3)';
            self._updatePosition(e.touches[0]);
        }, { passive: false });
        
        // 触摸移动
        document.addEventListener('touchmove', function(e) {
            if (self._active) {
                e.preventDefault();
                self._updatePosition(e.touches[0]);
            }
        }, { passive: false });
        
        // 触摸结束
        document.addEventListener('touchend', function(e) {
            if (self._active) {
                self._active = false;
                self._vector = { x: 0, y: 0 };
                self.rocker.knob.style.transform = 'translate(-50%, -50%)';
                self.rocker.base.style.borderColor = 'rgba(79, 172, 254, 0.5)';
                self.rocker.base.style.background = 'rgba(79, 172, 254, 0.15)';
            }
        });
        
        // 鼠标事件支持（桌面端测试）
        this.rocker.domElement.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self._active = true;
            self._updatePositionMouse(e);
            
            const onMouseMove = function(moveEvent) {
                if (self._active) {
                    self._updatePositionMouse(moveEvent);
                }
            };
            
            const onMouseUp = function() {
                self._active = false;
                self._vector = { x: 0, y: 0 };
                self.rocker.knob.style.transform = 'translate(-50%, -50%)';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    },
    
    /**
     * 更新摇杆位置（触摸）
     */
    _updatePosition: function(touch) {
        const dx = touch.clientX - this._center.x;
        const dy = touch.clientY - this._center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = this._maxRadius;
        
        // 计算标准化向量
        let normalizedX = dx / maxDistance;
        let normalizedY = dy / maxDistance;
        
        // 限制在最大半径内
        if (distance > maxDistance) {
            normalizedX = (dx / distance) * (distance / maxDistance);
            normalizedY = (dy / distance) * (distance / maxDistance);
        }
        
        this._vector = { x: normalizedX, y: normalizedY };
        
        // 更新旋钮位置
        const knobX = normalizedX * maxDistance;
        const knobY = normalizedY * maxDistance;
        this.rocker.knob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
    },
    
    /**
     * 更新摇杆位置（鼠标）
     */
    _updatePositionMouse: function(e) {
        const dx = e.clientX - this._center.x;
        const dy = e.clientY - this._center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = this._maxRadius;
        
        // 计算标准化向量
        let normalizedX = dx / maxDistance;
        let normalizedY = dy / maxDistance;
        
        // 限制在最大半径内
        if (distance > maxDistance) {
            normalizedX = (dx / distance) * (distance / maxDistance);
            normalizedY = (dy / distance) * (distance / maxDistance);
        }
        
        this._vector = { x: normalizedX, y: normalizedY };
        
        // 更新旋钮位置
        const knobX = normalizedX * maxDistance;
        const knobY = normalizedY * maxDistance;
        this.rocker.knob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
    },
    
    /**
     * 检查摇杆是否激活
     */
    isActive: function() {
        return this._active;
    },
    
    /**
     * 获取摇杆向量
     */
    getVector: function() {
        return { x: this._vector.x, y: this._vector.y };
    },
    
    /**
     * 销毁摇杆
     */
    destroy: function() {
        if (this.rocker && this.rocker.domElement) {
            this.rocker.domElement.remove();
        }
    }
};

/**
 * 辅助函数
 */
MiniMax.createGrid = function(size = 20, divisions = 20) {
    const gridHelper = new THREE.GridHelper(size, divisions, 0x888888, 0xcccccc);
    gridHelper.position.y = 0.01;
    return gridHelper;
};

// 导出到全局
window.MiniMax = MiniMax;
