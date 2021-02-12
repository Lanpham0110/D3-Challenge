// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 100,
    bottom: 100,
    left: 90
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

 

// Initial Params for y
var chosenYAxis = "healthcare";
// Initial Params for x
var chosenXAxis = "poverty";

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
  var xlabel;
    if (chosenXAxis === "poverty") {
      var xlabel = "Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        var xlabel = "Age (Median)";
    }
    else {
        var xlabel = "Household Income (Median)";
    }
  
    if (chosenYAxis === "healthcare") {
      var ylabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "obesity") {
      var ylabel = "Obese (%)";
    }
    else {
      var ylabel = "Smokes (%)";
    }
  
  
  //ToolTip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([90, -90])
      .html(function(d) {
        return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
  //Circles Tooltip
    circlesGroup.call(toolTip);
  // Create Event Listeners -Display/Hide the Circles 
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });
  
  // Text Tooltip
    textGroup.call(toolTip);
  // Create Event Listeners -Display/Hide the Text Tooltip
    textGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout Event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });
    return circlesGroup;
  }

  // function used for updating x-scale upon click on axis label
  function xScale(myData, chosenXAxis) {
    // create scales functions for the chart
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[chosenXAxis])*.882,
        d3.max(myData, d => d[chosenXAxis])*1.0816
      ])
      .range([0, width]);
    // console.log(xLinearScale);
    return xLinearScale;
  }

// function used for updating y-scale upon click on axis label
  function yScale(myData, chosenYAxis) {
    // create scales function for the chart
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[chosenYAxis]) *0.8 ,
        d3.max(myData, d => d[chosenYAxis]) *1.2
      ])
      .range([height, 0]);
    return yLinearScale;
  }
  
  // function used for updating circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1200)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }
  
  // Function used for updating Text Group with a transition to new text
  function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    textGroup.transition()
      .duration(1200)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("axis-text", true);
    return textGroup;
  }
  
  // function used for updating xAxis upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1200)
      .call(bottomAxis);
    return xAxis;
  }
  
  // function used for updating yAxis upon click on axis label
  function renderyAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1200)
      .call(leftAxis);
    return yAxis;
  }
  
  
    // Load data from csv
d3.csv("assets/data/data.csv").then(function(myData,err) {
    myData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
   
// console.log(data.healthcare);
    });

        
    // xLinearScale function above csv import
    var xLinearScale = xScale(myData, chosenXAxis);
    // yLinearScale function above csv import
    var yLinearScale = yScale(myData, chosenYAxis);
   
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis to chartGroup
    var xAxis = chartGroup.append("g")
      // .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis to chartGroup
    var yAxis = chartGroup.append("g")
      // .classed("y-axis", true)
      // .attr("transform", `translate(0, ${height})`)
      .call(leftAxis);
    
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("g circles")
      .data(myData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 12)
      .attr("stroke-width", "1")
      .attr("fill", "lightblue")
      .attr("opacity", ".75");
  
    // Append Text/state name to Circles
    var textGroup = chartGroup.selectAll("g circles")
      .data(myData)
      .enter()
      .append("text")
      .attr("transform", `translate(0,5)`)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d => (d.abbr))
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");
      // .classed("axis-text",true)
  
   
  
    // Create group for xlabels  
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width/2 }, ${height+30 })`);
  
    var incomelabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median) ");

    var povertylabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var agelabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median) ");
  
    
    // Create group for ylabels
    var ylabelsGroup = chartGroup.append("g")
    .attr("transform","rotate(-90)");
  
    var obeselabel = ylabelsGroup.append("text")
      .attr("y", 0-margin.left +15)
      .attr("x", 0-(height/2))
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");
  
    var smokeslabel = ylabelsGroup.append("text")
      .attr("x", 0-(height/2))
      .attr("y", 0-margin.left +35)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");
  
    var healthcarelabel = ylabelsGroup.append("text")
      .attr("x", 0-(height/2))
      .attr("y", 0-margin.left +55)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
    var textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
          // updates x scale for new data
          xLinearScale = xScale(myData, chosenXAxis);
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
          // Updates Text with New Values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            incomelabel
            .classed("active", false)
            .classed("inactive", true);
            agelabel
              .classed("active", false)
              .classed("inactive", true);
            povertylabel
              .classed("active", true)
              .classed("inactive", false);
          }

          else if (chosenXAxis === "age") {
            agelabel
              .classed("active", true)
              .classed("inactive", false);
            incomelabel
              .classed("active", false)
              .classed("inactive", true);
            povertylabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertylabel
              .classed("active", false)
              .classed("inactive", true);
            incomelabel
              .classed("active", true)
              .classed("inactive", false);
            agelabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });
  
    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var valueY = d3.select(this).attr("value");
        if (valueY !== chosenYAxis) {
  
          // replaces chosenXAxis with value
          chosenYAxis = valueY;
          // updates y scale for new data
          yLinearScale = yScale(myData, chosenYAxis);
          // updates y axis with transition
          yAxis = renderyAxes(yLinearScale, yAxis);
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
           // Updates Text with New Values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
  
          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            healthcarelabel
              .classed("active", true)
              .classed("inactive", false);
            smokeslabel
              .classed("active", false)
              .classed("inactive", true);
            obeselabel
              .classed("active", false)
              .classed("inactive", true);
          }

          else if (chosenYAxis === "smokes") {
            smokeslabel
              .classed("active", true)
              .classed("inactive", false);
            obeselabel
              .classed("active", false)
              .classed("inactive", true);
            healthcarelabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            healthcarelabel
              .classed("active", false)
              .classed("inactive", true);
            smokeslabel
              .classed("active", false)
              .classed("inactive", true);
            obeselabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
}).catch(function(error) {
    console.log(error);

});