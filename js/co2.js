function setupCO2Scene(minYear, maxYear) {
  d3.csv("data/co2-data.csv").then(data => {
    const svg = d3.select("#scene").append("svg")
    .attr("width", 1500)
    .attr("height", 700)
    .append("g")
    .attr("transform", "translate(50, 180)");

    data = data.filter(d => d.iso_code && d.co2 !== null);
    data.forEach(d => {
      d.year = +d.year;
      d.co2 = +d.co2;
    });

    const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);

    const nestedData = d3.groups(filteredData, d => d.year).map(([year, values]) => {
      return {
        year: year,
        countries: values.sort((a, b) => b.co2 - a.co2).slice(0, 5)
      };
    });

    nestedData.sort((a, b) => a.year - b.year);

    const countryData = {};
    nestedData.forEach(yearData => {
      yearData.countries.forEach(d => {
        if (!countryData[d.iso_code]) {
          countryData[d.iso_code] = [];
        }
        countryData[d.iso_code].push({ year: yearData.year, co2: d.co2 });
      });
    });    

    const countries = Object.keys(countryData);

    const x = d3.scaleLinear().range([0, 800]);
    const y = d3.scaleLinear().range([400, 0]);

    x.domain(d3.extent(filteredData, d => d.year));
    y.domain([0, d3.max(filteredData, d => d.co2)]);

    const line = d3.line()
      .defined(d => d.co2 !== null) 
      .x(d => x(d.year))
      .y(d => y(d.co2));

      const color = d3.scaleSequential(d3.interpolateTurbo);

    countries.forEach(country => {
      svg.append("path")
        .datum(countryData[country])
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", color((countries.indexOf(country)%12)/12))
        .style("stroke-width", 2)
        .style("fill", "none");
    });

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
    .attr("y", -50)
    .attr("x", -200)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("CO2 Emissions (Million Tonnes)");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "3px");

    svg.selectAll("dot")
      .data(nestedData)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", d => x(d.year))
      .attr("cy", d => 400 )
      .style("fill", "gray")
      .on("mouseover", (event, d) => {
        const tooltipContent = `<b>Year: ${d.year}</b><br>${d.countries.map(c => `${c.country}: ${c.co2} MtCO2`).join('<br>')}`;
        tooltip.html(tooltipContent)
          .style("visibility", "visible");
      })
      .on("mousemove", event => {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });


    // Add legend
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(0,470)"); // Position legend below the chart

  countries.forEach((country, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(${i * 75}, 0)`); // Adjust horizontal spacing as needed

    legendRow.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color((countries.indexOf(country)%12)/12));

    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("text-transform", "capitalize")
      .text(country);
  });

      const DataPoint2006 = nestedData[nestedData.length - (2013-2006+1)]
      const DataPoint1950 =  nestedData[nestedData.length - (2013-1950+1)]

    const annotations = [
      {
        note: { label: "2006 was the first year since 1890 where USA wasn't producing the most CO2!"},
        connector: { end: "dot" },
        x: x(DataPoint2006.year), y: y(DataPoint2006.countries[0].co2),
        dx: -50, dy: -30
      },
      {
        note: { label: "The third industrial revolution begins", title: "1950's"},
        connector: { end: "dot" },
        x: x(DataPoint1950.year), y: y(DataPoint1950.countries[0].co2),
        dx: -50, dy: -30
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
