// Plasma Flare Generative Art with D3.js
// Let's build this step by step!

// Step 1: Set up our canvas dimensions and basic variables
const width = 800;
const height = 600;
const centerX = width / 2;
const centerY = height / 2;

// Step 2: Create our main SVG container
const svg = d3.select("#canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Step 3: Create a gradient for our plasma colors
const defs = svg.append("defs");

// Create a radial gradient for the center circle
const centerGradient = defs.append("radialGradient")
    .attr("id", "centerGradient")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%");

centerGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ff6b35")  // Orange center
    .attr("stop-opacity", 1);

centerGradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "#ff1744")  // Red
    .attr("stop-opacity", 0.8);

centerGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#7b1fa2")  // Purple edge
    .attr("stop-opacity", 0.6);

// Step 4: Create the center circle
const centerCircle = svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", 50)
    .attr("fill", "url(#centerGradient)")
    .attr("opacity", 0.9);

// Step 5: Define our plasma colors array
const plasmaColors = [
    "#ff1744",  // Red
    "#ff6b35",  // Orange  
    "#ffd600",  // Yellow
    "#7b1fa2",  // Purple
    "#e91e63",  // Pink
    "#ff5722"   // Deep Orange
];

// Step 6: Variables for animation
let animationId;
let isAnimating = false;
let time = 0;
let colorShiftTime = 0;
let lastFlareRegenTime = 0;
let currentColorIndex = 0;

// Step 7: Function to create massive erupting solar flare loops (like NASA image)
function generateFlareData(numFlares = 4) {
    const flares = [];
    
    for (let i = 0; i < numFlares; i++) {
        // Create fewer but much more dramatic flares
        const baseAngle = (i / numFlares) * 2 * Math.PI + (Math.random() - 0.5) * 1.0;
        const flareLength = Math.random() * 200 + 150; // Much longer flares
        
        flares.push({
            id: i,
            baseAngle: baseAngle,
            length: flareLength,
            maxLength: flareLength,
            width: Math.random() * 25 + 15, // Much thicker flares
            color: plasmaColors[Math.floor(Math.random() * plasmaColors.length)],
            speed: Math.random() * 0.008 + 0.004, // Slower, more majestic
            phase: Math.random() * Math.PI * 2,
            loopHeight: Math.random() * 100 + 80, // How high the loop arcs
            loopCurve: Math.random() * 0.8 + 0.5, // How curved the loop is
            magneticTwist: Math.random() * 2 + 1, // Magnetic field twisting
            explosionIntensity: Math.random() * 0.5 + 0.5,
            segments: 16, // More segments for smoother curves
            intensity: Math.random() * 0.7 + 0.8, // Brighter flares
            birthTime: Math.random() * 100,
            lifespan: Math.random() * 400 + 200, // Longer lasting
            isErupting: Math.random() > 0.5 // Some flares are actively erupting
        });
    }
    
    return flares;
}

// Step 8: Create initial flare data
let flareData = generateFlareData();

// Step 8.5: Function to create lava lamp ellipses
function generateLavaEllipses(numEllipses = 6) {
    const ellipses = [];
    const mainRadius = 45; // Slightly smaller than main circle to keep ellipses inside
    
    for (let i = 0; i < numEllipses; i++) {
        // Random position within the main circle
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * mainRadius * 0.7; // Keep them well within bounds
        
        ellipses.push({
            id: i,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            rx: Math.random() * 8 + 4,        // Random width between 4-12
            ry: Math.random() * 12 + 6,       // Random height between 6-18
            targetX: centerX,                  // Where it wants to move to
            targetY: centerY,
            speedX: (Math.random() - 0.5) * 0.3,  // Slow random movement
            speedY: (Math.random() - 0.5) * 0.3,
            color: plasmaColors[Math.floor(Math.random() * plasmaColors.length)],
            opacity: Math.random() * 0.4 + 0.3,   // Between 0.3 and 0.7
            rotationSpeed: (Math.random() - 0.5) * 0.02, // Slow rotation
            rotation: 0
        });
    }
    
    return ellipses;
}

// Step 8.6: Create initial lava ellipses
let lavaEllipses = generateLavaEllipses();

// Step 9: Function to draw massive erupting solar flare loops (NASA-style)
function drawFlares() {
    // Remove old flares
    svg.selectAll(".flare").remove();
    svg.selectAll(".flare-group").remove();
    
    // Create flare groups for each massive solar eruption
    const flareGroups = svg.selectAll(".flare-group")
        .data(flareData)
        .enter()
        .append("g")
        .attr("class", "flare-group");
    
    flareGroups.each(function(flareData, flareIndex) {
        const group = d3.select(this);
        const flare = flareData;
        
        // Calculate flare properties with eruption dynamics
        const age = time - flare.birthTime;
        const lifeProgress = Math.min(age / flare.lifespan, 1);
        
        // Eruption growth pattern - explosive start, then settling
        let sizeMultiplier;
        if (flare.isErupting && lifeProgress < 0.3) {
            // Explosive growth phase
            sizeMultiplier = Math.pow(lifeProgress / 0.3, 0.5) * (2 + Math.sin(time * 0.5) * 0.5);
        } else {
            // Settled plasma loop phase
            sizeMultiplier = 1 + Math.sin(time * flare.speed + flare.phase) * 0.2;
        }
        
        const currentLength = flare.length * sizeMultiplier;
        const pulsatingRadius = 50 + Math.sin(time * 1.5) * 25;
        
        // Create massive arcing loop like in NASA image
        const points = [];
        for (let segment = 0; segment <= flare.segments; segment++) {
            const t = segment / flare.segments;
            
            // Create the loop path - starts on surface, arcs high, comes back down
            let loopHeight, angleOffset;
            
            if (t < 0.5) {
                // Rising part of the loop
                loopHeight = Math.sin(t * Math.PI) * flare.loopHeight;
                angleOffset = t * flare.loopCurve;
            } else {
                // Falling part of the loop (or continuing outward for open loops)
                if (flare.isErupting) {
                    // Open eruption - continues outward
                    loopHeight = Math.sin(0.5 * Math.PI) * flare.loopHeight * (2 - t);
                    angleOffset = (t - 0.5) * flare.loopCurve * 2;
                } else {
                    // Closed loop - comes back down
                    loopHeight = Math.sin((1 - t) * Math.PI) * flare.loopHeight;
                    angleOffset = (1 - t) * flare.loopCurve;
                }
            }
            
            // Add magnetic field twisting
            const magneticTwist = Math.sin(t * Math.PI * flare.magneticTwist + time * flare.speed) * 0.3;
            
            // Base angle with twisting
            const segmentAngle = flare.baseAngle + angleOffset + magneticTwist +
                               Math.sin(time * flare.speed * 0.5 + t * 2) * 0.1; // Gentle movement
            
            // Distance calculation for the loop
            const baseDistance = pulsatingRadius + (currentLength * t);
            const loopDistance = baseDistance + loopHeight;
            
            // Add some plasma turbulence
            const turbulence = Math.sin(time * flare.speed * 2 + t * 4 + flare.phase) * 10 * t;
            const finalDistance = loopDistance + turbulence;
            
            // Calculate point position
            const x = centerX + Math.cos(segmentAngle) * finalDistance;
            const y = centerY + Math.sin(segmentAngle) * finalDistance;
            
            points.push([x, y]);
        }
        
        // Create smooth curve
        const line = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);
        
        // Draw multiple layers like in NASA image
        
        // 1. Outer glow (like the purple/pink outer regions)
        const outerWidth = flare.width * sizeMultiplier * 2;
        group.append("path")
            .attr("d", line(points))
            .attr("stroke", "#e91e63") // Pink/purple outer glow
            .attr("stroke-width", outerWidth)
            .attr("stroke-linecap", "round")
            .attr("fill", "none")
            .attr("opacity", 0.3 * flare.intensity);
        
        // 2. Main flare body
        const mainWidth = flare.width * sizeMultiplier * 
                         (1 + Math.sin(time * flare.speed * 2 + flare.phase) * 0.3);
        group.append("path")
            .attr("d", line(points))
            .attr("stroke", flare.color)
            .attr("stroke-width", mainWidth)
            .attr("stroke-linecap", "round")
            .attr("fill", "none")
            .attr("opacity", flare.intensity * (1 - lifeProgress * 0.2) * 
                           (0.6 + Math.sin(time * flare.speed + flare.phase) * 0.3));
        
        // 3. Bright core (like the white/yellow center)
        const coreWidth = (flare.width * 0.3) * sizeMultiplier * 
                         (1 + Math.sin(time * flare.speed * 3 + flare.phase + 1) * 0.5);
        group.append("path")
            .attr("d", line(points))
            .attr("stroke", "#ffffff") // Bright white core
            .attr("stroke-width", coreWidth)
            .attr("stroke-linecap", "round")
            .attr("fill", "none")
            .attr("opacity", flare.intensity * 0.9);
        
        // 4. Add explosion burst at base for erupting flares
        if (flare.isErupting && lifeProgress < 0.4) {
            const burstRadius = 20 * sizeMultiplier * (1 - lifeProgress / 0.4);
            group.append("circle")
                .attr("cx", centerX + Math.cos(flare.baseAngle) * pulsatingRadius)
                .attr("cy", centerY + Math.sin(flare.baseAngle) * pulsatingRadius)
                .attr("r", burstRadius)
                .attr("fill", "#ffffff")
                .attr("opacity", 0.8 * (1 - lifeProgress / 0.4));
        }
        
        // 5. Plasma particles along the massive flare
        const numParticles = Math.floor(flare.segments * 2);
        for (let p = 0; p < numParticles; p++) {
            const particleT = p / numParticles;
            const pointIndex = Math.floor(particleT * (points.length - 1));
            
            if (points[pointIndex]) {
                const [px, py] = points[pointIndex];
                const particleOffset = Math.sin(time * 2 + p + flare.phase) * 15;
                const particleSize = (Math.random() * 4 + 2) * sizeMultiplier;
                
                group.append("circle")
                    .attr("cx", px + Math.cos(time * 0.5 + p) * particleOffset)
                    .attr("cy", py + Math.sin(time * 0.5 + p) * particleOffset)
                    .attr("r", particleSize)
                    .attr("fill", flare.color)
                    .attr("opacity", (0.3 + Math.sin(time + p) * 0.2) * flare.intensity);
            }
        }
    });
}

// Step 9.3: Function to automatically cycle colors and regenerate flares
function autoUpdateEffects() {
    // Color cycling every 3 seconds
    if (time - colorShiftTime > 3.0) {
        colorShiftTime = time;
        
        // Shift all flare colors
        flareData.forEach(flare => {
            flare.color = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
        });
        
        // Shift lava ellipse colors  
        lavaEllipses.forEach(ellipse => {
            ellipse.color = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
        });
        
        // Occasionally update the center gradient colors
        if (Math.random() > 0.7) {
            const newCenterColor = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
            const newMidColor = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
            const newEdgeColor = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
            
            centerGradient.select("stop:nth-child(1)").attr("stop-color", newCenterColor);
            centerGradient.select("stop:nth-child(2)").attr("stop-color", newMidColor);
            centerGradient.select("stop:nth-child(3)").attr("stop-color", newEdgeColor);
        }
        
        console.log("Colors shifted automatically!");
    }
    
    // Regenerate random flares every 8-12 seconds
    if (time - lastFlareRegenTime > (8 + Math.random() * 4)) {
        lastFlareRegenTime = time;
        
        // Randomly regenerate 1-2 flares
        const numToRegen = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numToRegen; i++) {
            const randomIndex = Math.floor(Math.random() * flareData.length);
            const flare = flareData[randomIndex];
            
            // Create new flare properties
            flare.birthTime = time;
            flare.baseAngle = Math.random() * 2 * Math.PI;
            flare.length = Math.random() * 200 + 150;
            flare.maxLength = flare.length;
            flare.width = Math.random() * 25 + 15;
            flare.color = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
            flare.speed = Math.random() * 0.008 + 0.004;
            flare.phase = Math.random() * Math.PI * 2;
            flare.loopHeight = Math.random() * 100 + 80;
            flare.loopCurve = Math.random() * 0.8 + 0.5;
            flare.magneticTwist = Math.random() * 2 + 1;
            flare.explosionIntensity = Math.random() * 0.5 + 0.5;
            flare.intensity = Math.random() * 0.7 + 0.8;
            flare.lifespan = Math.random() * 400 + 200;
            flare.isErupting = Math.random() > 0.3;
        }
        
        // Occasionally add new lava ellipses
        if (Math.random() > 0.6 && lavaEllipses.length < 8) {
            const newEllipse = {
                id: lavaEllipses.length,
                x: centerX + (Math.random() - 0.5) * 60,
                y: centerY + (Math.random() - 0.5) * 60,
                rx: Math.random() * 8 + 4,
                ry: Math.random() * 12 + 6,
                targetX: centerX,
                targetY: centerY,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                color: plasmaColors[Math.floor(Math.random() * plasmaColors.length)],
                opacity: Math.random() * 0.4 + 0.3,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                rotation: 0
            };
            lavaEllipses.push(newEllipse);
        }
        
        console.log("New flares generated automatically!");
    }
}

// Step 9.4: Function to manage massive flare eruption lifecycle
function updateFlares() {
    // Check if any flares have died and need to be reborn
    flareData.forEach(flare => {
        const age = time - flare.birthTime;
        
        // If flare has lived its full lifespan, create a new massive eruption
        if (age > flare.lifespan) {
            flare.birthTime = time;
            flare.baseAngle = Math.random() * 2 * Math.PI;
            flare.length = Math.random() * 200 + 150; // Massive scale
            flare.maxLength = flare.length;
            flare.width = Math.random() * 25 + 15; // Thick plasma streams
            flare.color = plasmaColors[Math.floor(Math.random() * plasmaColors.length)];
            flare.speed = Math.random() * 0.008 + 0.004; // Slower, more majestic
            flare.phase = Math.random() * Math.PI * 2;
            flare.loopHeight = Math.random() * 100 + 80;
            flare.loopCurve = Math.random() * 0.8 + 0.5;
            flare.magneticTwist = Math.random() * 2 + 1;
            flare.explosionIntensity = Math.random() * 0.5 + 0.5;
            flare.intensity = Math.random() * 0.7 + 0.8;
            flare.lifespan = Math.random() * 400 + 200; // Long-lasting like real solar flares
            flare.isErupting = Math.random() > 0.3; // More likely to be erupting
        }
    });
}

// Step 9.5: Function to update lava ellipses (like oil in a lava lamp)
function updateLavaEllipses() {
    const mainRadius = 45; // Keep ellipses within this radius
    
    lavaEllipses.forEach(ellipse => {
        // Calculate distance from center
        const distFromCenter = Math.sqrt(
            (ellipse.x - centerX) ** 2 + (ellipse.y - centerY) ** 2
        );
        
        // If ellipse is getting too close to edge, push it back toward center
        if (distFromCenter > mainRadius - ellipse.rx) {
            const angleToCenter = Math.atan2(centerY - ellipse.y, centerX - ellipse.x);
            ellipse.speedX += Math.cos(angleToCenter) * 0.005;
            ellipse.speedY += Math.sin(angleToCenter) * 0.005;
        }
        
        // Add some random drift (lava lamp effect)
        ellipse.speedX += (Math.random() - 0.5) * 0.002;
        ellipse.speedY += (Math.random() - 0.5) * 0.002;
        
        // Apply friction to keep movement smooth and slow
        ellipse.speedX *= 0.98;
        ellipse.speedY *= 0.98;
        
        // Update position
        ellipse.x += ellipse.speedX;
        ellipse.y += ellipse.speedY;
        
        // Update rotation
        ellipse.rotation += ellipse.rotationSpeed;
        
        // Slight size variation (breathing effect)
        ellipse.currentRx = ellipse.rx + Math.sin(time * 0.5 + ellipse.id) * 1;
        ellipse.currentRy = ellipse.ry + Math.cos(time * 0.3 + ellipse.id) * 1.5;
    });
}

// Step 9.6: Function to draw lava ellipses
function drawLavaEllipses() {
    // Update positions first
    updateLavaEllipses();
    
    // Remove old ellipses
    svg.selectAll(".lava-ellipse").remove();
    
    // Create new ellipses
    const ellipses = svg.selectAll(".lava-ellipse")
        .data(lavaEllipses)
        .enter()
        .append("ellipse")
        .attr("class", "lava-ellipse")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("rx", d => d.currentRx || d.rx)
        .attr("ry", d => d.currentRy || d.ry)
        .attr("fill", d => d.color)
        .attr("opacity", d => d.opacity + Math.sin(time * 0.8 + d.id) * 0.1)
        .attr("transform", d => `rotate(${d.rotation * 180 / Math.PI}, ${d.x}, ${d.y})`);
}

// Step 10: Animation function
function animate() {
    if (!isAnimating) return;
    
    time += 0.016; // Roughly 60fps
    
    // Automatic color cycling and flare regeneration
    autoUpdateEffects();
    
    // Update center circle with bigger pulse
    centerCircle
        .attr("r", 50 + Math.sin(time * 1.5) * 25)  // Much bigger pulse: 25-75 radius
        .attr("opacity", 0.8 + Math.sin(time * 2.5) * 0.2);
    
    // Update flare lifecycle
    updateFlares();
    
    // Draw lava ellipses first (so they appear behind flares)
    drawLavaEllipses();
    
    // Draw organic solar flares
    drawFlares();
    
    // Continue animation
    animationId = requestAnimationFrame(animate);
}

// Step 11: Control functions
function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        animate();
        console.log("Animation started!");
    }
}

function stopAnimation() {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    console.log("Animation stopped!");
}

function resetArt() {
    stopAnimation();
    time = 0;
    colorShiftTime = 0;
    lastFlareRegenTime = 0;
    currentColorIndex = 0;
    flareData = generateFlareData();
    lavaEllipses = generateLavaEllipses();
    
    // Reset gradient to original colors
    centerGradient.select("stop:nth-child(1)").attr("stop-color", "#ff6b35");
    centerGradient.select("stop:nth-child(2)").attr("stop-color", "#ff1744");
    centerGradient.select("stop:nth-child(3)").attr("stop-color", "#7b1fa2");
    
    drawFlares();
    drawLavaEllipses();
    console.log("Art reset!");
}

// Step 12: Initialize the art piece
console.log("Plasma Flare Art with Lava Lamp Ellipses initialized!");
console.log("Click 'Start' to begin the animation!");

// Draw initial flares and lava ellipses
drawFlares();
drawLavaEllipses();
