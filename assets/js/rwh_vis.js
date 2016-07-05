var startYearRWH = 2012,
	rwhData;

var sliderRWH = d3.slider().axis(true).min(1999).max(startYearRWH).value(startYearRWH).step(1);
d3.select('#slider-rwh').call(sliderRWH);


var svg_map_rwh = d3.select("#rwh-viz-map").append("svg")
	.attr("width", w + margin_map.left + margin_map.right)
	.attr("height", h + margin_map.top + margin_map.bottom)
		.append("g")
	.attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

svg_map_rwh.append("rect")
	.attr("class", "mapBorder")
	.attr("x", 0)
	.attr("y", 0)
	.attr("height", h)
	.attr("width", w)

svg_map_rwh.append("svg:image")
		.attr("xlink:href", "/assets/data/background.jpg")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 560)
		.attr("height", 730);

var legendRWH = d3.select("#legendRWH").append("svg")
	   .attr("id", "legendSVG")
	   .attr("width", 195)
	   .attr("height", 200)
       .append("g")
       .attr("id", "legendBoxRWH")

dem_legendRWH = legendRWH.append("g")
	   				.attr("width", 170)
	   				.attr("height", 15)
	   				.attr("transform", "translate(" + 15 + "," + 45 + ")");       

var gradientDEM_RWH = dem_legendRWH.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

for (var i = 0; i < dem_colors.length; i++) {
	gradientDEM_RWH.append("stop")
    .attr("offset", dem_breaks[i])
    .attr("stop-color", dem_colors[i])
    .attr("stop-opacity", 0.6)
}

var gradientBarRWH = dem_legendRWH.append("rect")
				        .attr("y", 0)
				        .attr("width", 170)
				        .attr("height", 15)
				        .attr("fill","url(#gradient)")
				        .style("stroke", "black")
				        .style("stroke-width", 1);

dem_legendRWH.append("g").attr("class", "x axis demAxis")
				.call(dem_Axis).append("text")
				.attr("x", 0)
				.attr("y", -25)
				.text("Elevation (metres)")
				.style("font-size", "12px");;

var boundaryLegendRWH = legendRWH.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 80 + ")")

boundaryLegendRWH.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 0)
	.style("stroke", "black")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

boundaryLegendRWH.append("text")
	.attr("x", 32)
	.attr("y", 5)
	.text("Revenue village boundary")
	.style("font-size", "12px");
