// @TODO: YOUR CODE HERE!
console.log("d3 challenge app.js file is loaded");

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 150,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// // Append an SVG group and 'translate' it 
let chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(lifeData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(lifeData, d => d[chosenXAxis]) * 0.95,  //does the scaling based on the chosen X axis
    //.domain([0,  //does the scaling based on the chosen X axis
      d3.max(lifeData, d => d[chosenXAxis]) * 1.05
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circle labels with x transition
function renderCircleLabels(stateInitials, newXScale, chosenXAxis) {

  stateInitials.transition()
    .duration(1200)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return stateInitials;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  let label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty (%)";
  }
  else if (chosenXAxis === "income") {
    label = "Household Income Median"
  }
  else {
    label = "Age (Median)";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Import Data
d3.csv("./assets/data/data.csv").then(function(lifeData, err) {
  if (err) throw err;

  // Cast the hours value to a number for each piece of tvData
  lifeData.forEach(function(d) {
    d.age = +d.age;
    d.income = +d.income;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    //d.lacksHealthcare = 100-d.healthcare;
  });

 // console.log("lifeData:");
 // console.log(lifeData);

  // Configure a linear scale for the horizontal axis
  let xLinearScale = xScale(lifeData, chosenXAxis);

  // Create a linear scale for the vertical axis.
  let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(lifeData, d => d.healthcare)+2])
    .range([chartHeight, 0]);

  // Create initial axis functions
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale); 

  // append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(lifeData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 10)
  .attr("fill", "blue")
  .attr("opacity", ".5");

  //put the state intials in each circle
  var stateInitials = chartGroup.selectAll("labels")
    .data(lifeData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");



  // Create group for two x-axis labels
  let labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  let povertyLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

  let ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  // append y axis title
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - chartMargin.left)
  .attr("x", 0 - (chartHeight / 1.5))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(lifeData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates circle labels with new x values
        stateInitials = renderCircleLabels(stateInitials, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);  






    
});



  

console.log("let's make it mac tonight");