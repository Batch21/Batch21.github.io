var startYear = 1980,
	step = startYear,
	sliderStatus = "paused",
	scrollTrig = true,
	yearDuration = 1000,
	buttonText = "Well Depth",
	interval, 
	wellData,
	wellCircles,
	lineData;

// define slider
var slider = d3.slider().axis(true).min(startYear).max(2013).value(startYear).step(1);
d3.select('#slider').call(slider);

// Define Widths and heights and margins
var margin_map = {top: 5, right: 10, bottom: 5, left: 10},
	margin_bar = {top: 8, right: 0, bottom: 28, left: 40},
	margin_chart = {top: 15, right: 0, bottom: 18, left: 40},
	margin_line = {top: 15, right: 0, bottom: 18, left: 65};
var w = 580 - margin_map.left - margin_map.right,
	w2 = 300 - margin_bar.left - margin_bar.right,
	w3 = 300 - margin_line.left - margin_line.right,
    h = 740 - margin_map.top - margin_map.bottom,
    h2 = 157 - margin_bar.top - margin_bar.bottom,
    h3 = 150 - margin_chart.top - margin_chart.bottom,
    h4 = 250 - margin_chart.top - margin_chart.bottom;


// Define map projection
var projection = d3.geo.transverseMercator()
      				   .rotate([-77.81258, -15.393, 0])
      				   .translate([w/2, h/2])
      				   .scale(420000);


// Define path generator
var path = d3.geo.path()
				 .projection(projection);


// Define scales for well map
var colorDepth = d3.scale.threshold()
					.domain([10, 50, 100, 300])
					.range(["#c4d4e1", "#6baed6","#2171b5", "#08306b"]);

var colorType = d3.scale.ordinal()
						.domain(["Open Well", "Agricultural Borewell", "Domestic Borewell"])
						.range(["#C4ED68", "#59A80F", "#ba831f"]);

var colorStatus = d3.scale.ordinal()
						  .domain(["Defunct", "Fails every summer", "Fails during droughts", "Has never failed"])
						  .range(["#784860", "#C07860", "#F8CA8C", "#FFF4C2"]);

var landuseScale = d3.scale.ordinal()
							.domain(["Single Crop", "Double Crop", "Plantation", "Fallow", "Scrub",  "Rocky Ground", "Settlements"])
							.range(["#9bca6c", "#5fb933", "#b68f30", "#ffff8c", "#f8d496", "#828482", "#bb312f"])

var dem_colors = ["#227516", "#648744", "#9bc133", "#cdcb32", "#fed976", "#ffeda0", "#ffffcc", "#d7cebf", "#b6b098", "#986b41", "#561f10"]
var dem_breaks = ["0%", "5%", "9%", "15%", "24%", "33%", "43%", "52%", "64%", "76%", "100%"]
var dem_scale = d3.scale.linear().domain([390, 620]).range([0, 170]);

var svg_map = d3.select("#well-viz-map").append("svg")
	.attr("width", w + margin_map.left + margin_map.right)
	.attr("height", h + margin_map.top + margin_map.bottom)
		.append("g")
	.attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

svg_map.append("rect")
	.attr("class", "mapBorder")
	.attr("x", 0)
	.attr("y", 0)
	.attr("height", h)
	.attr("width", w)

svg_map.append("svg:image")
		.attr("xlink:href", "/assets/data/background.jpg")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 560)
		.attr("height", 730);

// Create legend and add static features
var legend = d3.select("#legend").append("svg")
	   .attr("id", "legendSVG")
	   .attr("width", 198)
	   .attr("height", 200)
       .append("g")
       .attr("id", "legendBox")


dem_legend = legend.append("g")
	   				.attr("width", 170)
	   				.attr("height", 15)
	   				.attr("transform", "translate(" + 15 + "," + 45 + ")");       

var gradientDEM = dem_legend.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

for (var i = 0; i < dem_colors.length; i++) {
	gradientDEM.append("stop")
    .attr("offset", dem_breaks[i])
    .attr("stop-color", dem_colors[i])
    .attr("stop-opacity", 0.6)
}

var gradientBar = dem_legend.append("rect")
				        .attr("y", 0)
				        .attr("width", 170)
				        .attr("height", 15)
				        .attr("fill","url(#gradient)")
				        .style("stroke", "black")
				        .style("stroke-width", 1);

var dem_Axis = d3.svg.axis().scale(dem_scale).orient("top").tickValues([390, 500, 620]);

dem_legend.append("g").attr("class", "x axis demAxis")
				.call(dem_Axis).append("text")
				.attr("x", 0)
				.attr("y", -25)
				.text("Elevation (metres)")
				.style("font-size", "12px");;


var boundaryLegend = legend.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 80 + ")")

boundaryLegend.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 0)
	.style("stroke", "black")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

boundaryLegend.append("text")
	.attr("x", 32)
	.attr("y", 5)
	.text("Revenue village boundary")
	.style("font-size", "12px");

var drainageLegend = legend.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 100 + ")")

drainageLegend.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 0)
	.style("stroke", "#1f78b4")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

drainageLegend.append("text")
	.attr("x", 32)
	.attr("y", 5)
	.text("Drainage")
	.style("font-size", "12px");

var legendLanduse = d3.select(".legendLanduse").attr("id", "landuse1")
		.append("svg")
	   .attr("class", "legendLanduseSVG")
	   .attr("width", 198)
	   .attr("height", 25)
       
legendLanduse.append("text")
       .text("Show Landuse")
       .attr("x", 35)
       .attr("y", 18)
       .style("font-weight", "bold")
       .style("text-decoration", "underline");

function legendLanduseUpdate(){

	d3.select("#landuseCheckBox")
	  .on("click", function(){
	  	if(document.getElementById("landuseCheck").checked){
			
			legendLanduse.attr("height", 200);
			d3.selectAll(".landuse").style("opacity", 1);
			d3.selectAll(".village-boundaries").style("opacity", 0);

			var landuses = legendLanduse.append("g")
						.attr("class", "landuseBox")
						.attr("transform",  "translate(" + 15 + "," + 35 + ")")
						.selectAll("g")
						.data(landuseScale.domain())
						.enter()
						.append("g")
						.attr("transform", function(d, i) {
				  			var height = 25;
				  			var horz = 0;
				  			var vert = i * height;
				  			return "translate(" + horz + "," + vert + ")";
						});

			landuses.append("rect")
					.attr("width", 15)
					.attr("height", 10)
					.style("fill", landuseScale)
					.style("stroke", "black")
					.style("stroke-width", 0.4);

			landuses.append("text")
					.attr("x", 30)
					.attr("y", 10)
					.text(function(d){
						return d;
					});
		}else if(document.getElementById("landuseCheck").checked == false){
			d3.select(".landuseBox").remove();
			d3.selectAll(".landuse").style("opacity", 0)
			d3.selectAll(".village-boundaries").style("opacity", 0.5);
			legendLanduse.attr("height", 25)
		} 				
	});
}


function drawFeatures() {

	d3.json("/assets/data/dhone_landuse.json", function(landuse) {
		
		svg_map.selectAll("path.features")
	   		.data(landuse.features)
	   		.enter()
	   		.append("path")
	   		.attr("d", path)
	   		.attr("class", "landuse")
	   		.style("fill", function(d){
	   			return landuseScale(d.properties.descript)
	   		})
	   		.style("opacity", 0)
	   		.style("stroke", "red")
	   		.style("stroke-width", 0)

	   	d3.json("/assets/data/village_areas.json", function(villages) {

			svg_map.selectAll("path.features")
		   		.data(villages.features)
		   		.enter()
		   		.append("path")
		   		.attr("d", path)
		   		.attr("class", "village-boundaries")
		   		.style("fill", "#DF837D")
		   		.style("opacity", 0.5)
		   		.style("stroke", "red")
		   		.style("stroke-width", 1.1)
		   		.on("mouseover", function(d){
					d3.select(this)
					  .transition()
					  .duration(300)
					  .style("opacity", 1)
					  .style("stroke-width", 2)

					svg_map.append("text")	
					   .attr("id", "village_name")
					   .attr("x", parseFloat(projection([d.properties.lon_centre, d.properties.lat_centre])[0]) + 12)
					   .attr("y", parseFloat(projection([d.properties.lon_centre, d.properties.lat_centre])[1]) - 12)
					   .attr("text-anchor", "left")
					   .attr("font-family", "sans-serif")
					   .attr("font-size", "14px")
					   .attr("font-weight", "bold")
					   .attr("fill", "black")
					   .text(d.properties.name);	
			    })
			    .on("mouseout", function(d){
					d3.select(this)
					  .transition()
					  .duration(100)
					  .style("opacity", 0.5)
					  .style("stroke-width", 1.1);
					d3.select("#village_name").remove();
			    });

			var villageLegend = legend.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 116 + ")")

			villageLegend.append("rect")
			  	 .attr("width", 15)
			  	 .attr("height", 10)
			  	 .style("stroke", "red")
			  	 .style("fill", "#DF837D")
			  	 .style("opacity", 0.5)
			  	 .style("shape-rendering", "auto");

			villageLegend.append("text")
			  	 .attr("x", 32)
			  	 .attr("y", 10)
			  	 .text("Village areas")
			  	 .style("font-size", "12px");		

		
			drawWells();
		});
		legendLanduseUpdate();
	});
}
	
function drawWells(){	   

	d3.csv("/assets/data/dhone_wells.csv", function(data) {
		
		wellData = data;
		wellCircles = svg_map.selectAll("circle")
	   					    .data(data)
	   					    .enter()
	   					    .append("circle")
	   					    .attr("cx", function(d){
	   							return projection([d.lon, d.lat])[0];
	   						})
	   					    .attr("cy", function(d){
	   							return projection([d.lon, d.lat])[1];
	   						}) 
	   					    .attr("r", function(d){
	   							if(d.year <= startYear){
	   								return 3;
	   							} else{
	   								return 0;
	   							}
	   						})
						    .attr("class", "well")
						    .attr("display", "yes")
							.style("fill", function(d){
								if (d.depth){
			   						return colorDepth(d.depth);
								}else{
			   						return "#ccc";
								}
							})
							.style("opacity", 0.85)
							.on("mouseover", function(d){
								d3.select(this)
								  .attr("r", 8)
								
								svg_map.append("text")	
									   .attr("id", "tooltip")
		   							   .attr("x", parseFloat(projection([d.lon, d.lat])[0]) - 60)
		   							   .attr("y", parseFloat(projection([d.lon, d.lat])[1]) - 10)
		   							   .attr("text-anchor", "left")
		  							   .attr("font-family", "sans-serif")
		  							   .attr("font-size", "14px")
		   							   .attr("font-weight", "bold")
		  							   .attr("fill", "black")
		   							   .text("Depth: " + d.depth + " metres");	
							})
							.on("mouseout", function(){
								d3.select(this).attr("r", 3)
								d3.select('#tooltip').remove();
							});



		createCharts();
		sliderActivate();

		d3.select(".glyphicon").attr("title", "Play Animation");
		d3.select(".playPause button").on("click", function(){
			if(sliderStatus === "finished"){
				step = startYear - 1;
				d3.select(".playPause span").classed("glyphicon", false)
								  			.attr("class", "glyphicon glyphicon-pause");
				sliderStatus = "playing";
				d3.select(".glyphicon").attr("title", "Pause Animation");
				scrollTrig = false;
				animate(wellCircles, data);
			}else if (sliderStatus === "paused"){
				d3.select(".playPause span").classed("glyphicon", false)
								  			.attr("class", "glyphicon glyphicon-pause");
				sliderStatus = "playing";
				d3.select(".glyphicon").attr("title", "Pause Animation");
				scrollTrig = false;
				animate(wellCircles, data);
			} else{
				clearInterval(interval);
				d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-play");
				sliderStatus = "paused";
				d3.select(".glyphicon").attr("title", "Play Animation");
				svg_map.selectAll(".well")
						.transition()
						.duration(yearDuration)
						.attr("r", function(d){
	   							if(d.year <= step){
	   								return 3;
	   							} else{
	   								return 0;
	   							}
	   						})
				
			}		
		});
		window.onscroll = function(){scrollAnimate(wellCircles, wellData)};
	});

}	
	
function updateLegend(buttonScale){
		
	legend.select("#legendGroup").remove();
	legend.select("#wellTitle").remove();

	legend.append("text")
		 .attr("x", 48)
		 .attr("y", 152)
		 .text(buttonText)
		 .attr("id", "wellTitle")
		 .style("font-size", "12px")
		 .style("font-weight", "bold")
		 .style("text-decoration", "underline");			
	
	wellLegend = legend.append("g")
		.attr("id", "legendGroup")
			.attr("transform", "translate(" + 22 + "," + 167 + ")")
			.selectAll("g")
			.data(buttonScale.domain())
			.enter()
			.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
  			var height = 25;
  			var horz = 0;
  			var vert = i * height;
  			return "translate(" + horz + "," + vert + ")";
			});

	wellLegend.append("circle")
			.attr("r", 7)
			.style("fill", buttonScale)
			.style("stroke", "black")
			.style("stroke-width", 0.4);

		wellLegend.append("text")
			.attr("x", 25)
			.attr("y", 6)
			.text(function(d) { 
				if(buttonScale === colorDepth){
					if(d === 10){
						return "0 - 10 metres";
					} else if (d === 50){
						return "10 - 50 metres";
					}else if (d === 100){
						return "50 - 100 metres";
					}else if (d === 300){
						return "100 + metres";
					}
				} else{
					return d
				}
			})
			.style("font-size", "12px");

	height = document.getElementById("legendBox").getBBox().height;	
	d3.select("#legendSVG").attr("height", height + 15);
	}


function createButtons(){

d3.select("#wellDepthButton").style("background-color", "#FAE9BD")
						   	 .style("border-width", "1px");

d3.selectAll(".buttonWells")
	.on("mouseover", function(){
		d3.select(this).style("opacity", 1)
					   .style("border-width", "2px")
					   .style("margin", "0px");
	})
	.on("mouseout", function(){
		d3.select(this).style("opacity", 0.95)
					   .style("border-width", "1px")
					   .style("margin", "1px");
	})
	.on("click", function(){
		buttonText = this.textContent;

		d3.selectAll(".buttonWells").style("background-color", "#DDDDDD")
					           .style("border-width", "1px");						   
		d3.select(this).style("background-color", "#FAE9BD")
					   .style("border-width", "2px");
						   
			// Update well color scheme
		svg_map.selectAll(".well")
			.style("fill", function(d){
				if (buttonText === "Well Type"){
					if (d.type){
			   			return colorType(d.type);
					}
					else{
						return "#ccc";
					}
				}else if(buttonText === "Well Depth"){
					if (d.depth){
			   			return colorDepth(d.depth);
					}
					else{
						return "#ccc";
					}
				}else if(buttonText == "Well Status (2012)"){
					if(d.status){
						return colorStatus(d.status);
					}else{
						return "#ccc";
					}
				}else{
					return "#ccc"
				}
				})

			// Update legend
		if(buttonText === "Well Depth"){
			updateLegend(colorDepth);
			d3.select(".legendLanduse").attr("id", "landuse1");
		}else if(buttonText === "Well Type"){
			updateLegend(colorType);
			d3.select(".legendLanduse").attr("id", "landuse2");
		}else if(buttonText === "Well Status (2012)"){
			updateLegend(colorStatus);
			d3.select(".legendLanduse").attr("id", "landuse1");
		}
	})
}

// Create chart SVGs
var svg_type = d3.select("#well-viz-chart2").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h2 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var svg_depth = d3.select("#well-viz-chart1").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h2 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var svg_status = d3.select("#well-viz-chart3").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h2 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var svg_line = d3.select("#well-viz-chart4").append("svg")
			.attr("width", w2 + margin_chart.left + margin_chart.right)
			.attr("height", h3 + margin_chart.top + margin_chart.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

var svg_avDep = d3.select("#well-viz-chart5").append("svg")
			.attr("width", w2 + margin_chart.left + margin_bar.right)
			.attr("height", h3 + margin_chart.top + margin_chart.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

// Create chart scales
var xType = d3.scale.ordinal()
				.rangeRoundBands([0, w2], 0.05);
var yType = d3.scale.linear()
				.range([h2, 0]);

var xDepth = d3.scale.ordinal()
				.rangeRoundBands([0, w2], 0.05);
var yDepth = d3.scale.linear()
			     .range([h2, 0]);

var xStatus = d3.scale.ordinal()
				  .rangeRoundBands([0, w2], 0.05);
var yStatus = d3.scale.linear()
				  .range([h2, 0])

var xline = d3.scale.linear()
				  .range([0, w2])
				  .domain([1970, 2013]);
var yline = d3.scale.linear()
				  .range([h3, 0])
				  .domain([0, 600]);

var xAvDep = d3.scale.linear()
				  .range([0, w2])
				  .domain([1970, 2013]);
var yAvDep= d3.scale.linear()
				  .range([h3, 0])
				  .domain([0, 50]);

function createCharts(){		

	// Group data and define scale domains for type bar chart using complete dataset
	var wellTypes = countWells("type", 2012);
	xType.domain(d3.range(wellTypes.length))
	yType.domain([0, 280])

	// Add axes for type bar chart
	svg_type.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yType)
		.orient("left")
		.tickValues([40, 80, 120, 160, 200, 240, 280]));

	svg_type.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xType)
		.orient("bottom")
		.tickFormat(function(d){return wellTypes[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xType.rangeBand());

	svg_type.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 10)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "12px")
		.style("font-weight", "bold")
		.style("letter-spacing", "1.8px")
		.text("Number of Wells");

	// Regroup data	for start year
    wellTypes = countWells("type", startYear);

    // Add bars for type chart
	var typeChart = svg_type.selectAll("rect")
   		.data(wellTypes)		
   		.enter()
   		.append("rect")
   		.attr("selected", "no")
   		.attr("class", "bar")
   		.attr("x", function(d, i) {
   			return xType(i);
   		})
   		.attr("y", function(d) {
   			return yType(d.values);
   		})
   		.attr("width", xType.rangeBand())
   		.attr("height", function(d) {
   			return h2 - yType(d.values);
   		})
   		.style("fill", function(d){
   			if(d.key == "Open Well"){
   				return "#C4ED68"
   			}else if(d.key == "Agricultural Borewell"){
   				return "#59A80F"
   			}else if(d.key == "Domestic Borewell"){
   				return "#ba831f"
   			}
   		})
   		.style("stroke", "red")
   		.style("stroke-width", 0)
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){

				if(sliderStatus != "playing"){
					d3.select(this)
					.style("opacity", 1);

					svg_map.selectAll(".well")
					.attr("r", function(j){
		   				if (j.year <= slider.value() & this.getAttribute("display") == "yes"){
		   					if(d.key === j.type){
		   						return 3.5;
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
		   			});

		   			svg_type.append("text")	
						   .attr("id", "typetip")
						   .attr("x", parseInt(this.getAttribute("x")) + 38)
						   .attr("y", parseInt(this.getAttribute("y")) - 2)
						   .attr("text-anchor", "middle")
						   .attr("font-family", "sans-serif")
						   .attr("font-size", "14px")
						   .attr("font-weight", "bold")
						   .attr("fill", "black")
						   .text(Math.round(yType.invert(this.getAttribute("y"))));
		   		}
		})
		.on("click", function(d){
			if(sliderStatus != "playing"){
				if(this.getAttribute("selected") == "no"){

					d3.selectAll("#well-viz-charts .bar").attr("selected", "no")
							.style("stroke-width", 0)

					d3.select(this).attr("selected", "yes")
						.style("stroke-width", 2.5)

					svg_map.selectAll(".well")
						.attr("r", function(j){
			   				if (j.year <= slider.value()){
			   					if(d.key === j.type){
			   						return 3.5;
			   					}else{
			   						return 0;
			   					}
			   				}else{
			   					return 0;
			   				}
			   			})
			   			.attr("display", function(j){
			   				if(d.key === j.type){
			   					return "yes";
			   				}else{
			   					return "no";
			   				}
			   			});
		   		} else{
					if(sliderStatus != "playing"){
						d3.selectAll("#well-viz-charts .bar").attr("selected", "no")
							.style("stroke-width", 0)

						svg_map.selectAll(".well")
							.attr("display", "yes")
							.attr("r", function(j){
								if(this.getAttribute("display") === "yes" & j.year <= slider.value()){
					   					return 3;
   					   			}else{
					   				return 0
					   			}
		   					});
					}
				}			
			}
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("opacity", 0.7);

				svg_map.selectAll(".well")
					.attr("r", function(j){
						if(this.getAttribute("display") === "yes"){
			   				if(j.year <= slider.value()){
			   					return 3;
			   				}else{
			   					return 0;
			   				}
			   			}else{
			   				return 0
			   			}
		   			});

	   			d3.select("#typetip").remove();
		});

   	// Group data and define scale domains for depth bar chart using complete dataset
   	var wellDepths = countWells("depth_bin", 2012);
	xDepth.domain(d3.range(wellDepths.length))
	yDepth.domain([0, 280])
	
	// Add axes for depth bar chart
	svg_depth.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yDepth)
		.orient("left")
		.tickValues([40, 80, 120, 160, 200, 240, 280]));

	svg_depth.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xDepth)
		.orient("bottom")
		.tickFormat(function(d){return wellDepths[d].key;}));

	svg_depth.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 10)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "12px")
		.style("font-weight", "bold")
		.style("letter-spacing", "1.8px")
		.text("Number of Wells");

	// Regroup data	for start year	
	wellDepths = countWells("depth_bin", startYear);
	
	// Add bars for depth chart
	var chart2 = svg_depth.selectAll("rect")
   		.data(wellDepths)		
   		.enter()
   		.append("rect")
   		.attr("class", "bar")
   		.attr("selected", "no")
   		.attr("x", function(d, i) {
   			return xDepth(i);
   		})
   		.attr("y", function(d) {
   			return yDepth(d.values);
   		})
   		.attr("width", xDepth.rangeBand())
   		.attr("height", function(d) {
   			return h2 - yDepth(d.values);
   		})
   		.style("fill", function(d){
   			if(d.key === "0 - 10 m"){
   				return "#c4d4e1";
   			} else if (d.key === "10 - 50 m"){
   				return "#6baed6";
   			} else if (d.key === "50 - 100 m"){
   				return "#2171b5";
   			} else if(d.key === "100 m +"){
   				return "#08306b";
   			}
   		})
   		.style("stroke", "red")
   		.style("stroke-width", 0)
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
				if(sliderStatus != "playing"){
					d3.select(this)
					.style("opacity", 1);

					svg_map.selectAll(".well")
					.attr("r", function(j){
		   				if (j.year <= slider.value() & this.getAttribute("display") === "yes"){
		   					if(d.key === j.depth_bin){
		   						return 3.5;
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
		   			});

	   			svg_depth.append("text")	
					   .attr("id", "depthtip")
					   .attr("x", parseInt(this.getAttribute("x")) + 27.5)
					   .attr("y", parseInt(this.getAttribute("y")) - 2)
					   .attr("text-anchor", "middle")
					   .attr("font-family", "sans-serif")
					   .attr("font-size", "14px")
					   .attr("font-weight", "bold")
					   .attr("fill", "black")
					   .text(Math.round(yType.invert(this.getAttribute("y"))));
		   		}
		})
		.on("click", function(d){
			if(sliderStatus != "playing"){
				if(this.getAttribute("selected") === "no"){

					d3.selectAll("#well-viz-charts .bar").attr("selected", "no")
							.style("stroke-width", 0)

					d3.select(this).attr("selected", "yes")
						.style("stroke-width", 2.5)

					svg_map.selectAll(".well")
						.attr("r", function(j){
			   				if (j.year <= slider.value()){
			   					if(d.key === j.depth_bin){
			   						return 3.5;
			   					}else{
			   						return 0;
			   					}
			   				}else{
			   					return 0;
			   				}
			   			})
			   			.attr("display", function(j){
			   				if(d.key === j.depth_bin){
			   					return "yes";
			   				}else{
			   					return "no";
			   				}
			   			});
		   		}else{
					d3.selectAll("#well-viz-charts .bar").attr("selected", "no")
						.style("stroke-width", 0)

					svg_map.selectAll(".well")
						.attr("display", "yes")
						.attr("r", function(j){
							if(this.getAttribute("display") === "yes"){
				   				if(j.year <= slider.value()){
				   					return 3;
				   				}else{
				   					return 0;
				   				}
				   			}else{
				   				return 0
				   			}
	   					});
				}
		
		}
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("opacity", 0.7);

	   			svg_map.selectAll(".well")
					.attr("r", function(j){
						if(this.getAttribute("display") === "yes"){
			   				if(j.year <= slider.value()){
			   					return 3;
			   				}else{
			   					return 0;
			   				}
			   			}else{
			   				return 0
			   			}
		   			});

	   			d3.select("#depthtip").remove()
		});

	// Group data and define scale domains for status bar chart using complete dataset
	var wellStatus = countWells("status", 2012);
	xStatus.domain(d3.range(wellStatus.length))
	yStatus.domain([0, 280])
	
	// Add axes for status bar chart
	svg_status.append("g")
	 .attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yStatus)
		.orient("left")
		.tickValues([40, 80, 120, 160, 200, 240, 280]));

	svg_status.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xStatus)
		.orient("bottom")
		.tickFormat(function(d){return wellStatus[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xStatus.rangeBand());

	svg_status.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 10)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "12px")
		.style("font-weight", "bold")
		.style("letter-spacing", "1.8px")
		.text("Number of Wells");

	// Regroup data	for start year
    wellStatus = countWells("status", startYear);

    // Add bars for status chart
	var statusChart = svg_status.selectAll("rect")
   		.data(wellStatus)		
   		.enter()
   		.append("rect")
   		.attr("class", "bar")
   		.attr("selected", "no")
   		.attr("x", function(d, i) {
   			return xStatus(i);
   		})
   		.attr("y", function(d) {
   			return yStatus(d.values);
   		})
   		.attr("width", xStatus.rangeBand())
   		.attr("height", function(d) {
   			return h2 - yStatus(d.values);
   		})
   		.style("fill", function(d){
   			if(d.key === "Defunct"){
   				return "#784860"
   			} else if(d.key === "Fails every summer"){
   				return "#C07860"
   			} else if(d.key === "Fails during droughts"){
   				return "#F8CA8C"
   			} else if(d.key === "Has never failed"){
   				return "#FFF4C2"
   			}
   		})
   		.style("stroke", "red")
   		.style("stroke-width", 0)
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
				if(sliderStatus != "playing"){
					d3.select(this)
					.style("opacity", 1);

					svg_map.selectAll(".well")
					.attr("r", function(j){
		   				if (j.year <= slider.value() & this.getAttribute("display") === "yes"){
		   					if(d.key === j.status){
		   						return 3.5;
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
		   			});

		   			svg_status.append("text")	
						   .attr("id", "statustip")
						   .attr("x", parseInt(this.getAttribute("x")) + 27.5)
						   .attr("y", parseInt(this.getAttribute("y")) - 2)
						   .attr("text-anchor", "middle")
						   .attr("font-family", "sans-serif")
						   .attr("font-size", "14px")
						   .attr("font-weight", "bold")
						   .attr("fill", "black")
						   .text(Math.round(yType.invert(this.getAttribute("y"))));
		   		}
		})
		.on("click", function(d){
			if(sliderStatus != "playing"){
				if(this.getAttribute("selected") === "no"){

					d3.selectAll("#well-viz-charts .bar").attr("selected", "no")
							.style("stroke-width", 0)

					d3.select(this).attr("selected", "yes")
						.style("stroke-width", 2.5)

					svg_map.selectAll(".well")
						.attr("r", function(j){
			   				if (j.year <= slider.value()){
			   					if(d.key === j.status){
			   						return 3.5;
			   					}else{
			   						return 0;
			   					}
			   				}else{
			   					return 0;
			   				}
			   			})
			   			.attr("display", function(j){
			   				if(d.key === j.status){
			   					return "yes";
			   				}else{
			   					return "no";
			   				}
			   			});
		   		}else{
					d3.selectAll("#well-viz-charts .bar").attr("selected", "no")
						.style("stroke-width", 0)

					svg_map.selectAll(".well")
						.attr("display", "yes")
						.attr("r", function(j){
							if(this.getAttribute("display") === "yes"){
				   				if(j.year <= slider.value()){
				   					return 3;
				   				}else{
				   					return 0;
				   				}
				   			}else{
				   				return 0
				   			}
	   					});
				}
		
		}
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("opacity", 0.7);

				svg_map.selectAll(".well")
					.attr("r", function(j){
						if(this.getAttribute("display") === "yes"){
			   				if(j.year <= slider.value()){
			   					return 3;
			   				}else{
			   					return 0;
			   				}
			   			}else{
			   				return 0
			   			}
		   			});

	   			d3.select("#statustip").remove();
		});

	addLineChart();

}			

function addLineChart(){

	d3.csv("/assets/data/dhone_wells_year_totals.csv", function(data) {

		lineData = data;

		var lineTotal = d3.svg.line()
	    			 .x(function(d) { return xline(d.year); })
	                 .y(function(d) { return yline(d.cumTotal); });

		
		svg_line.append("path")
      			.datum(data)
      			.attr("class", "chartline")
      			.attr("d", lineTotal)

      	svg_line.append("g")
			 	.attr("class", "y axis")
				.call(d3.svg.axis()
					.scale(yline)
					.orient("left")
					.tickValues([0, 100, 200, 300, 400, 500, 600]));

		svg_line.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0, " + h3 + ")")
				.call(d3.svg.axis()
					.scale(xline)
					.orient("bottom")
					.tickFormat(d3.format("d"))
					.tickValues([1970, 1980, 1990, 2000, 2010]));

		svg_line.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin_chart.left + 10)
				.attr("x",0 - (h3 / 2))
				.style("text-anchor", "middle")
				.style("font-size", "12px")
				.style("font-weight", "bold")
				.style("letter-spacing", "1.8px")
				.text("Number of Wells");

		svg_line.append("circle")
				.attr("cx", function(){
					return xline(1980);
				})
				.attr("cy", function(d){
					return yline(86)
				})
				.attr("r", 5)
				.attr("id", "well-total")
				.style("fill", "#B91E02")
				.attr("stroke", "black")
				.attr("stroke-width", 0)
				.on("mouseover", function(){
					var point = this;
					d3.select(this)
					  .attr("stroke-width", 1.1)	
					svg_line.append("text")	
						   .attr("id", "linetip")
						   .attr("x", function(){
						   		if (slider.value() < 1985){
						   			return (parseInt(point.getAttribute("cx"))) - 50;
						   		} else{
						   			return (parseInt(point.getAttribute("cx"))) - 70;
						   		}
						   })
						   .attr("y", function(){
						   		if(slider.value() < 1985){
						   			return parseInt(point.getAttribute("cy")) - 8;
						   		} else{
						   			return parseInt(point.getAttribute("cy")) - 2;
						   		}
							})
						   .attr("text-anchor", "left")
						   .attr("font-family", "sans-serif")
						   .attr("font-size", "14px")
						   .attr("font-weight", "bold")
						   .attr("fill", "#6A7368")
						   .text(Math.round(yline.invert(this.getAttribute("cy"))) + " Wells");

					svg_line.append("line")
							.attr("id", "guideline")
							.attr("stroke", "#BDBBC4")
							.attr("stroke-width", 1.1)
							.attr("stroke-dasharray", ("3, 3"))
							.attr("x1", 0)
							.attr("x2", this.getAttribute("cx") - 5)
							.attr("y1", this.getAttribute("cy"))
							.attr("y2", this.getAttribute("cy")) 	
				})
				.on("mouseout", function(){
					d3.select(this).attr("stroke-width", 0);
					d3.select('#linetip').remove();
					d3.select('#guideline').remove();
				});


		var lineAv = d3.svg.line()
	    			 .x(function(d) { return xAvDep(d.year); })
	                 .y(function(d) { return yAvDep(d.cumAv); });

	    svg_avDep.append("path")
      			.datum(data)
      			.attr("class", "chartline")
      			.attr("d", lineAv)

      	svg_avDep.append("g")
			 	.attr("class", "y axis")
				.call(d3.svg.axis()
					.scale(yAvDep)
					.orient("left")
					.tickValues([0, 10, 20, 30, 40, 50]));

		svg_avDep.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0, " + h3 + ")")
				.call(d3.svg.axis()
					.scale(xAvDep)
					.orient("bottom")
					.tickFormat(d3.format("d"))
					.tickValues([1970, 1980, 1990, 2000, 2010]));

		svg_avDep.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin_chart.left + 10)
				.attr("x",0 - (h3 / 2))
				.style("text-anchor", "middle")
				.style("font-size", "12px")
				.style("font-weight", "bold")
				.style("letter-spacing", "1.8px")
				.text("Average depth (m)");

		svg_avDep.append("circle")
				.attr("cx", function(){
					return xAvDep(1980);
				})
				.attr("cy", function(d){
					return yAvDep(9.8)
				})
				.attr("r", 5)
				.attr("id", "well-avDep")
				.style("fill", "#B91E02")
				.attr("stroke", "black")
				.attr("stroke-width", 0)
				.on("mouseover", function(){
					var point = this;
					d3.select(this)
					  .attr("stroke-width", 1.1)	
					svg_avDep.append("text")	
						   .attr("id", "avlinetip")
						   .attr("x", function(){
						   		if (slider.value() < 1985){
						   			return (parseInt(point.getAttribute("cx"))) - 50;
						   		} else{
						   			return (parseInt(point.getAttribute("cx"))) - 70;
						   		}
						   })
						   .attr("y", function(){
						   		if(slider.value() < 1985){
						   			return parseInt(point.getAttribute("cy")) - 8;
						   		} else{
						   			return parseInt(point.getAttribute("cy")) - 2;
						   		}
							})
						   .attr("text-anchor", "left")
						   .attr("font-family", "sans-serif")
						   .attr("font-size", "14px")
						   .attr("font-weight", "bold")
						   .attr("fill", "#6A7368")
						   .text(Math.round(yAvDep.invert(this.getAttribute("cy"))) + " metres");
					//debugger;		   
					svg_avDep.append("line")
							.attr("id", "guideline")
							.attr("stroke", "#BDBBC4")
							.attr("stroke-width", 1.1)
							.attr("stroke-dasharray", ("3, 3"))
							.attr("x1", 0)
							.attr("x2", this.getAttribute("cx") - 5)
							.attr("y1", this.getAttribute("cy"))
							.attr("y2", this.getAttribute("cy")) 	
				})
				.on("mouseout", function(){
					d3.select(this).attr("stroke-width", 0);
					d3.select('#avlinetip').remove();
					d3.select('#guideline').remove();
				});

	});
}

function updateLineChart(year){

	d3.select("#well-total")
		.transition()
		.duration(function(){
			if(sliderStatus === "playing"){
				return yearDuration;
			} else {
				return 10;
			}
		})
		.attr("cx", function(){
			if (year === 2013){
				return xline(2012);
			} else{
				return xline(year);
			}
		})
		.attr("cy", function(){
			for (var i = 0; i <= lineData.length; i++) {
				if(lineData[i].year == year){
						return yline(lineData[i].cumTotal);
				}else if(slider.value() == 2013){
					return yline(573);
				}
			}
		});

		d3.select("#well-avDep")
		.transition()
		.duration(function(){
			if(sliderStatus === "playing"){
				return yearDuration;
			} else {
				return 10;
			}
		})
		.attr("cx", function(){
			if (year === 2013){
				return xAvDep(2012);
			} else{
				return xAvDep(year);
			}
		})
		.attr("cy", function(){
			for (var i = 0; i <= lineData.length; i++) {
				if(lineData[i].year == year){
						return yAvDep(lineData[i].cumAv);
				}else if(slider.value() == 2013){
					return yAvDep(49.7);
				}
			}
		});
}


function countWells(attr, year){
					
	var nested = d3.nest()
    	.key(function(d) {
        	return d[attr];
        	})
    	.rollup(function(wellData) {

        	var count = d3.sum(wellData, function(d) {
        		if(d['year'] <= year){;
            		return d['count'];
            	}		
        });
        return count;
    })
    .entries(wellData);
    return nested
}

function sliderActivate(){		 
    
    slider.on("slide", function(evt, value){
	    	if (sliderStatus === "playing"){
	    		clearInterval(interval);
			}else if(sliderStatus === "finished"){
				if(value != 2013){
					//clearInterval(interval);
					sliderStatus = "paused";
					d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-play");
				}
			}

			d3.select("#slider-con-wells .d3-slider #handle-one")
	      		.attr("left", (100*(value-startYear))/33 + "%");
			d3.select('#slidertext').text(function(){
				if(value < 2013){
					return value;
				} else if(value == 2013){
					return 2012;
				}
			});
			updateWells(value);
			updateLineChart(value);
			step = value;

		})
		.on("slideend", function(evt, value){
			if(value === 2013){
				sliderStatus = "finished";
				d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-repeat");
				d3.select(".glyphicon").attr("title", "Replay Animation");
			}else if(sliderStatus === "playing"){
				animate();
			};
		})	
	

}

function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
	    	words = text.text().split(/\s+/).reverse(),
	    	word,
	    	line = [],
	    	lineNumber = 0,
	    	lineHeight = 1, // ems
	    	y = text.attr("y"),
	    	dy = parseFloat(text.attr("dy")),
	    	tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
	  		line.push(word);
	  		tspan.text(line.join(" "));
	  		if (tspan.node().getComputedTextLength() > width) {
	    		line.pop();
	    		tspan.text(line.join(" "));
	    		line = [word];
	    		tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      		}
   		 }
  	});
}

function animate(){
	interval = setInterval(function(){ 
		step++;

		slider.value(step);

		if (step === 2013){
			clearInterval(interval);
			updateWells(step);
			updateLineChart(step);
			sliderStatus = "finished";
			d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-repeat");
			d3.select(".glyphicon").attr("title", "Replay Animation");
		}; 

		if(step < 2013){
		   d3.select("#slider-con-wells .d3-slider #handle-one")
	      		.attr("left", function(){
					var move = (100*(step-startYear))/33; 
					if(move <= 100){
						return move + "%";
					}
	      		});
	      			 
	       updateWells(step);
	       updateLineChart(step);
	       
		}
	}, yearDuration); 
}

function updateWells(year){

	if(year < 2013) d3.select('#slidertext').text(year);

	wellCircles.transition()
		.duration(function(){
			if(sliderStatus === "playing"){
				return yearDuration;
			} else {
				return 100;
			}
		})
		.attr("r", function(d){
				if(this.getAttribute("display") === "yes"){
					if(d.year === startYear ){
						return 3;
					} else if (d.year == year & sliderStatus === "playing"){
						return 10;
					}else if(d.year < year){
						return 3;
					} 
					else{
						return 0;
					}
				}
			  })

		// Update type chart
	wellTypes = countWells("type", year);
	svg_type.selectAll("rect")
			    .data(wellTypes)
				.transition()
				.duration(yearDuration)
				.attr("y", function(d) {
					return yType(d.values);
			    })
				.attr("height", function(d) {
					return h2 - yType(d.values);
			    });

		//Update depth chart	
	wellDepths = countWells("depth_bin", year);
	svg_depth.selectAll("rect")
			    .data(wellDepths)
				.transition()
				 .duration(yearDuration)
				 .attr("y", function(d) {
					return yDepth(d.values);
				 })
				 .attr("height", function(d) {
					return h2 - yDepth(d.values);
				 });

		//Update Status chart	
	wellStatus = countWells("status", year);
	svg_status.selectAll("rect")
			  .data(wellStatus)
		      .transition()
			  .duration(yearDuration)
			  .attr("y", function(d) {
			 	return yStatus(d.values);
			  })
			  .attr("height", function(d) {
			 	return h2 - yStatus(d.values);
			  });
}



function scrollAnimate(){
	if(document.body.scrollTop > 2000 || document.documentElement.scrollTop > 2000){
		if(scrollTrig === true & slider.value() < 2013){
			d3.select(".playPause span").classed("glyphicon", false)
									  			.attr("class", "glyphicon glyphicon-pause");
			sliderStatus = "playing";
			d3.select(".glyphicon").attr("title", "Pause Animation");
			animate();
			scrollTrig = false;
		}
	}
}


function createWellVis(){
	drawFeatures();
	updateLegend(colorDepth);
	createButtons();
}

createWellVis();
	