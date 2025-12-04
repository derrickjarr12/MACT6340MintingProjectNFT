// Modular Generative Art Studio
// Main orchestrator for the art builder

class ArtStudio {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.modules = [];
    this.isRunning = false;
    this.animationId = null;
    this.time = 0;
    this.fps = 60;
    this.audioContext = null;
    this.audioData = null;
    
    // Set canvas size
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
  
  addModule(moduleConfig) {
    const module = ModuleFactory.create(moduleConfig);
    module.id = `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.modules.push(module);
    return module;
  }
  
  removeModule(moduleId) {
    this.modules = this.modules.filter(m => m.id !== moduleId);
  }
  
  getModule(moduleId) {
    return this.modules.find(m => m.id === moduleId);
  }
  
  reorderModules(fromIndex, toIndex) {
    const [moved] = this.modules.splice(fromIndex, 1);
    this.modules.splice(toIndex, 0, moved);
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  animate() {
    if (!this.isRunning) return;
    
    // Clear canvas (optional - some modules look better without clearing)
    if (!this.preserveFrames) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Update and draw each module in order
    this.modules.forEach(module => {
      if (module.enabled) {
        module.update(this.time);
        module.draw(this.ctx, this.canvas.width, this.canvas.height, this.audioData);
      }
    });
    
    this.time++;
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.modules = [];
    this.time = 0;
  }
  
  exportImage(format = 'png') {
    return this.canvas.toDataURL(`image/${format}`);
  }
  
  exportComposition() {
    return {
      modules: this.modules.map(m => m.serialize()),
      canvasSize: {
        width: this.canvas.width,
        height: this.canvas.height
      },
      timestamp: Date.now()
    };
  }
  
  loadComposition(data) {
    this.clear();
    data.modules.forEach(moduleData => {
      this.addModule(moduleData);
    });
  }
  
  enableAudioReactivity(audioElement) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(this.audioContext.destination);
      analyser.fftSize = 256;
      
      this.audioData = {
        analyser,
        frequencyData: new Uint8Array(analyser.frequencyBinCount),
        timeDomainData: new Uint8Array(analyser.fftSize)
      };
      
      // Update audio data each frame
      const updateAudioData = () => {
        if (this.audioData) {
          this.audioData.analyser.getByteFrequencyData(this.audioData.frequencyData);
          this.audioData.analyser.getByteTimeDomainData(this.audioData.timeDomainData);
        }
        requestAnimationFrame(updateAudioData);
      };
      updateAudioData();
    }
  }
}

// Module Factory - Creates different types of modules
class ModuleFactory {
  static create(config) {
    const type = config.type || config;
    
    switch (type) {
      case 'particles':
        return new ParticleModule(config);
      case 'waves':
        return new WaveModule(config);
      case 'spirograph':
        return new SpirographModule(config);
      case 'circles':
        return new CircleModule(config);
      case 'triangles':
        return new TriangleModule(config);
      case 'squares':
        return new SquareModule(config);
      case 'stars':
        return new StarModule(config);
      case 'polygons':
        return new PolygonModule(config);
      case 'hexagons':
        return new HexagonModule(config);
      case 'lines':
        return new LineModule(config);
      case 'noise':
        return new NoiseModule(config);
      case 'fractals':
        return new FractalModule(config);
      case 'audio-bars':
        return new AudioBarsModule(config);
      case 'radial-spectrum':
        return new RadialSpectrumModule(config);
      case 'color-filter':
        return new ColorFilterModule(config);
      case 'blur':
        return new BlurModule(config);
      case 'kaleidoscope':
        return new KaleidoscopeModule(config);
      default:
        return new BaseModule(config);
    }
  }
}

// Base Module Class
class BaseModule {
  constructor(config = {}) {
    this.id = null;
    this.type = config.type || 'base';
    this.enabled = true;
    this.config = {
      color: '#ffffff',
      opacity: 1,
      blendMode: 'source-over',
      ...config
    };
  }
  
  update(time) {
    // Override in subclasses
  }
  
  draw(ctx, width, height, audioData) {
    ctx.globalAlpha = this.config.opacity;
    ctx.globalCompositeOperation = this.config.blendMode;
  }
  
  serialize() {
    return {
      type: this.type,
      config: this.config
    };
  }
  
  updateConfig(key, value) {
    this.config[key] = value;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ArtStudio, ModuleFactory, BaseModule };
}
