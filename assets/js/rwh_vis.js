var startYearRWH = 2012,
	rwhData,
	capacityData,
	buttonText = "RWH Type",
	cubedMetres = "m³";

var sliderRWH = d3.slider().axis(true).min(1998).max(startYearRWH).value(startYearRWH).step(1);
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
	   .attr("id", "legendSVG_RWH")
	   .attr("width", 195)
	   .attr("height", 200)
       .append("g")
       .attr("id", "legendBoxRWH")

dem_legendRWH = legendRWH.append("g")
	   				.attr("width", 150)
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
						.domain(["Destroyed", "Damaged", "Good"])
						.range(["#D7191C", "#FDAE61", "#2C7BB6"])

var rwhSizeScale = d3.scale.linear()
						.domain([100, 1000, 10000, 40000])
						.range([56.23, 167.49, 1268.53, 5000])



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
									  		if(buttonText != "RWH Capacity"){
									  			return 250;
									  		}else{
									  			return rwhSizeScale(d.Capacity);
									  		}
									  	})
									  	.type(function(d){
										  	if(buttonText == "RWH Type"){	
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
									
									svg_map_rwh.append("text")	
										   .attr("id", "tooltip")
			   							   .attr("x", parseFloat(projection([d.lon, d.lat])[0]) - 87)
			   							   .attr("y", parseFloat(projection([d.lon, d.lat])[1]) - 10)
			   							   .attr("text-anchor", "left")
			  							   .attr("font-family", "sans-serif")
			  							   .attr("font-size", "14px")
			   							   .attr("font-weight", "bold")
			  							   .attr("fill", "black")
			   							   .text("Capcity: " + d.Capacity + cubedMetres);	
								})
								.on("mouseout", function(){
									d3.select(this).attr("d", d3.svg.symbol()
									  	.size(function(d){
									  		if(buttonText != "RWH Capacity"){
									  			return 50;
									  		}else{
									  			return rwhSizeScale(d.Capacity);
									  		}
									  	})
									  	.type(function(d){
									  		if(buttonText == "RWH Type"){	
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

									d3.select('#tooltip').remove();
								});	
		addBarChartsRWH();
		addLineChartRWH();
		SliderUpdateRWH();			
		});
}

function updateLegendRWH(buttonScale){
		
	legendRWH.select("#legendGroupRWH").remove();
	legendRWH.select("#rwhTitle").remove();
	var totalCircleRadii = 0;			
	
	legendRWH.append("text")
			 .attr("x", function(){
				if(buttonText != "RWH Capacity"){
					return 48;
				}else{
					return 60;
				}
			 })
			 .attr("y", 150)
			 .text(buttonText)
			 .attr("id", "rwhTitle")
			 .style("font-size", "12px")
			 .style("font-weight", "bold")
			 .style("text-decoration", "underline");
	
	strucLegend = legendRWH.append("g")
		.attr("id", "legendGroupRWH")
			.attr("transform", function(){
				if(buttonText != "RWH Capacity"){
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
			if(buttonText != "RWH Capacity"){
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
				   		if(buttonText != "RWH Capacity"){
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
			   			if(buttonText != "RWH Capacity"){
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
				if(buttonText != "RWH Capacity"){
					return 25;
				}else{
					return 60;
				}
			 })
		.attr("y", 6)
		.text(function(d) { 
			if(buttonText != "RWH Capacity"){
				return d;
			} else{
				return numberWithCommas(d) + " " + cubedMetres;
			}
		})
		.style("font-size", "12px");

	height = document.getElementById("legendBoxRWH").getBBox().height;	
	width = document.getElementById("legendBoxRWH").getBBox().width;
	d3.select("#legendSVG_RWH").attr("height", height + 15).attr("width", width + 5);
	}

function activateButtonsRWH(){

	d3.select("#rwhTypeButton").style("background-color", "#FAE9BD")
							   	 .style("border-width", "1px");

	d3.selectAll(".buttonRWH")
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

			d3.selectAll(".buttonRWH").style("background-color", "#DDDDDD")
						           .style("border-width", "1px");						   
			d3.select(this).style("background-color", "#FAE9BD")
						   .style("border-width", "2px");
							   
				// Update well color scheme
			svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(d){
				  		if(buttonText != "RWH Capacity"){
				  			return 50;
				  		} else{
				  			return rwhSizeScale(d.Capacity)
				  		}
				  	})
				  	.type(function(d){
				  		if(buttonText == "RWH Type"){ 
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
					if (buttonText === "RWH Type"){
						if (d.type){
				   			return rwhTypeScale(d.type);
						}
						else{
							return "#ccc";
						}
					}else if(buttonText === "RWH Status"){
						if (d.status){
				   			return rwhStatusScale(d.status);
						}
						else{
							return "#ccc";
						}
					}else if(buttonText === "RWH Capacity"){
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
			if(buttonText === "RWH Type"){
				updateLegendRWH(rwhTypeScale);
			}else if(buttonText === "RWH Status"){
				updateLegendRWH(rwhStatusScale);
			}else if(buttonText === "RWH Capacity"){
				updateLegendRWH(rwhSizeScale);
			}
		})
}

var rwh_type = d3.select("#rwh-viz-chart1").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h4 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var rwh_status = d3.select("#rwh-viz-chart2").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h4 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var rwh_capacity = d3.select("#rwh-viz-chart3").append("svg")
			.attr("width", w3 + margin_line.left + margin_line.right)
			.attr("height", h4 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_line.left + "," + margin_bar.top + ")");

var xTypeRWH = d3.scale.ordinal()
				.rangeRoundBands([0, w2], 0.05);
var yTypeRWH = d3.scale.linear()
				.range([h4, 0]);

var xStatusRWH = d3.scale.ordinal()
				  .rangeRoundBands([0, w2], 0.05);
var yStatusRWH = d3.scale.linear()
				  .range([h4, 0])

var xlineRWH = d3.scale.linear()
				  .range([0, w3])
				  .domain([1998, 2013]);
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
		.orient("left"));

	rwh_type.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h4 + ")")
		.call(d3.svg.axis()
		.scale(xTypeRWH)
		.orient("bottom")
		.tickFormat(function(d){return rwhTypes[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xTypeRWH.rangeBand());

	rwh_type.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 10)
		.attr("x",0 - (h4 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("font-weight", "bold")
		.style("letter-spacing", 1.1)
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
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
			
			d3.select(this)
			.style("opacity", 1);

			svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   						if(d.key === j.type){
	   							if(buttonText == "RWH Capacity"){
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
				  		if(buttonText == "RWH Type"){ 
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
	   					if (j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   						if(d.key === j.type){
	   							if(buttonText == "RWH Capacity"){
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
				  		if(buttonText == "RWH Type"){ 
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
	   					if (j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   						if(d.key === j.type){
	   							if(buttonText == "RWH Capacity"){
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
				  		if(buttonText == "RWH Type"){ 
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
				.style("opacity", 0.7);

				svg_map_rwh.selectAll(".rwh")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if(j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   							if(buttonText == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   				}else{
		   						return 0;
		   				}

   			        })
   			        .type(function(d){
				  		if(buttonText == "RWH Type"){ 
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
		.orient("left"));

	rwh_status.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h4 + ")")
		.call(d3.svg.axis()
		.scale(xStatusRWH)
		.orient("bottom")
		.tickFormat(function(d){return rwhStatus[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xStatusRWH.rangeBand());

	rwh_status.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 10)
		.attr("x",0 - (h4 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("font-weight", "bold")
		.style("letter-spacing", 1.1)
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
   			if(d.key == "Good"){
   				return "#2C7BB6";
   			}else if(d.key == "Damaged"){
   				return "#FDAE61";
   			}else if(d.key == "Destroyed"){
   				return "#D7191C";
   			}
   		})
   		.style("stroke", "black")
   		.style("stroke-width", 0)
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
			
			d3.select(this)
			.style("opacity", 1);

			svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if (j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   						if(d.key === j.status){
	   							if(buttonText == "RWH Capacity"){
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
				  		if(buttonText == "RWH Type"){ 
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
	   					if (j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   						if(d.key === j.status){
	   							if(buttonText == "RWH Capacity"){
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
				  		if(buttonText == "RWH Type"){ 
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
	   					if (j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   						if(d.key === j.status){
	   							if(buttonText == "RWH Capacity"){
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
				  		if(buttonText == "RWH Type"){ 
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
				.style("opacity", 0.7);

				svg_map_rwh.selectAll(".rwh")
					.attr("d", d3.svg.symbol()
				  	.size(function(j){
	   					if(j.year <= sliderRWH.value() & this.getAttribute("display") === "yes"){
	   							if(buttonText == "RWH Capacity"){
	   								return rwhSizeScale(j.Capacity);
	   							}else{
		   							return 50;
		   						}
		   				}else{
		   						return 0;
		   				}

   			        })
   			        .type(function(d){
				  		if(buttonText == "RWH Type"){ 
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

	d3.csv("/assets/data/rwh_cumulative_capacity.csv", function(data) {

		capacityData = data;
		//debugger;
		var lineCapacity = d3.svg.line()
		    			 .x(function(d) { return xlineRWH(d.year); })
		                 .y(function(d) { return ylineRWH(d.capacity); });

		rwh_capacity.append("path")
	      			.datum(data)
	      			.attr("class", "chartline")
	      			.attr("d", lineCapacity);

	  	rwh_capacity.append("g")
			 	.attr("class", "y axis")
				.call(d3.svg.axis()
					.scale(ylineRWH)
					.orient("left"));

		rwh_capacity.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0, " + h4 + ")")
				.call(d3.svg.axis()
					.scale(xlineRWH)
					.orient("bottom")
					.tickFormat(d3.format("d")));

		rwh_capacity.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin_line.left + 10)
				.attr("x",0 - (h4 / 2))
				.style("text-anchor", "middle")
				.style("font-size", "11px")
				.style("font-weight", "bold")
				.style("letter-spacing", 1.1)
				.text("Total RWH Capacity " + "(" + cubedMetres + ")");

		rwh_capacity.append("circle")
				.attr("cx", function(){
					return xlineRWH(2012);
				})
				.attr("cy", function(d){
					return ylineRWH(113989)
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
						   .text(numberWithCommas(Math.round(ylineRWH.invert(this.getAttribute("cy"))) + " " + cubedMetres));

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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SliderUpdateRWH(){
	sliderRWH.on("slide", function(evt, value){

		if(value < 2013) d3.select('#slidertextRWH').text(value);

		svg_map_rwh.selectAll(".rwh")
				.attr("d", d3.svg.symbol()
				  	.size(function(d){
				  		if(d.year <= value){
					  		if(buttonText != "RWH Capacity"){
					  			return 50;
					  		} else{
					  			return rwhSizeScale(parseInt(d.Capacity));
					  		}
					  	}else{
					  		return 0;
					  	}
					 })
					.type(function(d){
				  		if(buttonText == "RWH Type"){ 
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

		rwhTypes = countRWH('type', value)
		rwh_type.selectAll("rect")
			    .data(rwhTypes)
				.transition()
				.duration(300)
				.attr("y", function(d){
		   			return yTypeRWH(d.count);
		   		})
		   		.attr("height", function(d) {
		   			return h4 - yTypeRWH(d.count);
		   		});	
		
		rwhStatus = countRWH('status', value)
		rwh_status.selectAll("rect")
			    .data(rwhStatus)
				.transition()
				.duration(300)
				.attr("y", function(d){
		   			return yStatusRWH(d.count);
		   		})
		   		.attr("height", function(d) {
		   			return h4 - yStatusRWH(d.count);
		   		});

		d3.select("#total-capacity")
			.transition()
			.duration(300)
			.attr("cx", function(){
				return xlineRWH(value);
			})
			.attr("cy", function(){
				for (var i = 0; i <= capacityData.length; i++) {
					if(capacityData[i].year == value){
							return ylineRWH(capacityData[i].capacity);
						}
				}
			});
	});
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

drawFeaturesRWH();
drawRWH();
updateLegendRWH(rwhTypeScale);
activateButtonsRWH();