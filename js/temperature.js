function setupTemperatureScene(minYear, maxYear) {
  d3.csv("data/GlobalTemperatures.csv").then(data => {
    const svg = d3.select("#scene").append("svg")
      .attr("width", 1500)
      .attr("height", 700)
      .append("g")
      .attr("transform", "translate(50, 180)");

    const parseDate = d3.timeParse("%Y-%m-%d");

    data.forEach(d => {
      d.datetime = parseDate(d.dt);
      d.year = d.datetime ? d.datetime.getFullYear() : null;
      d.avg_temp = d.LandAverageTemperature ? +d.LandAverageTemperature : null;
    });

    const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);

    const nestedData = d3.groups(filteredData.filter(d => d.year && d.avg_temp !== null), d => d.year)
    .map(([year, values]) => {
        return {
          year: year,
          avg_temp: d3.mean(values, d => d.avg_temp),
        };
      });

    const x = d3.scaleTime().range([0, 800]);
    const y = d3.scaleLinear().range([400, 0]);

    const valuelineAvg = d3.line()
      .x(d => x(new Date(d.year, 0, 1)))
      .y(d => y(d.avg_temp));


    x.domain(d3.extent(nestedData, d => new Date(d.year, 0, 1)));
    y.domain([
      d3.min(nestedData, d => d.avg_temp)-0.1,
      d3.max(nestedData, d =>d.avg_temp)+0.1
    ]);

    svg.append("path")
      .data([nestedData])
      .attr("class", "line avg-temp")
      .attr("d", valuelineAvg)
      .style("stroke", "orange")
      .style("stroke-width", 2)
      .style("fill", "none");

    svg.append("g")
      .attr("transform", "translate(0,400)")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

      
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
    .text("Temperature (°C)");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "3px");

    const addCircles = (data, tempType, color) => {
      svg.selectAll(`dot.${tempType}`)
        .data(data)
        .enter().append("circle")
        .attr("class", tempType)
        .attr("r", 3)
        .attr("cx", d => x(new Date(d.year, 0, 1)))
        .attr("cy", d => y(d[tempType]))
        .style("fill", color)
        .on("mouseover", (event, d) => {
          tooltip.html(`<b>Year: ${d.year}</b><br>${tempType.replace('_', ' ')}: ${d[tempType]}°C`)
            .style("visibility", "visible");
        })
        .on("mousemove", event => {
          tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    };

    addCircles(nestedData, 'avg_temp', 'orange');

    const dataPoint2013 = nestedData[nestedData.length - 1];
    const dataPoint1976 = nestedData[nestedData.length - (2013-1976+1)]

    const annotations = [
      {
        note: { label: "9.6°C", title: "2013 Temp" },
        x: x(new Date(dataPoint2013.year, 0, 1)), y: y(dataPoint2013.avg_temp),
        dx: 10, dy: 30
      },
      {
        note: { label: "Global average temperatures have never fallen below that of 1976 since then!",},
        x: x(new Date(dataPoint1976.year, 0, 1)), y: y(dataPoint1976.avg_temp),
        dx: 20, dy: 0
      },
    ];

    const makeAnnotations = d3.annotation()
      .annotations(annotations);

    svg.append("g")
      .call(makeAnnotations);

  }).catch(error => {
    console.error('Error loading or processing data:', error);
  });
}
