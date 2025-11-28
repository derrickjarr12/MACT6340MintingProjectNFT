let backgroundMusic;
let amp;
let cosmicImage;
let particles = [];
let isPlaying = false;
let isSetup = false;

function preload() {
    backgroundMusic = loadSound('/audio/Poetry Love.mp3');
    cosmicImage = loadImage('/images/CosmicDreams.jpeg');
}

function setup() {
    // Original canvas size
    let canvas = createCanvas(1200, 1000);
    canvas.parent('sketch-container');
    
    // Resize image to match canvas
    cosmicImage.resize(width, height);
    
    // Create amplitude analyzer
    amp = new p5.Amplitude();
    amp.setInput(backgroundMusic);
    
    // Create particles from image pixels at 4px intervals
    for (let x = 0; x < width; x += 4) {
        for (let y = 0; y < height; y += 4) {
            let c = cosmicImage.get(x, y);
            particles.push(new PixelParticle(x, y, c));
        }
    }
    
    isSetup = true;
    updateStatus('Ready - Click Play');
}

function draw() {
    // Fading background for trails
    fill(0, 40);
    rect(0, 0, width, height);
    
    let level = amp.getLevel();
    
    // Apply optional ripple distortion
    let wave = sin(frameCount * 0.05) * level * 20;
    
    for (let p of particles) {
        // Slightly offset target horizontally for "ripple" effect
        p.target.x += wave * 0.1;
        p.update(level);
        p.show(level);
        p.target.x -= wave * 0.1; // reset so target doesn't drift
    }
}

class PixelParticle {
    constructor(x, y, c) {
        this.target = createVector(x, y);
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.col = c;
    }
    
    update(level) {
        // Move toward target
        let dir = p5.Vector.sub(this.target, this.pos);
        dir.mult(0.08 + level * 0.4);  // go faster with loud music
        this.vel.add(dir);
        
        // Add jitter from amplitude (disruption)
        this.vel.x += random(-level * 10, level * 10);
        this.vel.y += random(-level * 10, level * 10);
        
        this.vel.limit(3 + level * 5);  // allow faster motion on loud parts
        this.pos.add(this.vel);
    }
    
    show(level) {
        let alpha = map(level, 0, 0.3, 30, 255);
        stroke(red(this.col), green(this.col), blue(this.col), alpha);
        strokeWeight(2);
        point(this.pos.x, this.pos.y);
    }
}

function toggleAudio() {
    if (!isSetup) return;
    
    if (!isPlaying) {
        backgroundMusic.loop();
        isPlaying = true;
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'flex';
        updateStatus('Playing...');
    }
}

function pauseAudio() {
    if (!isSetup) return;
    
    backgroundMusic.pause();
    isPlaying = false;
    document.getElementById('playBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
    updateStatus('Paused');
}

function resetSketch() {
    if (!isSetup) return;
    
    // Reset all particles to random positions with random velocities
    for (let p of particles) {
        p.pos = createVector(random(width), random(height));
        p.vel = createVector(random(-2, 2), random(-2, 2));
    }
    updateStatus('Reset');
}

function updateStatus(msg) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = msg;
    }
}

function windowResized() {
    // Keep fixed canvas size
    resizeCanvas(1200, 1000);
    
    // Resize image to match canvas
    cosmicImage.resize(width, height);
    
    // Recreate particles for dimensions
    particles = [];
    for (let x = 0; x < width; x += 4) {
        for (let y = 0; y < height; y += 4) {
            let c = cosmicImage.get(x, y);
            particles.push(new PixelParticle(x, y, c));
        }
    }
}
