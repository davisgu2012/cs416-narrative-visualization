let currentScene = 0;

const minYear = 1880;
const maxYear = 2013;
const scenes = [
  {
    setup: setupTemperatureScene,
    title: "Global Warming",
    description: "Global warming is the long-term increase in Earth's average surface temperature due to human activities. The consequences of global warming include more frequent and severe weather events, rising sea levels, melting glaciers, and disruptions to ecosystems. The following chart highlights the maximum, average, and minimum temperatures for each year since 1880. By observing these changes, we can better understand the historical temperature trends in global temperatures. Hovering over the lines will show the temperature for the given year.",
    source: "https://www.kaggle.com/datasets/berkeleyearth/climate-change-earth-surface-temperature-data/data?select=GlobalTemperatures.csv"
  },
  {
    setup: setupCO2Scene,
    title: "CO2 Emissions",
    description: "Carbon dioxide (CO2) is a major greenhouse gas contributing to global warming. When CO2 is released into the atmosphere through activities like burning fossil fuels, deforestation, and industrial processes, it traps heat from the sun, preventing it from escaping back into space. The following chart displays the CO2 emissions of the top 5 emitting countries from 1880 to the present, with each line representing a different country. Hovering over the X-axis will reveal the top 5 countries that produced the most CO2 emissions for that year.",
    source: "https://github.com/owid/co2-data/tree/master"
  },
  {
    setup: setupSeaLevelScene,
    title: "Sea Level Rising",
    description: "Global warming significantly impacts sea levels, primarily through the melting of glaciers and polar ice caps and the thermal expansion of seawater as it warms. These rising sea levels pose a threat to coastal communities, leading to increased flooding, erosion, and habitat loss for wildlife. The intrusion of saltwater into freshwater systems also affects agriculture and drinking water supplies. The following chart displays the relative sea level since 1880. We can see that it has been steadily increasing inch by inch. Hovering over the line will display the sea level for that given year.",
    source: "https://github.com/datasets/sea-level-rise?tab=readme-ov-file"
  }
];

function updateScene() {
  d3.select("#scene").html("");
  d3.select("#annotations").html("");
  d3.select("#annotations").append("h2").text(scenes[currentScene].title);
  d3.select("#annotations").append("p").text(scenes[currentScene].description);
  d3.select("#annotations").append("a")
    .attr("href", scenes[currentScene].source)
    .attr("target", "_blank")
    .attr("id", "source-link")
    .text("Data Source");
  scenes[currentScene].setup(minYear, maxYear);
  
  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.remove("active");
  });
  
  document.querySelector(`.nav-button[data-index="${currentScene}"]`).classList.add("active");

  document.getElementById("prev").disabled = currentScene === 0;
  document.getElementById("next").disabled = currentScene === scenes.length - 1;
}

document.querySelectorAll(".nav-button").forEach(button => {
  button.addEventListener("click", () => {
    currentScene = +button.dataset.index;
    updateScene();
  });
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentScene > 0) {
    currentScene--;
    updateScene();
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (currentScene < scenes.length - 1) {
    currentScene++;
    updateScene();
  }
});

document.addEventListener("DOMContentLoaded", updateScene);