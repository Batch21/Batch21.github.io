var marginRain = {top: 10, right: 10, bottom: 40, left: 60},
	marginRain2 = {top: 45, right: 40, bottom: 75, left: 70},
    widthRain = 1100 - marginRain.left - marginRain.right,
    heightRain = 400 - marginRain.top - marginRain.bottom;
    heightRain2 = 400 - marginRain2.top - marginRain2.bottom,
    widthRain2 = 1100 - marginRain2.left - marginRain2.right;

var minRain = 0,
    maxRain = 650,
    zoomed = false,
    annualRainfall;

var labels = false; 

var svgRainBox = d3.select("#rainfall-mon-box").append("svg")
	.attr("width", widthRain + marginRain.left + marginRain.right)
	.attr("height", heightRain + marginRain.top + marginRain.bottom)
	.attr("class", "box rainfallSVG")    
	.append("g")
	.attr("transform", "translate(" + marginRain.left + "," + marginRain.top + ")");

 d3.csv("/assets/data/dhone_rainfall_monthly.csv", function(error, csv) {

 	var data = [];
	data[0] = [];
	data[1] = [];
	data[2] = [];
	data[3] = [];
	data[4] = [];
	data[5] = [];
	data[6] = [];
	data[7] = [];
	data[8] = [];
	data[9] = [];
	data[10] = [];
	data[11] = [];


	data[0][0] = "Jan";
	data[1][0] = "Feb";
	data[2][0] = "Mar";
	data[3][0] = "Apr";
	data[4][0] = "May";
	data[5][0] = "Jun";
	data[6][0] = "Jul";
	data[7][0] = "Aug";
	data[8][0] = "Sep";
	data[9][0] = "Oct";
	data[10][0] = "Nov";
	data[11][0] = "Dec";

	data[0][1] = [];
	data[1][1] = [];
	data[2][1] = [];
	data[3][1] = [];
	data[4][1] = [];
	data[5][1] = [];
	data[6][1] = [];
	data[7][1] = [];
	data[8][1] = [];
	data[9][1] = [];
	data[10][1] = [];
	data[11][1] = [];

	csv.forEach(function(x) {

		var v1 = Math.floor(x[1]),
			v2 = Math.floor(x[2]),
			v3 = Math.floor(x[3]),
			v4 = Math.floor(x[4]);
			v5 = Math.floor(x[5]),
			v6 = Math.floor(x[6]),
			v7 = Math.floor(x[7]),
			v8 = Math.floor(x[8]);
			v9 = Math.floor(x[9]),
			v10 = Math.floor(x[10]),
			v11 = Math.floor(x[11]),
			v12 = Math.floor(x[12]);

		data[0][1].push(v1);
		data[1][1].push(v2);
		data[2][1].push(v3);
		data[3][1].push(v4);
		data[4][1].push(v5);
		data[5][1].push(v6);
		data[6][1].push(v7);
		data[7][1].push(v8);
		data[8][1].push(v9);
		data[9][1].push(v10);
		data[10][1].push(v11);
		data[11][1].push(v12);

	});
	
	var chart = d3.box()
		.whiskers(iqr(1.5))
		.height(heightRain)	
		.domain([minRain, maxRain])
		.showLabels(labels);

	var xRainBox = d3.scale.ordinal()	   
		.domain( data.map(function(d) {return d[0] } ) )	    
		.rangeRoundBands([0 , widthRain], 0.6, 0.3); 		

	var yRainBox = d3.scale.linear()
		.domain([minRain, maxRain])
		.range([heightRain, 0]);
    
	var xAxisRain = d3.svg.axis()
		.scale(xRainBox)
		.orient("bottom");

    var yAxisRain = d3.svg.axis()
						.innerTickSize(-widthRain)
						.outerTickSize(0)
					    .scale(yRainBox)
					    .orient("left");

	svgRainBox.append("g")
		    .attr("class", "y axis")
		    .call(yAxisRain)
			.append("text") 
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - marginRain.left + 20)
			.attr("x",0 - (heightRain / 2))
			.style("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-weight", "bold")
			.style("letter-spacing", 1.2)
			.text("Rainfall (mm)");	

	svgRainBox.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (heightRain) + ")")
      .call(xAxisRain)
	  .append("text")          
      .attr("x", (widthRain / 2) )
      .attr("y",  40)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("letter-spacing", 1.2) 
      .text("Month");

    svgRainBox.selectAll(".box")	   
      .data(data)
	  .enter().append("g")
	  .attr("class", "b")
	  .attr("transform", function(d) { return "translate(" +  xRainBox(d[0])  + "," + 0 + ")"; } )
      .call(chart.width(xRainBox.rangeBand()));



    d3.selectAll(".b").on("mouseover", function(d){
    	//debugger;	
    	d3.select(this).selectAll(".box").style("fill", "#55d0f1");
    	d3.select(this).selectAll(".outlier").style("fill", "#55d0f1");

    	if(Math.round(d[1].quartiles[1]) > 0){
	    	d3.select(this).append("text")
			    			.attr("class", "stats")
			    			.attr("x", 30)
			    			.attr("y", yRainBox(d[1].quartiles[1]))
			    			.text(function(){
			    				return Math.round(d[1].quartiles[1]) + " mm"
			    			});
			}
		//debugger;	
    	if(Math.round(yRainBox.invert(d3.select(this).selectAll(".whisker")[0][0].getAttribute("y2"))) > 0){
	    	d3.select(this).append("text")
	    			.attr("class", "stats")
	    			.attr("x", d3.select(this).selectAll(".whisker")[0][0].getAttribute("x2"))
	    			.attr("y", d3.select(this).selectAll(".whisker")[0][0].getAttribute("y2"))
	    			.text(Math.round(yRainBox.invert(d3.select(this).selectAll(".whisker")[0][0].getAttribute("y2"))) + " mm");
	    	}

	    d3.select(this).append("text")
    			.attr("class", "stats")
    			.attr("x", d3.select(this).selectAll(".whisker")[0][1].getAttribute("x2"))
    			.attr("y", d3.select(this).selectAll(".whisker")[0][1].getAttribute("y2"))
    			.text(Math.round(yRainBox.invert(d3.select(this).selectAll(".whisker")[0][1].getAttribute("y2"))) + " mm");
    	//debugger;		
    	var outliers = d3.selectAll(d3.select(this).selectAll(".outlier"))
    	//debugger;
		
		for (var i = 0; i < outliers[0][0].length; i++) {

					d3.select(this).append("text")
									.attr("class", "stats")
									.attr("x", Math.round(outliers[0][0][i].getAttribute("cx")) + 5)
									.attr("y", function(d){
										if((Math.max.apply(Math, d[1]) - Math.min.apply(Math, [100,13,3,6])) > 100){
											return Math.round(outliers[0][0][i].getAttribute("cy"))
										} else{
											return Math.round(outliers[0][0][i].getAttribute("cy")) +(i * -5)
										}
									})
									.text(Math.round(yRainBox.invert(outliers[0][0][i].getAttribute("cy"))) + " mm")
				}		

    })
    .on("mouseout", function(d){

    	d3.select(this).selectAll(".box").style("fill", "#4DBAD9");
    	d3.select(this).selectAll(".outlier").style("fill", "none");

    	d3.selectAll(".stats").remove();

    })

    var zoomButton = svgRainBox.append("rect")
			.attr("class", "zoom")
			.attr("width", 90)
			.attr("height", 30)
			.attr("x", 10)
			.attr("y", 0)
			.style("stroke", "black")
			.style("stroke-width", 1.1)
			.style("filter", "url(#drop-shadow)");

	var zoomText = svgRainBox.append("text")
							.attr("x", 55)
							.attr("y", 22)
							.attr("text-anchor", "middle")
							.attr("pointer-events", "none")
							.style("font-size", "16px")
							.text("Zoom In");

	d3.select(".zoom").on("mouseover", function(){
		zoomButton.style("stroke-width", 2)
				  .style("fill", "#d3d3d3")
		zoomText.style("font-weight", "bold");
	})
	.on("mouseout", function(){
		zoomButton.style("stroke-width", 1.1)
				  .style("fill", "#DDDDDD")
		zoomText.style("font-weight", "normal");
	})
	.on("click", function(){
		if(!zoomed){
			zoomed = true;		
			 yRainBox.domain([0, 305]);
			 yAxisRain.scale(yRainBox);
			 svgRainBox.select("g.y.axis").transition()
									 .duration(1000)
									 .call(yAxisRain);
			 chart.domain([0, 305]);
			 svgRainBox.selectAll(".b").call(chart.width(xRainBox.rangeBand()));
			 zoomText.text("Zoom Out");
		}else{
			zoomed = false;		
			 yRainBox.domain([0, 650]);
			 yAxisRain.scale(yRainBox);
			 svgRainBox.select("g.y.axis").transition()
									 .duration(1000)
									 .call(yAxisRain);
			 chart.domain([0, 650]);
			 svgRainBox.selectAll(".b").call(chart.width(xRainBox.rangeBand()));
			 zoomText.text("Zoom In");

		}		 
	})
	
 });

 function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}

var defs = svgRainBox.append("defs");

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 1)
    .attr("dy", 1)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

		
var svgRainAnn = d3.select("#rainfall-ann").append("svg")
	.attr("width", widthRain + marginRain.left + marginRain.right)
	.attr("height", heightRain + marginRain.top + marginRain.bottom)
	.attr("class", "box rainfallSVG")    
	.append("g")
	.attr("transform", "translate(" + marginRain.left + "," + marginRain.top + ")");


d3.csv("/assets/data/dhone_rainfall_annual.csv", function(error, csv) {

	annualRainfall = csv;

	var xRainAnn = d3.scale.ordinal()	   
		.domain(d3.range(csv.length))	    
		.rangeRoundBands([0 , widthRain], 0.2, 0.2); 		

	var yRainAnn = d3.scale.linear()
		.domain([0, 1500])
		.range([heightRain, 0]);
    
	var xAxisAnn = d3.svg.axis()
		.scale(xRainAnn)
		.orient("bottom")
		.tickFormat(function(d){
	    	return annualRainfall[d].water_year;
		});
		
    var yAxisAnn = d3.svg.axis()
						.innerTickSize(-widthRain)
						.outerTickSize(0)
					    .scale(yRainAnn)
					    .orient("left")
					    .ticks(15);


	svgRainAnn.append("g")
			  .attr("class", "y axis")
			  .call(yAxisAnn)
		      .append("text") 
			  .attr("transform", "rotate(-90)")
		      .attr("y", 0 - marginRain.left + 20)
			  .attr("x",0 - (heightRain / 2))
			  .style("text-anchor", "middle")
			  .style("font-size", "16px")
			  .style("font-weight", "bold")
			  .style("letter-spacing", 1.2)
			  .text("Rainfall (mm)");	

	svgRainAnn.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + (heightRain) + ")")
		      .call(xAxisAnn)
			  .append("text")          
		      .attr("x", (widthRain / 2) )
		      .attr("y",  35)
		      .style("text-anchor", "middle")
		      .style("font-size", "16px")
		      .style("font-weight", "bold")
		      .style("letter-spacing", 1.2) 
		      .text("Year (June - May)");

	svgRainAnn.selectAll("rect")
   		.data(annualRainfall)		
   		.enter()
   		.append("rect")
   		.attr("x", function(d, i) {
   			return xRainAnn(i);
   		})
   		.attr("y", function(d){
   			return yRainAnn(d.total_rainfall);
   		})
   		.attr("width", xRainAnn.rangeBand())
   		.attr("height", function(d) {
   			return heightRain - yRainAnn(d.total_rainfall);
   		})
   		.style("fill", "#4DBAD9")
   		.on("mouseover", function(d){
   			var barData = d;

   			svgRainAnn.append("text")
   					  .attr("x", parseInt(this.getAttribute("x")) + 28)
   					  .attr("y", parseInt(this.getAttribute("y")) + 15)
   					  .attr("class", "tooltip")
   					  .text(function(){
   					  	return Math.round(barData.total_rainfall);
   					  })
   					  .style("text-anchor", "middle")
   					  .style("font-size", "14px")
   					  .style("font-weight", "bold");

   			d3.select(this).style("fill", "#55d0f1")
   		})
   		.on("mouseout", function(d){
   			svgRainAnn.selectAll(".tooltip").remove();
   			d3.select(this).style("fill", "#4DBAD9")
   		});	



});

var svgRainDaily = d3.select("#rainfall-daily").append("svg")
	.attr("width", widthRain2 + marginRain2.left + marginRain2.right)
	.attr("height", heightRain2 + marginRain2.top + marginRain2.bottom)
	.attr("class", "box rainfallSVG")    
	.append("g")
	.attr("transform", "translate(" + marginRain2.left + "," + marginRain2.top + ")");

d3.csv("/assets/data/dhone_rainfall_daily.csv", function(error, csv) {

	var months = ["June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May"]
	var legendAmounts = [10, 25, 100, 250];
	
	var xDayScale = d3.scale.linear()
						.domain([1, 366])
						.range([5, widthRain2]);

	var xAxisDaily = d3.svg.axis()
							.scale(xDayScale)
							.orient("bottom")
							.tickValues([1, 50, 100, 150, 200, 250, 300, 350]);

	var yDailyScale = d3.scale.ordinal()
						.domain(["96/97", "97/98", "98/99", "99/00", "00/01", "01/02", "02/03", "03/04", "04/05", "05/06", "06/07", "07/08"])
						.rangeRoundBands([heightRain2, 0], 0, 0.2);

	var yAxisDaily = d3.svg.axis()
						.innerTickSize(-widthRain2)
						.outerTickSize(0)
					    .scale(yDailyScale)
					    .orient("left");

	var radiusScale = d3.scale.linear()
						.domain([0, 15.70986951])
						.range([0, 15]);

	var xMonthScale = d3.scale.ordinal()
							  .domain(months)
							  .rangeRoundBands([5, widthRain2]);	

	var xAxisMonth = d3.svg.axis()
							.scale(xMonthScale)
							.orient("top")
							.innerTickSize(5);

	var zoomScale = d3.scale.ordinal()
							  .domain(months)
							  .range([[1, 30], [31, 61], [62, 92], [93, 122], [123, 153], [154, 183], [184, 214], [215, 245], [246, 274], [274, 305], [305, 335], [335, 366]]);	

	var xScaleDayMonth = d3.scale.linear()
						.domain([0, 32])
						.range([0, widthRain2]);


	var xAxisDayMonth = d3.svg.axis()
							.scale(xScaleDayMonth)
							.orient("bottom")
							.tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);					

	var legendDaily = svgRainDaily.append("svg")
	   .attr("id", "legendDaily")
	   .attr("width", 300)
	   .attr("height", 40)
	   .attr("x", 0)
	   .attr("y", heightRain2 + 33)
       .append("g")

    legendDaily.append("rect")
    		   .attr("width", 298)
    		   .attr("height", 38)
    		   .attr("x", 1)
    		   .attr("y", 1)
    		   .style("fill", "#f0f0f0");

    legendDaily.selectAll("circle")
    		   .data(legendAmounts)
    		   .enter()
    		   .append("circle")
    		   .attr("cy", 20)
    		   .attr("cx", function(d, i){
    		   		return 5 + (i * 50) + (radiusScale(Math.sqrt(d)) * 5); 
    		   })
    		   .attr("r", function(d){
    		   		//debugger;
    		   		return radiusScale(Math.sqrt(d));
    		   })
    		   .style("opacity", 0.5)
			   .style("stroke", "none");

	legendDaily.selectAll("text")
			   .data(legendAmounts)
			   .enter()
			   .append("text")
			   .attr("x", function(d, i){
			   		return 12 + (i * 50) + (radiusScale(Math.sqrt(d)) * 5) + radiusScale(Math.sqrt(d)) 
			   })
			   .attr("y", 25)
			   .text(function(d){
			   	return d + " mm"
			   })

	svgRainDaily.append("g")
		        .attr("class", "x axis months")
		        .attr("transform", "translate(0," + -10  + ")")
		        .call(xAxisMonth);

	svgRainDaily.append("g")
		        .attr("class", "x axis days")
		        .attr("transform", "translate(0," + (heightRain2 + 7)  + ")")
		        .call(xAxisDaily)
		        .append("text")          
		        .attr("x", (widthRain2 / 2) )
		        .attr("y",  35)
		        .style("text-anchor", "middle")
		        .style("font-size", "16px")
		        .style("font-weight", "bold")
		        .style("letter-spacing", 1.2) 
		        .text("Day");		

	svgRainDaily.selectAll("circle")
				.data(csv)
				.enter()
				.append("circle")
				.attr("class", "rainfallCircles")
				.attr("cx", function(d){
					return xDayScale(d.year_day);
				})
				.attr("cy", function(d){
					return yDailyScale(d.water_year) + 11;
				}).
				attr("r", function(d){
					return radiusScale(Math.sqrt(d.Rainfall));
				})
				.style("opacity", 0.5)
				.style("stroke", "none")
				.on("mouseover", function(d){

					var day = d;
					var point = this;
	
					d3.select(this).style("fill", "#FF8B3F")
								   .style("stroke",  "c3c3c3");

					svgRainDaily.append("rect")
								.attr("class", "svgTooltip")
								.attr("width", 122)
								.attr("height", 48)
								.attr("x", parseInt(this.getAttribute("cx")) - 78)
								.attr("y", parseInt(this.getAttribute("cy")) - parseInt(this.getAttribute("r")) -  50);

					svgRainDaily.append("text")
								.attr("class", "svgTooltip")
								.attr("x", parseInt(this.getAttribute("cx")) - 73)
								.attr("y", parseInt(this.getAttribute("cy")) - parseInt(this.getAttribute("r")) - 30)
								.text(function(d){
									return day.date
								});

					svgRainDaily.append("text")
								.attr("class", "svgTooltip")
								.attr("x", parseInt(this.getAttribute("cx")) - 73)
								.attr("y", parseInt(this.getAttribute("cy")) - parseInt(this.getAttribute("r"))- 10)
								.text(function(d){
									return "Rainfall: " + day.Rainfall + " mm"
								});
			
				})
				.on("mouseout", function(d){
					d3.select(this).style("fill", "#4DBAD9")
									.style("stroke", "none");

					svgRainDaily.selectAll(".svgTooltip").remove();
				});

	svgRainDaily.append("rect")
				.attr("width", 70)
				.attr("height", 280)
				.attr("x", -70)
				.attr("y", -5)
				.style("stroke", "none")
				.style("fill", "white");

	svgRainDaily.append("g")
		  .attr("class", "y axis")
		  .call(yAxisDaily)
		  .append("text")
		  .attr("transform", "rotate(-90)")
	      .attr("y", 0 - marginRain2.left + 20)
		  .attr("x",0 - (heightRain2 / 2))
		  .style("text-anchor", "middle")
		  .style("font-size", "16px")
		  .style("font-weight", "bold")
		  .style("letter-spacing", 1.2)
		  .text("Year (June - May)");

	var selectedMonth;

	d3.select("#rainfall-daily").selectAll(".x .tick text")
		.on("mouseover", function(d){
			var month = d;
			d3.select(this).style("text-decoration", "underline");
			svgRainDaily.selectAll(".rainfallCircles").style("fill", function(d){
				if(d.Month == month){
					return "#FF8B3F";
				}else{
					return "#4DBAD9";
				}
			})

		})
		.on("mouseout", function(d){
			d3.select(this).style("text-decoration", "none");
			svgRainDaily.selectAll(".rainfallCircles").style("fill", "#4DBAD9");
		})
		.on("click", function(d){
		
			var month = d;

			svgRainDaily.selectAll(".rainfallCircles").style("fill", "#4DBAD9");
			
			if(month == selectedMonth){

				d3.select("#rainfall-daily").selectAll(".months text").transition()
																   .duration(1000)
																   .attr("y", -8)
																   .style("font-size", "14px")
						       									   .style("font-weight", "normal")
						       									   .style("fill", "black");

				xDayScale.domain([1, 366]);
				selectedMonth = null; 

				svgRainDaily.selectAll(".rainfallCircles")
						.transition()
						.duration(1500)
						.attr("cx", function(d){
							return xDayScale(d.year_day);
						})
						.attr("r", function(d){
							return radiusScale(Math.sqrt(d.Rainfall));
						});

				svgRainDaily.select(".x.axis.days").transition()
												   .duration(1500)
												   .call(xAxisDaily);

			}else{ 

				d3.select("#rainfall-daily").selectAll(".months text").transition()
																   .duration(1000)		
																   .attr("y", function(d){
																   	   if(d != month){
																   	   		return -5;
																   	   }else{
																   	   	return -15;
																   	   } 
																   })
																   .style("font-size", function(d){
																   		if(d != month){
																   			return "10px";
																   		}else {
																   			return "20px";
																   		}
																   })
						       									   .style("font-weight", function(d){
						       									   		if (d != month){
						       									   			return "normal";
							       									   	} else{
							       									   		return "bold";
							       									   	}
						       									   })
						       									   .style("fill", function(d){
						       									   		if(d != month){
						       									   			return "#adadad";
						       									   		}else{
						       									   			return "black";
						       									   		}
						       									   });
	       									   	

				svgRainDaily.selectAll(".rainfallCircles")
						.attr("r", function(d){
							return radiusScale(Math.sqrt(d.Rainfall));
						});

				xDayScale.domain(zoomScale(month));

				selectedMonth = month;

				svgRainDaily.selectAll(".rainfallCircles")
						.transition()
						.duration(1500)
						.attr("cx", function(d){
							if(d.Month == month){ 
								return xScaleDayMonth(d.Day);
							}else{
								return xDayScale(d.year_day)
							}
						})
						
				svgRainDaily.selectAll(".rainfallCircles")
							.transition()
							.delay(1500)
							.duration(0)
							.attr("r", function(d){
								if(d.Month == month){
									return radiusScale(Math.sqrt(d.Rainfall));
								}else{
									return 0;
								}
						    });

				svgRainDaily.select(".x.axis.days").transition()
													.duration(1500)
													.call(xAxisDayMonth);

			}		

		

		})


	svgRainDaily.append("rect")
				.attr("class", "instructions")
				.attr("height", 40)
				.attr("width", 250)
				.attr("x", widthRain2/2 + 160)
				.attr("y", heightRain2 + 33);
				
	svgRainDaily.append("text")
				.attr("x", widthRain2/2 + 190)
				.attr("y", heightRain2 + 60)
				.style("font-size", "16px")
				.style("font-weight", "bold")
				.text("Click on months to zoom in")



});




d3.select("#rainfall-selection-left").attr("class", "selected rainfall-selection")
									 .style("background-color", "white")
									 .style("bottom", "-1px");
d3.selectAll("#rainfall-charts > div").style("display", "none")
									  .style("opacity", 0);
d3.select("#rainfall-ann").attr("class", "selected")
						  .style("display", "block")
						  .style("opacity", 1);




d3.selectAll(".rainfall-selection").on("mouseover", function(){
				d3.select(this).style("font-weight", "bold");
			})
			.on("mouseout", function(){
				d3.select(this).style("font-weight", "normal");
			})
			.on("click", function(){

				d3.select("#rainfall-selection-right").style("border-right", "0px");
				d3.selectAll(".rainfall-selection").style("background-color", "#e8e8e8")
													.style("bottom", "0px");

				d3.select(this).style("background-color", "white")
								.style("bottom", "-1px");

				if(this.getAttribute("id") == "rainfall-selection-right"){
					d3.select(this).style("border-right", "1px solid #a8a8a8");	
				}

				if(this.getAttribute("class") !=  "selected rainfall-selection"){
					d3.selectAll(".rainfall-selection").attr("class", "rainfall-selection");
					d3.select(this).attr("class", "selected rainfall-selection")
					d3.selectAll("#rainfall-charts .selected").classed("selected", false)
														   .style("opacity", 0);
					d3.selectAll("#rainfall-charts > div").style("display", "none");

					if(this.textContent == "Monthly Rainfall"){
						d3.select("#rainfall-mon-box").attr("class", "selected")
														.style("display", "block")
														.transition()
														.duration(800)
														.style("opacity", 1); 
					}else if(this.textContent == "Annual Rainfall"){
						d3.select("#rainfall-ann").attr("class", "selected")
														.style("display", "block")
														.transition()
														.duration(800)
														.style("opacity", 1); 
					}else if(this.textContent == "Daily Rainfall"){
						d3.select("#rainfall-daily").attr("class", "selected")
														.style("display", "block")
														.transition()
														.duration(800)
														.style("opacity", 1); 
					}
				}	
			});