var startYearRWH = 2012,
	rwhData,
	buttonText = "RWH Type",
	cubedMetres = " m³";

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
						.range(["#BDBBC4", "#5D9CA5", "#A70D1F"])

var rwhStatusScale = d3.scale.ordinal()
						.domain(["Destroyed", "Damaged", "Good"])
						.range(["#D7191C", "#FDAE61", "#2C7BB6"])

var rwhSizeScale = d3.scale.linear()
						.domain([50, 500, 1000, 10000, 40000])
						.range([50, 106.28, 167.49, 1268.53, 5000])



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
									  			return 150;
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
									  			return 150;
									  		}else{
									  			return rwhSizeScale(d.Capacity);
									  		}
									  	})
									  	.type(function(d){
									  		if(buttonText != "RWH Capacity"){	
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
	  			totalCircleRadii += Math.sqrt(rwhSizeScale(d)/Math.PI);
	  			var height = 25;
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
				return d + cubedMetres;
			}
		})
		.style("font-size", "12px");

	height = document.getElementById("legendBoxRWH").getBBox().height;	
	width = document.getElementById("legendBoxRWH").getBBox().width;
	d3.select("#legendSVG_RWH").attr("height", height + 15).attr("width", width + 5);
	}

function createButtonsRWH(){

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


drawFeaturesRWH();
drawRWH();
updateLegendRWH(rwhTypeScale);
createButtonsRWH()