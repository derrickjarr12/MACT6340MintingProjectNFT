// Simple D3.js example - Bar Chart
const data = [30, 86, 168, 281, 303, 365];

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 300);

const bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 70)
    .attr("y", d => 300 - d)
    .attr("width", 60)
    .attr("height", d => d)
    .attr("fill", "steelblue");

// Add labels
svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d)
    .attr("x", (d, i) => i * 70 + 30)
    .attr("y", d => 300 - d - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "black");

console.log("D3.js loaded successfully!");
