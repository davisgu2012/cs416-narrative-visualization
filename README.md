# CS415 Narrative Visualization

This narrative visualization seeks to communicate the impact of climate change over time, focusing on three key indicators: global temperatures, CO2 emissions, and sea level rise. Each scene displays historical trends, significant milestones, and an explanation of what the user is viewing. The goal is to inform viewers about the evidence of climate change, its causes, and its effects on the environment.

The narrative visualization follows an interactive slideshow structure. This design choice allows user exploration at each step of the story, making it engaging and informative. The user can navigate through different scenes using the navigation buttons on the bottom of each page, and each scene presents a different aspect of climate change. They can also choose to explore deeper by interacting with the visuals and hovering over different parts of the graphs. 

Each scene follows a consistent visual structure. Namely, each scene contains a title, a description providing context, and the data visualization itself, which changes based on the current scene. in addition to that, we include navigation buttons for moving between scenes and accessing specific scenes directly. As part of visualization of data, we also consistently use the same range of years across all scenes, to ensure the user never has to re-scope their perspectives. 

There are three scenes in the narrative visualization. The first one is Global Temperatures. This scene highlights the long-term increase in Earth's average surface temperature. This aims to provide users with a introduction to global warming, and its most obvious symptom: global temperature. We then move onto the next scene, which provides a possible explanation behind why temperatures are rising: CO2 Emissions. This scene displays the CO2 emissions of the top 5 emitting countries from 1880 onwards.
The users are able to see that emissions have been increasing over the past century. From there, we move onto a effect that global warming has on the environment: Sea Level Rising. This scene presents the changes in sea levels since 1880 and includes a visualization showing a chart with the lower and upper bounds of sea level measurements.

To summarize, the scenes are ordered to first establish the problem (global warming), then illustrate a major cause (CO2 emissions), and finally show one of the major effects (sea level rise).

Annotations are used across all three scenes. For example, they are used to highlight significant data points or trends, and also reinforce the message of each scene and guide the viewer's understanding. For example, in the Global Warming scene, annotations mark the highest recorded temperatures and emphasize long-term trends. In the CO2 Emissions scene, annotations highlight changes in the leading CO2-emitting countries. In the Sea Level Rising scene, annotations point out the rate of sea level rise and its acceleration over time.

The narrative visualization uses various parameters to define states and track the scenes. For example, we use currentScene to keep track of the current scene index. We also define minYear and maxYear, which is used to ensure a consistent range of years displayed in the visualizations.

Various triggers are incorporated to allow user interactions with the visualizations. For example, we include both navigation buttons as well as "previous" and "next" page buttons. These buttons are used to update the scenes, and let the users control their own speed of narration. Furthermore, on each scene, users can interact with the graphs to get more information on whats being communicated. For example, users can hover over the years on the CO2 emissions graph and get the top 5 CO2 emitting countries of the year, alongside the actual amount of CO2 produced by each country. 
