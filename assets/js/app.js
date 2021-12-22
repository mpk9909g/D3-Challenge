
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
  left: 70
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
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(lifeData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(lifeData, d => d[chosenXAxis]) * 0.95,  //does the scaling based on the chosen X axis
      d3.max(lifeData, d => d[chosenXAxis]) * 1.05
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(lifeData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(lifeData, d => d[chosenYAxis]) * 1.05])
    .range([chartHeight, 0]);
  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating X circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circle labels with x transition
function renderXCircleLabels(stateInitials, newXScale, chosenXAxis) {

  stateInitials.transition()
    .duration(1200)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return stateInitials;
}

// function used for updating Y circles group with a transition to
// new circles
function renderYCircles(circlesGroup, newYScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circle labels with x transition
function renderYCircleLabels(stateInitials, newYScale, chosenXAxis) {

  stateInitials.transition()
    .duration(1200)
    .attr("y", d => newYScale(d[chosenYAxis]));

  return stateInitials;
}



// function used for updating circles group with new tooltip
//function updateToolTip(chosenXAxis, circlesGroup) {
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  let labelX;

  if (chosenXAxis === "poverty") {
    labelX = "In Poverty (%)";
  }
  else if (chosenXAxis === "income") {
    labelX = "Household Income (Median)"
  }
  else {
    labelX = "Age (Median)";
  }

  let labelY;

  if (chosenYAxis === "healthcare") {
    labelY = "Lacks Healthcare (%)";
  }
  else {
    labelY = "Obese (%)";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      //return (`${d.state}<br>${labelX} ${d[chosenXAxis]}`);
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
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

  });


  // Configure a linear scale for the horizontal and vertical axis
  let xLinearScale = xScale(lifeData, chosenXAxis);
  let yLinearScale = yScale(lifeData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale); 

  // append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(lifeData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 10)
  .attr("fill", "blue")
  .attr("opacity", ".5");

  //put the state intials in each circle
  var stateInitials = chartGroup.selectAll("labels")
    .data(lifeData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr)
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");



  // Create group for x-axis titles
  let labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  let povertyLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

  let ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  let incomeLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");


  // Create group for y-axis titles
  let labelsGroupY = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  let healthcareLabel = labelsGroupY.append("text")
    .attr("x", 0-chartMargin.left*2.5)
    .attr("y", -45)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  let obeseLabel = labelsGroupY.append("text")
    .attr("x", 0-chartMargin.left*2.5)
    .attr("y", -25)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");
  
  

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);



  // X axis labels event listener
  labelsGroupX.selectAll("text")
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
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates circle labels with new x values
        stateInitials = renderXCircleLabels(stateInitials, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);

        }
        else if (chosenXAxis === "income") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    }); //.on(click)

      // Y axis labels event listener
  labelsGroupY.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(lifeData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxis(yLinearScale, yAxis);


      // updates circles with new y values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

      // updates circle labels with new y values
      stateInitials = renderYCircleLabels(stateInitials, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);


      }
      else {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);

      }
    }
  }); //.on(click)


  }).catch(function(error) {
    console.log(error);      
});