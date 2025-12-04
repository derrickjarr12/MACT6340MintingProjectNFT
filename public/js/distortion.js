let sketch = (p) => {
    let backgroundMusic;
    let amp;
    let cosmicImage;
    let particles = [];
    let isPlaying = false;
    let isSetup = false;

    class PixelParticle {
        constructor(x, y, c) {
            this.target = p.createVector(x, y);
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.col = c;
        }
        
        update(level) {
            let dir = p5.Vector.sub(this.target, this.pos);
            dir.mult(0.08 + level * 0.4);
            this.vel.add(dir);
            
            this.vel.x += p.random(-level * 10, level * 10);
            this.vel.y += p.random(-level * 10, level * 10);
            
            this.vel.limit(3 + level * 5);
            this.pos.add(this.vel);
        }
        
        show(level) {
            let alpha = p.map(level, 0, 0.3, 30, 255);
            p.stroke(p.red(this.col), p.green(this.col), p.blue(this.col), alpha);
            p.strokeWeight(2);
            p.point(this.pos.x, this.pos.y);
        }
    }

    p.preload = function() {
        try {
            backgroundMusic = p.loadSound('/audio/Poetry Love.mp3');
        } catch(e) {
            console.log("Audio file not loaded");
        }
        try {
            cosmicImage = p.loadImage('/images/CosmicDreams.jpeg');
        } catch(e) {
            console.log("Image file not loaded");
        }
    }

    p.setup = function() {
        let canvas = p.createCanvas(1200, 1000);
        canvas.parent('sketch-container');
        
        if (cosmicImage) {
            cosmicImage.resize(p.width, p.height);
            
            for (let x = 0; x < p.width; x += 8) {
                for (let y = 0; y < p.height; y += 8) {
                    let c = cosmicImage.get(x, y);
                    particles.push(new PixelParticle(x, y, c));
                }
            }
        }
        
        amp = new p5.Amplitude();
        if (backgroundMusic) {
            amp.setInput(backgroundMusic);
        }
        
        isSetup = true;
        updateStatus('Ready - Click Play');
    }

    p.draw = function() {
        p.fill(0, 40);
        p.rect(0, 0, p.width, p.height);
        
        let level = amp.getLevel();
        let wave = p.sin(p.frameCount * 0.05) * level * 20;
        
        for (let particle of particles) {
            particle.target.x += wave * 0.1;
            particle.update(level);
            particle.show(level);
        }
    }

    p.windowResized = function() {
        if (!isSetup) return;
        
        if (cosmicImage) {
            cosmicImage.resize(p.width, p.height);
            
            particles = [];
            for (let x = 0; x < p.width; x += 8) {
                for (let y = 0; y < p.height; y += 8) {
                    let c = cosmicImage.get(x, y);
                    particles.push(new PixelParticle(x, y, c));
                }
            }
        }
    }
};

// Initialize p5 instance
let mySketch = new p5(sketch);

// Global functions for HTML buttons
function toggleAudio() {
    if (!mySketch.backgroundMusic) return;
    
    if (mySketch.isPlaying) {
        mySketch.backgroundMusic.pause();
        mySketch.isPlaying = false;
        document.getElementById('playBtn').style.display = 'flex';
        document.getElementById('pauseBtn').style.display = 'none';
        updateStatus('Paused');
    } else {
        mySketch.backgroundMusic.play();
        mySketch.isPlaying = true;
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'flex';
        updateStatus('Playing...');
    }
}

function pauseAudio() {
    if (!mySketch.backgroundMusic) return;
    mySketch.backgroundMusic.pause();
    mySketch.isPlaying = false;
    document.getElementById('playBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
    updateStatus('Paused');
}

function resetSketch() {
    if (mySketch.backgroundMusic) {
        mySketch.backgroundMusic.stop();
    }
    mySketch.isPlaying = false;
    document.getElementById('playBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
    updateStatus('Reset - Click Play to start');
}

function updateStatus(msg) {
    let statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = msg;
    }
}
