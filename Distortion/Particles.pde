class PixelParticle {
  PVector pos;
  PVector target;
  PVector vel;
  color col;

  PixelParticle(float x, float y, color c) {
    target = new PVector(x, y);
    pos = new PVector(random(width), random(height));
    vel = new PVector();
    col = c;
  }

  void update(float level) {
    // Move toward target
    PVector dir = PVector.sub(target, pos);
    dir.mult(0.08 + level * 0.4);  // go faster with loud music
    vel.add(dir);

    // Add jitter from amplitude (disruption)
    vel.x += random(-level * 10, level * 10);
    vel.y += random(-level * 10, level * 10);

    vel.limit(3 + level * 5);  // allow faster motion on loud parts
    pos.add(vel);
  }

  void show(float level) {
    float alpha = map(level, 0, 0.3, 30, 255);
    stroke(col, alpha);
    strokeWeight(2);
    point(pos.x, pos.y);
  }
}
