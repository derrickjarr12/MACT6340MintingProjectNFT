// UI Controller for Generative Art Studio

class ArtStudioUI {
  constructor(studio) {
    this.studio = studio;
    this.selectedModule = null;
    this.draggedElement = null;
    this.setupModuleLibrary();
    this.setupCanvasDropZone();
    this.setupControlPanel();
    this.setupToolbar();
  }
  
  setupModuleLibrary() {
    const library = document.getElementById('module-library');
    if (!library) return;
    
    const modules = [
      { type: 'particles', name: 'Particles', icon: '●●●' },
      { type: 'waves', name: 'Waves', icon: '〰️' },
      { type: 'spirograph', name: 'Spirograph', icon: '⚙️' },
      { type: 'circles', name: 'Circles', icon: '○' },
      { type: 'triangles', name: 'Triangles', icon: '△' },
      { type: 'squares', name: 'Squares', icon: '□' },
      { type: 'stars', name: 'Stars', icon: '★' },
      { type: 'polygons', name: 'Polygons', icon: '⬡' },
      { type: 'hexagons', name: 'Hexagons', icon: '⬢' },
      { type: 'lines', name: 'Lines', icon: '╱' },
      { type: 'noise', name: 'Noise', icon: '▓' },
      { type: 'fractals', name: 'Fractals', icon: '🌿' },
      { type: 'audio-bars', name: 'Audio Bars', icon: '📊' },
      { type: 'radial-spectrum', name: 'Radial', icon: '◉' },
      { type: 'color-filter', name: 'Color Filter', icon: '🎨' },
      { type: 'blur', name: 'Blur', icon: '☁️' },
      { type: 'kaleidoscope', name: 'Kaleidoscope', icon: '❄️' }
    ];
    
    modules.forEach(mod => {
      const element = this.createModuleElement(mod);
      library.appendChild(element);
    });
  }
  
  createModuleElement(moduleData) {
    const div = document.createElement('div');
    div.className = 'module-template';
    div.draggable = true;
    div.dataset.type = moduleData.type;
    div.innerHTML = `
      <div class="module-icon">${moduleData.icon}</div>
      <div class="module-name">${moduleData.name}</div>
    `;
    
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('moduleType', moduleData.type);
      div.classList.add('dragging');
    });
    
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
    });
    
    return div;
  }
  
  setupCanvasDropZone() {
    const canvas = this.studio.canvas;
    
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });
    
    canvas.addEventListener('dragleave', () => {
      canvas.classList.remove('drag-over');
    });
    
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');
      
      const moduleType = e.dataTransfer.getData('moduleType');
      if (moduleType) {
        const module = this.studio.addModule({ type: moduleType });
        this.addModuleToLayerList(module);
        
        // Start animation if not running
        if (!this.studio.isRunning) {
          this.studio.start();
        }
      }
    });
  }
  
  setupControlPanel() {
    // This will be populated when a module is selected
    const panel = document.getElementById('control-panel');
    if (!panel) return;
    
    panel.innerHTML = `
      <div class="panel-empty">
        <p>👈 Drag modules onto canvas</p>
        <p>Click a layer to edit</p>
      </div>
    `;
  }
  
  addModuleToLayerList(module) {
    const layerList = document.getElementById('layer-list');
    if (!layerList) return;
    
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    layerItem.dataset.moduleId = module.id;
    layerItem.innerHTML = `
      <div class="layer-info">
        <span class="layer-name">${module.type}</span>
        <span class="layer-controls">
          <button class="layer-toggle" title="Toggle visibility">👁️</button>
          <button class="layer-delete" title="Remove">🗑️</button>
        </span>
      </div>
    `;
    
    // Click to select/edit
    layerItem.addEventListener('click', (e) => {
      if (!e.target.classList.contains('layer-toggle') && 
          !e.target.classList.contains('layer-delete')) {
        this.selectModule(module);
        document.querySelectorAll('.layer-item').forEach(item => {
          item.classList.remove('selected');
        });
        layerItem.classList.add('selected');
      }
    });
    
    // Toggle visibility
    layerItem.querySelector('.layer-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      module.enabled = !module.enabled;
      layerItem.classList.toggle('disabled', !module.enabled);
    });
    
    // Delete module
    layerItem.querySelector('.layer-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      this.studio.removeModule(module.id);
      layerItem.remove();
      if (this.selectedModule === module) {
        this.setupControlPanel();
      }
    });
    
    layerList.appendChild(layerItem);
  }
  
  selectModule(module) {
    this.selectedModule = module;
    this.showModuleControls(module);
  }
  
  showModuleControls(module) {
    const panel = document.getElementById('control-panel');
    if (!panel) return;
    
    panel.innerHTML = `
      <h3>${module.type} Settings</h3>
      <div class="controls" id="module-controls"></div>
    `;
    
    const controls = document.getElementById('module-controls');
    
    // Generate controls based on module config
    Object.keys(module.config).forEach(key => {
      const value = module.config[key];
      const control = this.createControl(key, value, (newValue) => {
        module.updateConfig(key, newValue);
      });
      controls.appendChild(control);
    });
  }
  
  createControl(name, value, onChange) {
    const div = document.createElement('div');
    div.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = name;
    div.appendChild(label);
    
    let input;
    
    if (typeof value === 'number') {
      input = document.createElement('input');
      input.type = 'range';
      input.min = 0;
      input.max = value > 1 ? value * 2 : 1;
      input.step = value > 1 ? 1 : 0.01;
      input.value = value;
      
      const valueDisplay = document.createElement('span');
      valueDisplay.textContent = value;
      valueDisplay.className = 'value-display';
      
      input.addEventListener('input', (e) => {
        const newValue = parseFloat(e.target.value);
        valueDisplay.textContent = newValue.toFixed(2);
        onChange(newValue);
      });
      
      div.appendChild(input);
      div.appendChild(valueDisplay);
      
    } else if (typeof value === 'boolean') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = value;
      input.addEventListener('change', (e) => {
        onChange(e.target.checked);
      });
      div.appendChild(input);
      
    } else if (typeof value === 'string' && value.startsWith('#')) {
      // Color picker
      input = document.createElement('input');
      input.type = 'color';
      input.value = value;
      input.addEventListener('change', (e) => {
        onChange(e.target.value);
      });
      div.appendChild(input);
      
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.value = value;
      input.addEventListener('change', (e) => {
        onChange(e.target.value);
      });
      div.appendChild(input);
    }
    
    return div;
  }
  
  setupToolbar() {
    const toolbar = document.getElementById('toolbar');
    if (!toolbar) return;
    
    // Play/Pause button
    const playBtn = document.createElement('button');
    playBtn.id = 'play-btn';
    playBtn.textContent = '⏸️ Pause';
    playBtn.addEventListener('click', () => {
      if (this.studio.isRunning) {
        this.studio.stop();
        playBtn.textContent = '▶️ Play';
      } else {
        this.studio.start();
        playBtn.textContent = '⏸️ Pause';
      }
    });
    toolbar.appendChild(playBtn);
    
    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '🗑️ Clear';
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all modules?')) {
        this.studio.clear();
        document.getElementById('layer-list').innerHTML = '';
        this.setupControlPanel();
      }
    });
    toolbar.appendChild(clearBtn);
    
    // Export image button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📸 Export';
    exportBtn.addEventListener('click', () => {
      const dataUrl = this.studio.exportImage();
      const link = document.createElement('a');
      link.download = `art-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    });
    toolbar.appendChild(exportBtn);
    
    // Save composition button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Save';
    saveBtn.addEventListener('click', () => {
      const composition = this.studio.exportComposition();
      localStorage.setItem('saved-composition', JSON.stringify(composition));
      alert('Composition saved!');
    });
    toolbar.appendChild(saveBtn);
    
    // Load composition button
    const loadBtn = document.createElement('button');
    loadBtn.textContent = '📂 Load';
    loadBtn.addEventListener('click', () => {
      const saved = localStorage.getItem('saved-composition');
      if (saved) {
        this.studio.loadComposition(JSON.parse(saved));
        alert('Composition loaded!');
      } else {
        alert('No saved composition found');
      }
    });
    toolbar.appendChild(loadBtn);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('art-canvas');
  if (canvas) {
    const studio = new ArtStudio(canvas);
    const ui = new ArtStudioUI(studio);
    studio.start();
    
    // Make studio globally accessible for debugging
    window.artStudio = studio;
  }
});
