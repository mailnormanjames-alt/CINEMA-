// ============================================
// WebGLAmbient — Atmospheric Particle System
// ============================================

export class WebGLAmbient {
  constructor(canvas, config = {}) {
    this.canvas = canvas || document.querySelector('canvas, [data-cinema-webgl]');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('data-cinema-webgl', '');
      this.canvas.id = 'webgl-canvas';
      document.body.prepend(this.canvas);
    }

    this.particleCount = config.particleCount || 2000;
    this.color = config.color || 0xC9A96E;
    this.opacity = config.opacity || 0.4;
    this.speed = config.speed || 0.3;
    this.mouseRepulsion = config.mouseRepulsion || 2.0;
    this.scrollInfluence = config.scrollInfluence || 2.0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollProgress = 0;
    this.time = 0;
    this._rafId = null;
    this._destroyed = false;

    this.init();
  }

  init() {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: false,
        alpha: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;

      this.createParticles();
      this.bindEvents();
      this._rafLoop();
    } catch (e) {
      console.warn('WebGLAmbient: WebGL not supported', e);
    }
  }

  createParticles() {
    const positions = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color(this.color) },
        uOpacity: { value: this.opacity }
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec2 uMouse;
        varying float vOpacity;

        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.15;
          pos.y += cos(uTime * 0.2 + position.x * 0.3) * 0.1;
          pos.z += sin(uTime * 0.15 + position.x * 0.2) * 0.08;

          vec2 mouseDir = pos.xy - uMouse;
          float mouseDist = length(mouseDir);
          if (mouseDist < 2.0) {
            float force = (2.0 - mouseDist) / 2.0;
            pos.xy += normalize(mouseDir) * force * 0.3;
          }

          pos.y -= uScrollProgress * 2.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          vOpacity = smoothstep(0.0, 0.3, 1.0 - abs(pos.z) / 5.0) * 0.6;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying float vOpacity;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vOpacity * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, this.material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll integration
    if (typeof lenis !== 'undefined') {
      lenis.on('scroll', (e) => {
        this.scrollProgress = e.progress || 0;
      });
    } else {
      window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      }, { passive: true });
    }
  }

  _rafLoop() {
    if (this._destroyed) return;
    this._rafId = requestAnimationFrame(() => this._rafLoop());

    this.time += 0.01;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.material.uniforms.uTime.value = this.time;
    this.material.uniforms.uMouse.value.set(this.mouseX * 3, this.mouseY * 3);
    this.material.uniforms.uScrollProgress.value = this.scrollProgress;

    this.particles.rotation.y = this.mouseX * 0.1;
    this.particles.rotation.x = this.mouseY * 0.05;

    this.renderer.render(this.scene, this.camera);
  }

  updateScroll(progress) {
    this.scrollProgress = progress;
  }

  setColor(hex) {
    this.material.uniforms.uColor.value.set(hex);
  }

  destroy() {
    this._destroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this.renderer) this.renderer.dispose();
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
