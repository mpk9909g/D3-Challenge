// @TODO: YOUR CODE HERE!
console.log("d3 challenge app.js file is loaded");

// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 150,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
let chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(lifeData) {



  // Cast the hours value to a number for each piece of tvData
  lifeData.forEach(function(d) {
    d.age = +d.age;
    d.income = +d.income;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    d.lacksHealthcare = 100-d.healthcare;
  });

  console.log("lifeData:");
  console.log(lifeData);

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xLinearScale = d3.scaleLinear()
  .domain([0, d3.max(lifeData, d => d.poverty)])
  .range([0, chartWidth]);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(lifeData, d => d.healthcare)])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale)//.ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);


  // append initial circles
  let circlesGroup = chartGroup.selectAll("circle")
  .data(lifeData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 10)
  .attr("fill", "blue")
  .attr("opacity", ".5");


//put the state intials in each circle
let stateInitials = chartGroup.selectAll("labels")
  .data(lifeData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .text(d => d.abbr)
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");






});



  

console.log("let's make it mac tonight");