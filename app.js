// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 500;

var chartMargin = { top: 20, right: 40, bottom: 60, left: 50 };

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Create SVG wrapper, and append 
var svg = d3
  .select("div")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(myData, error) {
    if (error) return console.warn(error);

    //console.log(myData);

    myData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Scale 
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(myData, d => d.poverty))
      .range([0, chartWidth]);


    var yLinearScale = d3.scaleLinear()
      .domain([
        d3.max(myData, d => d.healthcare),
        d3.min(myData, d => d.healthcare) 
      ])
      .range([0, chartHeight])

    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

    // Initialize tooltip 
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(myData) {
            return `${myData.abbr}<br>Poverty: ${myData.poverty}<br>Healthcare: ${myData.healthcare}%`
        });

    // Create tooltip
    chartGroup.call(toolTip);
    
    // Display and hide the tooltip
    circlesGroup.on("mouseover", function(myData) {
        toolTip.show(myData, this);
    })
    .on("mouseout", function(healthData){
        toolTip.hide(healthData);
    })

    // Axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("In Poverty (%)");

    chartGroup.append("text")
      .attr("class", "axisText")
      .attr("x", 450)
      .attr("y", 460)
      .text("Lacks Healthcare (%)")

    circlesGroup.append("text")
      .attr("class", "circleText")
      .attr("dx", function(d) {
          return xLinearScale(d.poverty);
        })
        .attr("dy", function(d) {
          return yLinearScale(d.healthcare) + 15;
        })
      .text(d => d.abbr)
  });
