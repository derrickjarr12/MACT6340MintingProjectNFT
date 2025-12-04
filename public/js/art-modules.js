// Visual Modules for Generative Art Studio

// Particle System Module
class ParticleModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'particles';
    this.particles = [];
    this.config = {
      count: 100,
      size: 2,
      speed: 1,
      color: '#ffffff',
      opacity: 0.8,
      trail: false,
      ...config
    };
    this.initParticles();
  }
  
  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        life: Math.random()
      });
    }
  }
  
  update(time) {
    this.particles.forEach(p => {
      p.x += p.vx * 0.01;
      p.y += p.vy * 0.01;
      
      // Wrap around edges
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;
      
      p.life += 0.01;
    });
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    ctx.fillStyle = this.config.color;
    
    this.particles.forEach(p => {
      const x = p.x * width;
      const y = p.y * height;
      const size = this.config.size;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

// Wave Module
class WaveModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'waves';
    this.config = {
      amplitude: 50,
      frequency: 0.02,
      speed: 0.05,
      lineWidth: 2,
      color: '#00ffff',
      count: 3,
      ...config
    };
    this.offset = 0;
  }
  
  update(time) {
    this.offset += this.config.speed;
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = this.config.lineWidth;
    
    for (let w = 0; w < this.config.count; w++) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        const y = height / 2 + 
          Math.sin(x * this.config.frequency + this.offset + w) * 
          this.config.amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }
}

// Spirograph Module
class SpirographModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'spirograph';
    this.config = {
      R: 100, // Fixed circle radius
      r: 30,  // Moving circle radius
      d: 50,  // Distance from center
      speed: 0.02,
      lineWidth: 1,
      color: '#ff00ff',
      ...config
    };
    this.t = 0;
  }
  
  update(time) {
    this.t += this.config.speed;
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = this.config.lineWidth;
    
    const cx = width / 2;
    const cy = height / 2;
    const { R, r, d } = this.config;
    
    ctx.beginPath();
    for (let i = 0; i < 1000; i++) {
      const t = i * 0.01;
      const x = cx + (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t);
      const y = cy + (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

// Circle Module
class CircleModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'circles';
    this.config = {
      count: 5,
      minRadius: 20,
      maxRadius: 100,
      rotationSpeed: 0.01,
      color: '#ffff00',
      fill: false,
      ...config
    };
    this.rotation = 0;
  }
  
  update(time) {
    this.rotation += this.config.rotationSpeed;
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    const cx = width / 2;
    const cy = height / 2;
    
    for (let i = 0; i < this.config.count; i++) {
      const radius = this.config.minRadius + 
        (this.config.maxRadius - this.config.minRadius) * (i / this.config.count);
      const angle = this.rotation + (i * Math.PI * 2 / this.config.count);
      
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      
      if (this.config.fill) {
        ctx.fillStyle = this.config.color;
        ctx.fill();
      } else {
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
}

// Line Module
class LineModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'lines';
    this.config = {
      count: 20,
      angle: 0,
      rotationSpeed: 0.005,
      length: 200,
      color: '#00ff00',
      ...config
    };
  }
  
  update(time) {
    this.config.angle += this.config.rotationSpeed;
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = 2;
    
    const cx = width / 2;
    const cy = height / 2;
    
    for (let i = 0; i < this.config.count; i++) {
      const angle = this.config.angle + (i * Math.PI * 2 / this.config.count);
      const x = cx + Math.cos(angle) * this.config.length;
      const y = cy + Math.sin(angle) * this.config.length;
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}

// Noise Module (Perlin-like patterns)
class NoiseModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'noise';
    this.config = {
      scale: 0.01,
      intensity: 100,
      speed: 0.01,
      color: '#ffffff',
      ...config
    };
    this.offset = 0;
  }
  
  update(time) {
    this.offset += this.config.speed;
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    const step = 10;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        const noise = Math.sin(x * this.config.scale + this.offset) * 
                     Math.cos(y * this.config.scale + this.offset);
        const brightness = (noise + 1) / 2 * this.config.intensity;
        
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${this.config.opacity})`;
        ctx.fillRect(x, y, step, step);
      }
    }
  }
}

// Fractal Module (Koch Snowflake or similar)
class FractalModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'fractals';
    this.config = {
      iterations: 3,
      rotation: 0,
      rotationSpeed: 0.002,
      color: '#ff6600',
      ...config
    };
  }
  
  update(time) {
    this.config.rotation += this.config.rotationSpeed;
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = 1;
    
    const size = Math.min(width, height) * 0.4;
    this.drawFractalTree(ctx, width / 2, height, size, -Math.PI / 2 + this.config.rotation, this.config.iterations);
  }
  
  drawFractalTree(ctx, x, y, len, angle, depth) {
    if (depth === 0) return;
    
    const x2 = x + len * Math.cos(angle);
    const y2 = y + len * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    this.drawFractalTree(ctx, x2, y2, len * 0.67, angle - Math.PI / 6, depth - 1);
    this.drawFractalTree(ctx, x2, y2, len * 0.67, angle + Math.PI / 6, depth - 1);
  }
}

// Audio Bars Module
class AudioBarsModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'audio-bars';
    this.config = {
      barCount: 64,
      barWidth: 5,
      color: '#00ffff',
      smoothing: 0.8,
      ...config
    };
  }
  
  draw(ctx, width, height, audioData) {
    if (!audioData) return;
    super.draw(ctx, width, height, audioData);
    
    const data = audioData.frequencyData;
    const barWidth = width / this.config.barCount;
    
    ctx.fillStyle = this.config.color;
    
    for (let i = 0; i < this.config.barCount; i++) {
      const barHeight = (data[i] / 255) * height * 0.8;
      const x = i * barWidth;
      const y = height - barHeight;
      
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
  }
}

// Radial Spectrum Module
class RadialSpectrumModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'radial-spectrum';
    this.config = {
      radius: 100,
      bars: 64,
      color: '#ff00ff',
      rotation: 0,
      rotationSpeed: 0.01,
      ...config
    };
  }
  
  update(time) {
    this.config.rotation += this.config.rotationSpeed;
  }
  
  draw(ctx, width, height, audioData) {
    if (!audioData) return;
    super.draw(ctx, width, height, audioData);
    
    const cx = width / 2;
    const cy = height / 2;
    const data = audioData.frequencyData;
    
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = 3;
    
    for (let i = 0; i < this.config.bars; i++) {
      const angle = (i / this.config.bars) * Math.PI * 2 + this.config.rotation;
      const amplitude = (data[i] / 255) * 100;
      const r1 = this.config.radius;
      const r2 = this.config.radius + amplitude;
      
      const x1 = cx + Math.cos(angle) * r1;
      const y1 = cy + Math.sin(angle) * r1;
      const x2 = cx + Math.cos(angle) * r2;
      const y2 = cy + Math.sin(angle) * r2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

// Color Filter Module (Effect)
class ColorFilterModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'color-filter';
    this.config = {
      hue: 0,
      saturation: 100,
      brightness: 100,
      ...config
    };
  }
  
  draw(ctx, width, height, audioData) {
    ctx.filter = `hue-rotate(${this.config.hue}deg) saturate(${this.config.saturation}%) brightness(${this.config.brightness}%)`;
  }
}

// Blur Module (Effect)
class BlurModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'blur';
    this.config = {
      amount: 5,
      ...config
    };
  }
  
  draw(ctx, width, height, audioData) {
    ctx.filter = `blur(${this.config.amount}px)`;
  }
}

// Kaleidoscope Module (Effect)
class KaleidoscopeModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'kaleidoscope';
    this.config = {
      segments: 6,
      ...config
    };
  }
  
  draw(ctx, width, height, audioData) {
    // Save the canvas state
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(ctx.canvas, 0, 0);
    
    // Apply kaleidoscope effect
    const cx = width / 2;
    const cy = height / 2;
    const angle = (Math.PI * 2) / this.config.segments;
    
    for (let i = 0; i < this.config.segments; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * i);
      ctx.drawImage(tempCanvas, -cx, -cy);
      ctx.restore();
    }
  }
}

// Triangle Module
class TriangleModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'triangles';
    this.config = {
      count: 5,
      size: 80,
      color: '#ff00ff',
      fillType: 'fill', // 'fill', 'stroke', or 'both'
      rotation: 0,
      randomize: false,
      randomRotation: false,
      ...config
    };
    this.triangles = [];
    this.initTriangles();
  }
  
  initTriangles() {
    this.triangles = [];
    for (let i = 0; i < this.config.count; i++) {
      this.triangles.push({
        x: this.config.randomize ? Math.random() : (i + 1) / (this.config.count + 1),
        y: this.config.randomize ? Math.random() : 0.5,
        size: this.config.randomize ? Math.random() * this.config.size + 20 : this.config.size,
        rotation: this.config.randomRotation ? Math.random() * Math.PI * 2 : this.config.rotation,
        opacity: this.config.randomize ? Math.random() * 0.5 + 0.5 : 1
      });
    }
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    this.triangles.forEach(tri => {
      const x = tri.x * width;
      const y = tri.y * height;
      const size = tri.size;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tri.rotation);
      ctx.globalAlpha = tri.opacity;
      
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.866, size * 0.5);
      ctx.lineTo(-size * 0.866, size * 0.5);
      ctx.closePath();
      
      if (this.config.fillType === 'fill' || this.config.fillType === 'both') {
        ctx.fillStyle = this.config.color;
        ctx.fill();
      }
      if (this.config.fillType === 'stroke' || this.config.fillType === 'both') {
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.restore();
    });
  }
}

// Square/Rectangle Module
class SquareModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'squares';
    this.config = {
      count: 5,
      size: 60,
      color: '#00ff00',
      fillType: 'fill',
      rotation: 0,
      randomize: false,
      randomRotation: false,
      randomSizes: false,
      ...config
    };
    this.squares = [];
    this.initSquares();
  }
  
  initSquares() {
    this.squares = [];
    for (let i = 0; i < this.config.count; i++) {
      this.squares.push({
        x: this.config.randomize ? Math.random() : (i + 1) / (this.config.count + 1),
        y: this.config.randomize ? Math.random() : 0.5,
        size: this.config.randomSizes ? Math.random() * this.config.size + 20 : this.config.size,
        rotation: this.config.randomRotation ? Math.random() * Math.PI * 2 : this.config.rotation,
        opacity: this.config.randomize ? Math.random() * 0.5 + 0.5 : 1
      });
    }
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    this.squares.forEach(sq => {
      const x = sq.x * width;
      const y = sq.y * height;
      const size = sq.size;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sq.rotation);
      ctx.globalAlpha = sq.opacity;
      
      if (this.config.fillType === 'fill' || this.config.fillType === 'both') {
        ctx.fillStyle = this.config.color;
        ctx.fillRect(-size / 2, -size / 2, size, size);
      }
      if (this.config.fillType === 'stroke' || this.config.fillType === 'both') {
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
      }
      
      ctx.restore();
    });
  }
}

// Star Module
class StarModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'stars';
    this.config = {
      count: 5,
      size: 50,
      points: 5,
      color: '#ffff00',
      fillType: 'fill',
      rotation: 0,
      randomize: false,
      randomRotation: false,
      ...config
    };
    this.stars = [];
    this.initStars();
  }
  
  initStars() {
    this.stars = [];
    for (let i = 0; i < this.config.count; i++) {
      this.stars.push({
        x: this.config.randomize ? Math.random() : (i + 1) / (this.config.count + 1),
        y: this.config.randomize ? Math.random() : 0.5,
        size: this.config.randomize ? Math.random() * this.config.size + 20 : this.config.size,
        rotation: this.config.randomRotation ? Math.random() * Math.PI * 2 : this.config.rotation,
        opacity: this.config.randomize ? Math.random() * 0.5 + 0.5 : 1
      });
    }
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    this.stars.forEach(star => {
      const x = star.x * width;
      const y = star.y * height;
      const outerRadius = star.size;
      const innerRadius = outerRadius * 0.5;
      const points = this.config.points;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(star.rotation);
      ctx.globalAlpha = star.opacity;
      
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * i) / points;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      
      if (this.config.fillType === 'fill' || this.config.fillType === 'both') {
        ctx.fillStyle = this.config.color;
        ctx.fill();
      }
      if (this.config.fillType === 'stroke' || this.config.fillType === 'both') {
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.restore();
    });
  }
}

// Polygon Module (customizable sides)
class PolygonModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'polygons';
    this.config = {
      count: 5,
      size: 60,
      sides: 6,
      color: '#ff8800',
      fillType: 'fill',
      rotation: 0,
      randomize: false,
      randomRotation: false,
      ...config
    };
    this.polygons = [];
    this.initPolygons();
  }
  
  initPolygons() {
    this.polygons = [];
    for (let i = 0; i < this.config.count; i++) {
      this.polygons.push({
        x: this.config.randomize ? Math.random() : (i + 1) / (this.config.count + 1),
        y: this.config.randomize ? Math.random() : 0.5,
        size: this.config.randomize ? Math.random() * this.config.size + 30 : this.config.size,
        rotation: this.config.randomRotation ? Math.random() * Math.PI * 2 : this.config.rotation,
        opacity: this.config.randomize ? Math.random() * 0.5 + 0.5 : 1
      });
    }
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    this.polygons.forEach(poly => {
      const x = poly.x * width;
      const y = poly.y * height;
      const radius = poly.size;
      const sides = this.config.sides;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(poly.rotation);
      ctx.globalAlpha = poly.opacity;
      
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      
      if (this.config.fillType === 'fill' || this.config.fillType === 'both') {
        ctx.fillStyle = this.config.color;
        ctx.fill();
      }
      if (this.config.fillType === 'stroke' || this.config.fillType === 'both') {
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.restore();
    });
  }
}

// Hexagon Module (optimized common case)
class HexagonModule extends BaseModule {
  constructor(config = {}) {
    super(config);
    this.type = 'hexagons';
    this.config = {
      count: 8,
      size: 40,
      color: '#00ffff',
      fillType: 'stroke',
      rotation: 0,
      pattern: 'random', // 'random', 'grid', 'line'
      randomRotation: false,
      ...config
    };
    this.hexagons = [];
    this.initHexagons();
  }
  
  initHexagons() {
    this.hexagons = [];
    
    if (this.config.pattern === 'grid') {
      const cols = Math.ceil(Math.sqrt(this.config.count));
      const rows = Math.ceil(this.config.count / cols);
      for (let i = 0; i < this.config.count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        this.hexagons.push({
          x: (col + 0.5) / cols,
          y: (row + 0.5) / rows,
          size: this.config.size,
          rotation: this.config.randomRotation ? Math.random() * Math.PI * 2 : this.config.rotation,
          opacity: 1
        });
      }
    } else {
      for (let i = 0; i < this.config.count; i++) {
        this.hexagons.push({
          x: this.config.pattern === 'random' ? Math.random() : (i + 1) / (this.config.count + 1),
          y: this.config.pattern === 'random' ? Math.random() : 0.5,
          size: this.config.pattern === 'random' ? Math.random() * this.config.size + 20 : this.config.size,
          rotation: this.config.randomRotation ? Math.random() * Math.PI * 2 : this.config.rotation,
          opacity: this.config.pattern === 'random' ? Math.random() * 0.5 + 0.5 : 1
        });
      }
    }
  }
  
  draw(ctx, width, height, audioData) {
    super.draw(ctx, width, height, audioData);
    
    this.hexagons.forEach(hex => {
      const x = hex.x * width;
      const y = hex.y * height;
      const radius = hex.size;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(hex.rotation);
      ctx.globalAlpha = hex.opacity;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      
      if (this.config.fillType === 'fill' || this.config.fillType === 'both') {
        ctx.fillStyle = this.config.color;
        ctx.fill();
      }
      if (this.config.fillType === 'stroke' || this.config.fillType === 'both') {
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.restore();
    });
  }
}

// Export all modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ParticleModule,
    WaveModule,
    SpirographModule,
    CircleModule,
    LineModule,
    NoiseModule,
    FractalModule,
    AudioBarsModule,
    RadialSpectrumModule,
    ColorFilterModule,
    BlurModule,
    KaleidoscopeModule,
    TriangleModule,
    SquareModule,
    StarModule,
    PolygonModule,
    HexagonModule
  };
}
