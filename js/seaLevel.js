function setupSeaLevelScene(minYear, maxYear) {
  d3.csv("data/seaLevel.csv").then(data => {
    const svg = d3.select("#scene").append("svg")
    .attr("width", 1500)
    .attr("height", 700)
    .append("g")
    .attr("transform", "translate(50, 180)");

    data.forEach(d => {
      d.year = +d.Year;
      d.sea_level = +d.CSIRO;
      d.lower_bound = +d.CSIRO_lowerbound;
      d.upper_bound = +d.CSIRO_upperbound;
    });

    const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);

    const x = d3.scaleLinear().range([0, 800]);
    const y = d3.scaleLinear().range([400, 0]);

    const valueline = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.sea_level));

    const area = d3.area()
      .x(d => x(d.year))
      .y0(d => y(d.lower_bound))
      .y1(d => y(d.upper_bound));

    x.domain([d3.min(filteredData, d => d.year), d3.max(filteredData, d => d.year)]);
    y.domain([d3.min(filteredData, d => d.lower_bound), d3.max(filteredData, d => d.upper_bound)]);

    svg.append("path")
      .data([filteredData])
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "lightblue");

    svg.append("path")
      .data([filteredData])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke", "steelblue")
      .style("stroke-width", 2)
      .style("fill", "none");

    svg.append("g")
      .attr("transform", "translate(0,400)")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("text")
    .attr("transform", "translate(400, 440)")
    .style("text-anchor", "middle")
    .text("Year");

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -200)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Relative Sea Level (in)");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "3px");

    svg.selectAll("dot")
      .data(filteredData)
      .enter().append("circle")
      .attr("r", 2)
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.sea_level))
      .style("fill", "blue")
      .on("mouseover", (event, d) => {
        tooltip.html(`<b>Year: ${d.year}</b><br>Sea Level: ${d.sea_level} in<br>Lower Bound: ${d.lower_bound} in<br>Upper Bound: ${d.upper_bound} in`)
          .style("visibility", "visible");
      })
      .on("mousemove", event => {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

      const DataPoint1950 = filteredData[filteredData.length - (2013-1950+1)]
      const DataPoint2005 = filteredData[filteredData.length - (2013-2005+1)]


    const annotations = [
      {
        note: { label: "Throughout the past century, the sea level rose at a rate of around 0.7in/yr", title: "1900's" },
        x: x(DataPoint1950.year), y: y(DataPoint1950.sea_level),
        dx: -50, dy: -50
      },
      {
        note: { label: "The rate of sea level rise has begun accelerating", title: "2000's" },
        x: x(DataPoint2005.year), y: y(DataPoint2005.sea_level),
        dx: -20, dy: 100
      }
    ];

    const makeAnnotations = d3.annotation()
      .annotations(annotations);

    svg.append("g")
      .call(makeAnnotations);
  }).catch(error => {
    console.error('Error loading or processing data:', error);
  });
}
