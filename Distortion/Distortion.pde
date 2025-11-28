import processing.sound.*;

SoundFile backgroundMusic;
Amplitude amp;

PImage water;
ArrayList<PixelParticle> particles = new ArrayList<PixelParticle>();

void setup() {
  size(1200, 1000);
  
  backgroundMusic = new SoundFile(this, "Poetry Love.mp3");
  backgroundMusic.loop();
  
  amp = new Amplitude(this);
  amp.input(backgroundMusic);

  water = loadImage("Plasma-Clouds.jpg");
  water.resize(width, height);

  // Create particles from image pixels
  for (int x = 0; x < width; x += 4) {
    for (int y = 0; y < height; y += 4) {
      color c = water.get(x, y);
      particles.add(new PixelParticle(x, y, c));
    }
  }
}

void draw() {
  fill(0, 40);  // fading background for trails
  rect(0, 0, width, height);

  float level = amp.analyze();

  // Apply optional image ripple distortion BEFORE updating particles
  float wave = sin(frameCount * 0.05) * level * 20;

  for (PixelParticle p : particles) {
    // Slightly offset target horizontally for "ripple" effect
    p.target.x += wave * 0.1;  
    p.update(level);
    p.show(level);
    p.target.x -= wave * 0.1;  // reset so target doesn't drift forever
  }
}
