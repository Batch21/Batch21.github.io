var startYearRWH = 1998,
	rwhData,
	capacityData,
	buttonTextRWH = "RWH Type",
	cubedMetres = "m³",
	stepRWH = startYearRWH,
	sliderStatusRWH = "paused",
	scrollTrigRWH = true,
	intervalRWH;

var sliderRWH = d3.slider().axis(d3.svg.axis().ticks(17).tickSize(6).tickFormat(d3.format(".0d"))).min(1998).max(2012).value(startYearRWH).step(1);
d3.select('#slider-rwh').call(sliderRWH);

commas = d3.format(",");

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
		.attr("width", 500)
		.attr("height", 540);

var legendRWH = d3.select("#legendRWH").append("svg")
	   .attr("id", "legendSVG_RWH")
	   .attr("width", 150)
	   .attr("height", 200)
       .append("g")
       .attr("id", "legendBoxRWH")

dem_legendRWH = legendRWH.append("g")
	   				.attr("width", 135)
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
				        .attr("width", 135)
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
	.text("Study Area")
	.style("font-size", "12px");

var drainageLegendRWH = legendRWH.append("g")
						   .attr("id", "DrainageLegend")
						   .attr("transform", "translate(" + 15 + "," + 100 + ")")

drainageLegendRWH.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 0)
	.style("stroke", "#1f78b4")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

drainageLegendRWH.append("text")
	.attr("x", 32)
	.attr("y", 5)
	.text("Drainage")
	.style("font-size", "12px")


function drawFeaturesRWH() {

	d3.json("/assets/data/village_areas.json", function(villages) {

		svg_map_rwh.selectAll("path.features")
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

				svg_map_rwh.append("text")	
				   .attr("id", "village_name_RWH")
				   .attr("x", parseFloat(projection([d.properties.lon_centre, d.properties.lat_centre])[0]) - 15)
				   .attr("y", parseFloat(projection([d.properties.lon_centre, d.properties.lat_centre])[1]) - 15)
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
				d3.select("#village_name_RWH").remove();
		    });

	var villageLegendRWH = legendRWH.append("g")
						   .attr("id", "villageLegend")
						   .attr("transform", "translate(" + 15 + "," + 116 + ")")

	villageLegendRWH.append("rect")
			  	 .attr("width", 15)
			  	 .attr("height", 10)
			  	 .style("stroke", "red")
			  	 .style("fill", "#DF837D")
			  	 .style("opacity", 0.5)
			  	 .style("shape-rendering", "auto");

	villageLegendRWH.append("text")
			  	 .attr("x", 32)
			  	 .attr("y", 10)
			  	 .text("Village areas")
			  	 .style("font-size", "12px");
	});
}

var rwhTypeScale = d3.scale.ordinal()
						.domain(["Check Dam", "Infiltration Pond", "Bund"])
						.range(["#BDBBC4", "#5D9CA5", "#7a591f"])

var rwhStatusScale = d3.scale.ordinal()
						.domain(["Destroyed", "Damaged", "Good Condition"])
						.range(["#D7191C", "#FDAE61", "#2C7BB6"])

var rwhSizeScale = d3.scale.linear()
						.domain([100, 1000, 10000, 40000])
						.range([56.23, 167.49, 1268.53, 5000])

var rwhTypeScaleLine = d3.scale.ordinal()
						.domain(["bunds", "check_dams", "infiltration_ponds"])
						.range(["#7a591f", "#BDBBC4", "#5D9CA5"])



function drawRWH(){	   

	d3.csv("/assets/data/dhone_rwh.csv", function(data) {

		rwhData = data;
		
		rwhSymbols = svg_map_rwh.selectAll("path.features")
							    .data(data)
							    .enter()
							    .append("path")
							    .attr("transform", function(d){
							     	return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
							     })
							    .attr("d", d3.svg.symbol()
								   	.size(function(d){
								   		if(d.year <= startYearRWH){
								   			return 50;
								   		} else{
								   			return 0;
								   		}
								   	})
									.type(function(d){
								   		if(d.type === "Check Dam"){
								   			return "square";
								   		} else if (d.type === "Infiltration Pond"){
								   			return "circle";
								   		} else if(d.type === "Bund"){
								   			return "triangle-up";
								   		}
							   		}))
							    .attr("class", "rwh")
							    .attr("display", "yes")
							    .style("fill", function(d){
							    	return rwhTypeScale(d.type);
							    })
							    .style("stroke", "#504A4B")
							    .style("stroke-width", 1)
								.style("opacity", 0.7)
								.on("mouseover", function(d){
									
									d3.select(this)
									  .attr("d", d3.svg.symbol()
									  	.size(function(d){
									  		if(buttonTextRWH != "RWH Capacity"){
									  			return 250;
									  		}else{
									  			return rwhSizeScale(d.Capacity);
									  		}
									  	})
									  	.type(function(d){
										  	if(buttonTextRWH == "RWH Type"){	
										   		if(d.type === "Check Dam"){
										   			return "square";
										   		} else if (d.type === "Infiltration Tankk"){
										   			return "circle";
										   		} else if(d.type === "Bund"){
										   			return "triangle-up";
										   		}
										   	}else{
										   		return "circle";
										   	}
							   			}))
									  	.style("opacity", 1);

									 var info = svg_map_rwh.append("svg")
											   .attr("class", "tooltip")
											   .attr("height", 66)
											   .attr("width", 130)
											   .attr("x", function(){
											   		if(d.lon <= 77.83){
											   	  		return projection([d.lon, d.lat])[0] 
											   	  	}else{
											   	  		return projection([d.lon, d.lat])[0] - 100
											   	  	}
											   })
											   .attr("y", function(){
											   	  return projection([d.lon, d.lat])[1] - 68
											   })
											   .append("g");

								    info.append("rect")
										.attr("class", "rwhInfoBox")
										.attr("height", 64)
										.attr("width", 128)
										.attr("x", 1)
										.attr("y", 1)
										.attr("rx", 10)
										.attr("ry", 10);

									info.append("text")
									.attr("x", 5)
									.attr("y", 15)
									.style("font-size", "12px")
									.style("font-weight", "bold")
									.text(function(){
										return d.type;
									})

									info.append("text")
										.attr("x", 5)
										.attr("y", 30)
										.style("font-size", "11px")
										.text(function(){
											return "Capacity: " + commas(d.Capacity) + " " + cubedMetres;
										})

									info.append("text")
										.attr("x", 5)
										.attr("y", 45)
										.style("font-size", "11px")
										.text(function(){
											return "Status: " + d.status;
										})

									info.append("text")
										.attr("x", 5)
										.attr("y", 60)
										.style("font-size", "11px")
										.text(function(){
											if(d.year < 1980){
												return "Year constructed: ~" + d.year;
											}else{
												return "Year constructed: " + d.year;
											}
										})
								})
								.on("mouseout", function(){
									d3.select(this).attr("d", d3.svg.symbol()
									  	.size(function(d){
									  		if(buttonTextRWH != "RWH Capacity"){
									  			return 50;
									  		}else{
									  			return rwhSizeScale(d.Capacity);
									  		}
									  	})
									  	.type(function(d){
									  		if(buttonTextRWH == "RWH Type"){	
										   		if(d.type === "Check Dam"){
										   			return "square";
										   		} else if (d.type === "Infiltration Tankk"){
										   			return "circle";
										   		} else if(d.type === "Bund"){
										   			return "triangle-up";
										   		}
										   	}else{
										   		return "circle";
										   	}
							   			}))
										.style("opacity", 0.7);

									d3.select('.tooltip').remove();
								});	
		addBarChartsRWH();
		addLineChartRWH();
		SliderUpdateRWH();		
		});
	
	d3.select("#rwh-viz .glyphicon").attr("title", "Play Animation");
	d3.select(".playPauseRWH button").on("click", function(){
			if(sliderStatusRWH === "finished"){
				stepRWH = startYearRWH - 1;
				d3.select(".playPauseRWH span").classed("glyphicon", false)
								  			.attr("class", "glyphicon glyphicon-pause");
				sliderStatusRWH = "playing";
				d3.select("#rwh-viz .glyphicon").attr("title", "Pause Animation");
				scrollTrigRWH = false;
				animateRWH();
			}else if (sliderStatusRWH === "paused"){
				d3.select(".playPauseRWH span").classed("glyphicon", false)
								  			.attr("class", "glyphicon glyphicon-pause");
				sliderStatusRWH = "playing";
				d3.select("#rwh-viz .glyphicon").attr("title", "Pause Animation");
				scrollTrigRWH = false;
				animateRWH();
			}else{
				clearInterval(intervalRWH);
				d3.select(".playPauseRWH span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-play");
				sliderStatusRWH = "paused";
				d3.select("#rwh-viz .glyphicon").attr("title", "Play Animation");
				svg_map_rwh.selectAll(".rwh")
						.transition()
						.duration(yearDuration)
						.attr("d", d3.svg.symbol()
								   	.size(function(d){
								  		if(d.year <= sliderRWH.value() && this.getAttribute("display") == "yes"){
									  		if(buttonTextRWH != "RWH Capacity"){
									  			return 50;
									  		} else{
									  			return rwhSizeScale(parseInt(d.Capacity));
									  		}
									  	}else {
									  		return 0;
									  	}
									 })
									.type(function(d){
								  		if(buttonTextRWH == "RWH Type"){ 
									   		if(d.type === "Check Dam"){
									   			return "square";
									   		} else if (d.type === "Infiltration Pond"){
									   			return "circle";
									   		} else if(d.type === "Bund"){
									   			return "triangle-up";
									   		}
									   	}else{
									   		return "circle";
									   	}
							   		}))
			}

		});

}

function updateLegendRWH(buttonScale){
		
	legendRWH.select("#legendGroupRWH").remove();
	legendRWH.select("#rwhTitle").remove();
	var totalCircleRadii = 0;			
	
	legendRWH.append("text")
			 .attr("x", function(){
				if(buttonTextRWH != "RWH Capacity"){
					return 48;
				}else{
					return 60;
				}
			 })
			 .attr("y", 150)
			 .text(buttonTextRWH)
			 .attr("id", "rwhTitle")
			 .style("font-size", "12px")
			 .style("font-weight", "bold")
			 .style("text-decoration", "underline");
	
	strucLegend = legendRWH.append("g")
		.attr("id", "legendGroupRWH")
			.attr("transform", function(){
				if(buttonTextRWH != "RWH Capacity"){
					return "translate(" + 22 + "," + 162 + ")"
				}else{
					return "translate(" + 42 + "," + 162 + ")"
				}
			})
			.selectAll("g")
			.data(buttonScale.domain())
			.enter()
			.append("g")
		.attr("class", "legendItem")
		.attr("transform", function(d, i) {
			if(buttonTextRWH != "RWH Capacity"){
	  			var height = 22;
	  			var horz = 0;
	  			var vert = i * height;
	  			return "translate(" + horz + "," + vert + ")";
	  		} else{
	  			//debugger;
	  			totalCircleRadii += Math.sqrt(rwhSizeScale(d)/Math.PI) * 1.5;
	  			var height = 9;
	  			var horz = 0;
	  			var vert = i * height + totalCircleRadii;
	  			return "translate(" + horz + "," + vert + ")";
	  		}
			});

	strucLegend.append("path")
			   .attr("d", d3.svg.symbol()
				   	.size(function(d){
				   		if(buttonTextRWH != "RWH Capacity"){
				   			return 110;
				   		} else{
				   			return rwhSizeScale(d)
				   		}
				   	})
					.type(function(d){
				   		if(d === "Check Dam"){
				   			return "square";
				   		} else if (d === "Infiltration Pond"){
				   			return "circle";
				   		} else if(d === "Bund"){
				   			return "triangle-up";
				   		}
						}))
			   		.attr("fill", function(d){
			   			if(buttonTextRWH != "RWH Capacity"){
			   				return buttonScale(d);
			   			}else{
			   				return "#96E1EB"
			   			}
			   		})
			   		.style("opacity", 0.7)
			   		.style("stroke", "#504A4B")
					.style("stroke-width", 1);

	strucLegend.append("text")
		.attr("x", function(){
				if(buttonTextRWH != "RWH Capacity"){
					return 25;
				}else{
					return 60;
				}
			 })
		.attr("y", 6)
		.text(function(d) { 
			if(buttonTextRWH != "RWH Capacity"){
				return d;
			} else{
				return commas(d) + " " + cubedMetres;
			}
		})
		.style("font-size", "12px");

	height = document.getElementById("legendBoxRWH").getBBox().height;	
	width = document.getElementById("legendBoxRWH").getBBox().width;
	d3.select("#legendSVG_RWH").attr("height", height + 15).attr("width", width + 10);
	}

function activateButtonsRWH(){

	d3.select("#rwhTypeButton").style("background-color", "#FAE9BD")
							   	 .style("border-width", "1px");

	d3.selectAll(".buttonRWH")
		.on("mouseover", function(){
			d3.select(this).style("opacity", 1)
						   .style("border-width", "2px")
						   .style("margin", "0px")
						   .style("margin", " 0px 4px 0px 0px");
		})
		.on("mouseout", function(){
			d3.select(this).style("opacity", 0.95)
						   .style("border-width", "1px")
						   .style("margin", "1px")
						   .style("margin", "1px 5px 1px 1px");;
		})
		.on("click", function(){
			buttonTextRWH = this.textContent;

			d3.selectAll(".buttonRWH").style("background-color", "#DDDDDD")
						           .style("border-width", "1px");						   
			d3.select(this).style("background-color", "#FAE9BD")
						   .style("border-width", "2px");
							   
			svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(d){
				  		if(this.getAttribute("display") == "yes" && d.year <= sliderRWH.value()){
					  		if(buttonTextRWH != "RWH Capacity"){
					  			return 50;
					  		} else{
					  			return rwhSizeScale(d.Capacity)
					  		}
					  	}else{
					  		return 0;
					  	}
				  	})
				  	.type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   			}))
				.style("fill", function(d){
					if (buttonTextRWH === "RWH Type"){
						if (d.type){
				   			return rwhTypeScale(d.type);
						}
						else{
							return "#ccc";
						}
					}else if(buttonTextRWH === "RWH Status"){
						if (d.status){
				   			return rwhStatusScale(d.status);
						}
						else{
							return "#ccc";
						}
					}else if(buttonTextRWH === "RWH Capacity"){
						if(d.Capacity){
							return "#96E1EB";
						}else{
							return "#ccc";
						}
					}else{
						return "#ccc"
					}
					})

				// Update legend
			if(buttonTextRWH === "RWH Type"){
				updateLegendRWH(rwhTypeScale);
			}else if(buttonTextRWH === "RWH Status"){
				updateLegendRWH(rwhStatusScale);
			}else if(buttonTextRWH === "RWH Capacity"){
				updateLegendRWH(rwhSizeScale);
			}
		})
}

var rwh_type = d3.select("#rwh-viz-chart1").append("svg")
			.attr("width", w5 + margin_bar.left + margin_bar.right)
			.attr("height", h4 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var rwh_status = d3.select("#rwh-viz-chart2").append("svg")
			.attr("width", w5 + margin_bar.left + margin_bar.right)
			.attr("height", h4 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var rwh_capacity = d3.select("#rwh-viz-chart3").append("svg")
			.attr("width", w3 + margin_line.left + margin_line.right)
			.attr("height", h4 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_line.left + "," + margin_bar.top + ")");

var xTypeRWH = d3.scale.ordinal()
				.rangeRoundBands([0, w5], 0.05);
var yTypeRWH = d3.scale.linear()
				.range([h4, 0]);

var xStatusRWH = d3.scale.ordinal()
				  .rangeRoundBands([0, w5], 0.05);
var yStatusRWH = d3.scale.linear()
				  .range([h4, 0])

var xlineRWH = d3.scale.linear()
				  .range([0, w3])
				  .domain([1998, 2012]);
var ylineRWH = d3.scale.linear()
				  .range([h4, 0])
				  .domain([0, 120000]);


function addBarChartsRWH(){

	var rwhTypes = countRWH("type", startYearRWH);
	xTypeRWH.domain(d3.range(Object.keys(rwhTypes).length));
	yTypeRWH.domain([0, 65]);

	rwh_type.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yTypeRWH)
		.innerTickSize(-w5)
		.outerTickSize(0)
		.orient("left"));

	rwh_type.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h4 + ")")
		.call(d3.svg.axis()
		.scale(xTypeRWH)
		.orient("bottom")
		.innerTickSize(0)
		.outerTickSize(0)
		.tickFormat(function(d){return rwhTypes[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xTypeRWH.rangeBand());

	rwh_type.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 15)
		.attr("x",0 - (h4 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.style("letter-spacing", "1.6px")
		.text("Number of structures");

	rwh_type.selectAll("rect")
   		.data(rwhTypes)		
   		.enter()
   		.append("rect")
   		.attr("selected", "no")
   		.attr("class", "bar")
   		.attr("x", function(d, i) {
   			return xTypeRWH(i);
   		})
   		.attr("y", function(d){
   			return yTypeRWH(d.count);
   		})
   		.attr("width", xTypeRWH.rangeBand())
   		.attr("height", function(d) {
   			return h4 - yTypeRWH(d.count);
   		})
   		.style("fill", function(d){
   			if(d.key == "Check Dam"){
   				return "#BDBBC4";
   			}else if(d.key == "Infiltration Pond"){
   				return "#5D9CA5";
   			}else if(d.key == "Bund"){
   				return "#7a591f";
   			}
   		})
   		.style("stroke", "black")
   		.style("stroke-width", 0)
   		.on("mouseover", function(d){
			
			d3.select(this)
			.style("fill", function(d){
	   			if(d.key == "Check Dam"){
	   				return "#a2a0ac";
	   			}else if(d.key == "Infiltration Pond"){
	   				return "#518b94";
	   			}else if(d.key == "Bund"){
	   				return "#513b15";
	   			}
	   		});

			svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   						if(d.key === j.type){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    );

   			rwh_type.append("text")	
				   .attr("id", "typetipRWH")
				   .attr("x", parseInt(this.getAttribute("x")) + 40.5)
				   .attr("y", parseInt(this.getAttribute("y")) - 2)
				   .attr("text-anchor", "middle")
				   .attr("font-family", "sans-serif")
				   .attr("font-size", "14px")
				   .attr("font-weight", "bold")
				   .attr("fill", "black")
				   .text(Math.round(yTypeRWH.invert(this.getAttribute("y"))));

		})
		.on("click", function(d){
			if(this.getAttribute("selected") === "no"){

				d3.selectAll("#rwh-viz-charts .bar").attr("selected", "no")
						.style("stroke-width", 0)

				d3.select(this).attr("selected", "yes")
					.style("stroke-width", 2.5)

				svg_map_rwh.selectAll(".rwh")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   						if(d.key === j.type){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    	)
		   			.attr("display", function(j){
		   				if(d.key === j.type){
		   					return "yes";
		   				}else{
		   					return "no";
		   				}
		   			});
   			}else{
				d3.selectAll("#rwh-viz-charts .bar").attr("selected", "no")
					.style("stroke-width", 0)

				svg_map_rwh.selectAll(".rwh")
					.attr("display", "yes")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   						if(d.key === j.type){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    );
			}
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("fill", function(d){
		   			if(d.key == "Check Dam"){
		   				return "#BDBBC4";
		   			}else if(d.key == "Infiltration Pond"){
		   				return "#5D9CA5";
		   			}else if(d.key == "Bund"){
		   				return "#7a591f";
		   			}
		   		});

				svg_map_rwh.selectAll(".rwh")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if(j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   				}else{
		   						return 0;
		   				}

   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    );

	   			d3.select("#typetipRWH").remove();
		});
    
    var rwhStatus = countRWH("status", startYearRWH);
	xStatusRWH.domain(d3.range(Object.keys(rwhTypes).length));
	yStatusRWH.domain([0, 65]);

	rwh_status.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yStatusRWH)
		.innerTickSize(-w5)
		.outerTickSize(0)
		.orient("left"));

	rwh_status.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h4 + ")")
		.call(d3.svg.axis()
		.scale(xStatusRWH)
		.orient("bottom")
		.innerTickSize(0)
		.outerTickSize(0)
		.tickFormat(function(d){return rwhStatus[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xStatusRWH.rangeBand());

	rwh_status.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 18)
		.attr("x",0 - (h4 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.style("letter-spacing", "1.6px")
		.text("Number of structures");

	rwh_status.selectAll("rect")
   		.data(rwhStatus)		
   		.enter()
   		.append("rect")
   		.attr("selected", "no")
   		.attr("class", "bar")
   		.attr("x", function(d, i) {
   			return xStatusRWH(i);
   		})
   		.attr("y", function(d){
   			return yStatusRWH(d.count);
   		})
   		.attr("width", xStatusRWH.rangeBand())
   		.attr("height", function(d) {
   			return h4 - yStatusRWH(d.count);
   		})
   		.style("fill", function(d){
   			if(d.key == "Good Condition"){
   				return "#2C7BB6";
   			}else if(d.key == "Damaged"){
   				return "#FDAE61";
   			}else if(d.key == "Destroyed"){
   				return "#D7191C";
   			}
   		})
   		.style("stroke", "black")
   		.style("stroke-width", 0)
   		.on("mouseover", function(d){
			
			d3.select(this)
			.style("fill", function(d){
	   			if(d.key == "Good Condition"){
	   				return "#236190";
	   			}else if(d.key == "Damaged"){
	   				return "#fd9935";
	   			}else if(d.key == "Destroyed"){
	   				return "#b71518";
	   			}
	   		});

			svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   						if(d.key === j.status){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    );

   			rwh_status.append("text")	
				   .attr("id", "statustipRWH")
				   .attr("x", parseInt(this.getAttribute("x")) + 40.5)
				   .attr("y", parseInt(this.getAttribute("y")) - 2)
				   .attr("text-anchor", "middle")
				   .attr("font-family", "sans-serif")
				   .attr("font-size", "14px")
				   .attr("font-weight", "bold")
				   .attr("fill", "black")
				   .text(Math.round(yTypeRWH.invert(this.getAttribute("y"))));

		})
		.on("click", function(d){
			if(this.getAttribute("selected") === "no"){

				d3.selectAll("#rwh-viz-charts .bar").attr("selected", "no")
						.style("stroke-width", 0)

				d3.select(this).attr("selected", "yes")
					.style("stroke-width", 2.5)

				svg_map_rwh.selectAll(".rwh")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   						if(d.key === j.status){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    	)
		   			.attr("display", function(j){
		   				if(d.key === j.status){
		   					return "yes";
		   				}else{
		   					return "no";
		   				}
		   			});
   			}else{
				d3.selectAll("#rwh-viz-charts .bar").attr("selected", "no")
					.style("stroke-width", 0)

				svg_map_rwh.selectAll(".rwh")
					.attr("display", "yes")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   						if(d.key === j.status){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   					}else{
		   						return 0;
		   					}
		   				}else{
		   					return 0;
		   				}
   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    );
			}
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("fill", function(d){
		   			if(d.key == "Good Condition"){
		   				return "#2C7BB6";
		   			}else if(d.key == "Damaged"){
		   				return "#FDAE61";
		   			}else if(d.key == "Destroyed"){
		   				return "#D7191C";
		   			}
		   		});

				svg_map_rwh.selectAll(".rwh")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if(j.year <= sliderRWH.value() && this.getAttribute("display") === "yes"){
	   							if(buttonTextRWH == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   				}else{
		   						return 0;
		   				}

   			        })
   			        .type(function(d){
				  		if(buttonTextRWH == "RWH Type"){ 
					   		if(d.type === "Check Dam"){
					   			return "square";
					   		} else if (d.type === "Infiltration Pond"){
					   			return "circle";
					   		} else if(d.type === "Bund"){
					   			return "triangle-up";
					   		}
					   	}else{
					   		return "circle";
					   	}
	   				})
   			    );

	   			d3.select("#statustipRWH").remove();
		});
}


function addLineChartRWH(){

	d3.csv("/assets/data/dhone_rwh_cumulative_capacity.csv", function(data) {

		capacityData = data;
	  	rwh_capacity.append("g")
			 	.attr("class", "y axis")
				.call(d3.svg.axis()
					.scale(ylineRWH)
					.innerTickSize(-w3)
					.outerTickSize(0)
					.orient("left")
					.tickValues([10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000]));

		rwh_capacity.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0, " + h4 + ")")
				.call(d3.svg.axis()
					.scale(xlineRWH)
					.orient("bottom")
					.outerTickSize(0)
					.ticks([15])
					.tickFormat(d3.format("d")));

		rwh_capacity.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin_line.left + 15)
				.attr("x",0 - (h4 / 2))
				.style("text-anchor", "middle")
				.style("font-size", "14px")
				.style("font-weight", "bold")
				.style("letter-spacing", "1.2px")
				.text("Total Capacity " + "(" + cubedMetres + ")");

		var lineCapacity = d3.svg.line()
	    			 .x(function(d) { return xlineRWH(d.year); })
	                 .y(function(d) { return ylineRWH(d.all); });

		rwh_capacity.append("path")
	      			.datum(data)
	      			.attr("class", "chartline")
	      			.attr("d", lineCapacity);

	    rwh_capacity.append("text")
					.attr("x", xlineRWH(2005))
					.attr("y", ylineRWH(capacityData[8].all) - 3)
					.style("font-size", "12px")
					.text("All Structures");

	    secondarylines(rwhTypeScaleLine);

	    d3.selectAll("#line-menu input").on("click", function(d){
	    	d3.selectAll(".secondayLineText").remove()
	    	d3.selectAll(".secondaryLine").remove()
	    	if(this.id == "status"){
	    		secondarylines(rwhStatusScale);
	    	}else if(this.id == "type"){
	    		secondarylines(rwhTypeScaleLine);
	    	}
	    });  			

		rwh_capacity.append("circle")
				.attr("cx", function(){
					return xlineRWH(startYearRWH);
				})
				.attr("cy", function(d){
					return ylineRWH(65549)
				})
				.attr("r", 5)
				.attr("id", "total-capacity")
				.style("fill", "#B91E02")
				.attr("stroke", "black")
				.attr("stroke-width", 0)
				.on("mouseover", function(){
					var point = this;
					d3.select(this)
					  .attr("stroke-width", 1.1)	
					rwh_capacity.append("text")	
						   .attr("id", "linetip")
						   .attr("x", function(){
						   		if (sliderRWH.value() < 2006){
						   			return (parseInt(point.getAttribute("cx"))) + 5;
						   		} else{
						   			return (parseInt(point.getAttribute("cx"))) - 75;
						   		}
						   })
						   .attr("y", function(){
						   		if(sliderRWH.value() < 2006){
						   			return parseInt(point.getAttribute("cy")) + 15;
						   		} else{
						   			return parseInt(point.getAttribute("cy")) - 2;
						   		}
							})
						   .attr("text-anchor", "left")
						   .attr("font-family", "sans-serif")
						   .attr("font-size", "14px")
						   .attr("font-weight", "bold")
						   .attr("fill", "#6A7368")
						   .text(function(){
						   			return commas(Math.round(ylineRWH.invert(point.getAttribute("cy")))) + " " + cubedMetres;
						   	});

					rwh_capacity.append("line")
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

	});
}

rwhNames = ["Bunds", "Check Dams", "Infiltration Ponds"];

function secondarylines(scale){

	for (var i = 0; i < scale.domain().length; i++) {

		rwh_capacity.append("text")
					.attr("x", xlineRWH(2005))
					.attr("y", ylineRWH(capacityData[8][scale.domain()[i]]) - 3)
					.style("font-size", "12px")
					.attr("class", "secondayLineText")
					.text(function(){
						if(scale.domain() == rwhTypeScaleLine.domain()){
							return rwhNames[i];
						}else {
							return scale.domain()[i];
						}
					});

		var line = d3.svg.line()
    			 		.x(function(d) { return xlineRWH(d.year); })
                 		.y(function(d) { return ylineRWH(d[scale.domain()[i]]); });

		rwh_capacity.append("path")
	      			.datum(capacityData)
					.attr("class", "secondaryLine")
	      			.attr("d", line)
	      			.style("stroke", function(){
	      				return scale.range()[i] 
	      			});	
	     	
	}
}

function SliderUpdateRWH(){
	sliderRWH.on("slide", function(evt, value){
                if (sliderStatusRWH === "playing"){
		    		clearInterval(intervalRWH);
				}else if(sliderStatusRWH === "finished"){
					if(value != 2012){
						sliderStatusRWH = "paused";
						d3.select(".playPauseRWH span").classed("glyphicon", false)
									 			 .attr("class", "glyphicon glyphicon-play");
					}
				}
				stepRWH = value;
				updateRWH(value);
			 })
			 .on("slideend", function(evt, value){
				if(value == 2012){
					sliderStatusRWH = "finished";
					d3.select(".playPauseRWH span").classed("glyphicon", false)
									 			 .attr("class", "glyphicon glyphicon-repeat");
					d3.select("#rwh-viz .glyphicon").attr("title", "Replay Animation");
				}else if(sliderStatusRWH === "playing"){
					animateRWH();
				};
			});
}

function animateRWH(){
	intervalRWH = setInterval(function(){ 
		
		stepRWH++;

		if (stepRWH > 2012){
			clearInterval(intervalRWH);
			sliderStatusRWH = "finished";
			d3.select(".playPauseRWH span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-repeat");
			d3.select("#rwh-viz .glyphicon").attr("title", "Replay Animation");
			updateRWH(stepRWH);
		}else{
		   sliderRWH.value(stepRWH);	 
	       updateRWH(stepRWH);
	       
		}
	}, yearDuration); 
}

function updateRWH(year){

	svg_map_rwh.selectAll(".rwh").transition()
			.duration(function(){
				if(sliderStatusRWH === "playing"){
					return yearDuration;
				} else {
					return 100;
				}
			})
			.attr("d", d3.svg.symbol()
			  	.size(function(d){
			  		if(d.year <= year && this.getAttribute("display") == "yes"){
				  		if(buttonTextRWH != "RWH Capacity"){
				  			if(d.year == startYearRWH){
				  				return 50;
				  			}else if(d.year == year && sliderStatusRWH === "playing"){
				  				return 500;
				  			}else if(d.year < year){
								return 50;
							}else{
								return 0;
							}
				  		} else{
				  			return rwhSizeScale(parseInt(d.Capacity));
				  		}
				  	}else{
				  		return 0;
				  	}
				 })
				.type(function(d){
			  		if(buttonTextRWH == "RWH Type"){ 
				   		if(d.type === "Check Dam"){
				   			return "square";
				   		} else if (d.type === "Infiltration Pond"){
				   			return "circle";
				   		} else if(d.type === "Bund"){
				   			return "triangle-up";
				   		}
				   	}else{
				   		return "circle";
				   	}
					}));

	rwhTypes = countRWH('type', year)
	rwh_type.selectAll("rect")
		    .data(rwhTypes)
			.transition()
			.duration(function(){
				if(sliderStatusRWH == "playing"){
					return yearDuration;
				}else{
					return 100;
				}
			})
			.attr("y", function(d){
	   			return yTypeRWH(d.count);
	   		})
	   		.attr("height", function(d) {
	   			return h4 - yTypeRWH(d.count);
	   		});	

	rwhStatus = countRWH('status', year)
	rwh_status.selectAll("rect")
		    .data(rwhStatus)
			.transition()
			.duration(function(){
				if(sliderStatusRWH == "playing"){
					return yearDuration;
				}else{
					return 100;
				}
			})
			.attr("y", function(d){
	   			return yStatusRWH(d.count);
	   		})
	   		.attr("height", function(d) {
	   			return h4 - yStatusRWH(d.count);
	   		});

	if(year < 2013){
		d3.select("#total-capacity")
			.transition()
			.duration(function(){
					if(sliderStatusRWH == "playing"){
						return yearDuration;
					}else{
						return 100;
					}
			})
			.attr("cx", function(){
				return xlineRWH(year);
			})
			.attr("cy", function(){
				for (var i = 0; i <= capacityData.length; i++) {
					if(capacityData[i].year == year){
							return ylineRWH(capacityData[i].all);
						}
				}
			});
	}
}


function countRWH(column, year){
	var counts = {};
	for (var i = 0; i < rwhData.length; i++) {
		if(rwhData[i].year <= year){
    		counts[rwhData[i][column]] = 1 + (counts[rwhData[i][column]] || 0);
    	}
 	}
 	objects = [];
 	for (i in counts){
 		entry = {};
 		entry["key"] = i; 
 		entry["count"] = counts[i];
 		objects.push(entry);
 	}
    return objects;
}

$(window).on("load", function(){
	$(window).on("scroll", function(){
		if( ($("#rwh-viz").offset().top - ($(window).scrollTop() + $(window).height())) < -($(window).height()/2) && scrollTrigRWH && sliderRWH.value() < 2012){
			d3.select(".playPauseRWH span").classed("glyphicon", false)
									  			.attr("class", "glyphicon glyphicon-pause");
			sliderStatusRWH = "playing";
			d3.select("#rwh-viz .glyphicon").attr("title", "Pause Animation");
			animateRWH();
			scrollTrigRWH = false;
		} 
	});
});

drawFeaturesRWH();
drawRWH();
updateLegendRWH(rwhTypeScale);
activateButtonsRWH();