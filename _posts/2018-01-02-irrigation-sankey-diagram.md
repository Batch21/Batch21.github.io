---
layout: post
title: Visualising an Irrigation System using a Sankey Diagram
permalink: /blog/:title
---
<link rel="stylesheet" type="text/css" href="/assets/css/irrigation-sankey.css">

Sankey diagrams are used to visualise flow through a system. The underlying principle is that the width of the links in a Sankey diagram is directly proportional to the magnitude of the flow. This makes it easy to compare flow along the different pathways of a system.

Sankey diagrams have a long history.  Charles Minard’s <a href="https://en.wikipedia.org/wiki/Charles_Joseph_Minard">diagram of Napoleon’s Russian campaign of 1812</a> is one of the most famous visualisations ever. New tools, such as <a href="https://github.com/d3/d3-sankey">D3’s Sankey module</a>, make the creation of Sankey diagrams easier than ever. They also allow interactivity to be added which makes it possible for users to interact with and explore the diagrams in greater detail. 

Sankey diagram’s focus on flow makes them a good choice for visualising the flows and fluxes of water into and out of irrigation systems. The example below shows the extraction of river water for irrigation in a simple conceptual catchment. Adjusting the sliders for irrigation efficiency and irrigated area illustrate how these variables impact downstream water availability and can lead to deficits for both downstream water users and aquatic ecosystems. 

<div id="slider1" class="slider"></div>
<div id="slider2" class="slider"></div>
<div id="slider3" class="slider"></div>
<div id="sankey"></div>

The diagram highlights the trade-offs involved in allocating water for irrigation. Increasing irrigation efficiency is frequently proposed as a solution to water scarcity, however this can exacerbate the problem if it significantly reduces return flows. Often, improved irrigation efficiency leads to an expansion of the irrigated area, rather than reduced water diversion. See<a href="http://www.saiplatform.org/uploads/Library/IncreasingproductivityinirrigatedagricultureAgronomicconstraintsandhydrologicalrealities.pdf">here</a>

A primary aim was to keep the diagram as simple as possible. Limiting the number of nodes and links mean that it is easier to see the impacts of changing irrigation efficiency or the irrigated area. However, important components of an irrigation system have been omitted or aggregated together. For example, the water use node includes both productive and non-productive water use.  Hence, increasing the complexity of the diagram will probably be necessary if it is to be used to visualise actual irrigation systems. Additional improvements could be the addition of an environmental flow requirement that constrained abstraction from the river and the calculation of crop water productivity (e.g. the yield per unit of water evapotranspired). 

{% include Twitter.html %}
<script type="text/javascript" src="/assets/js/libs/jquery-3.0.0.min.js"></script>
{% include ref_display.html %}


<script src="https://d3js.org/d3.v4.min.js"></script>
<script type="text/javascript" src="/assets/js/libs/d3-sankey.min.js"></script>
<script type="text/javascript" src="/assets/js/irrigation-sankey.js"></script>