var marginRain = {top: 10, right: 10, bottom: 40, left: 60},
    widthRain = 900 - marginRain.left - marginRain.right,
    heightRain = 400 - marginRain.top - marginRain.bottom;

var minRain = 0,
    maxRain = 650,
    zoomed = false;

var labels = false; 

var svgRain = d3.select("#rainfall-mon-box").append("svg")
	.attr("width", widthRain + marginRain.left + marginRain.right)
	.attr("height", heightRain + marginRain.top + marginRain.bottom)
	.attr("class", "box")    
	.append("g")
	.attr("transform", "translate(" + marginRain.left + "," + marginRain.top + ")");

 d3.csv("/assets/data/rainfall_monthly.csv", function(error, csv) {

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

	var xRain = d3.scale.ordinal()	   
		.domain( data.map(function(d) {return d[0] } ) )	    
		.rangeRoundBands([0 , widthRain], 0.7, 0.3); 		

	var yRain = d3.scale.linear()
		.domain([minRain, maxRain])
		.range([heightRain, 0]);
    
	var xAxisRain = d3.svg.axis()
		.scale(xRain)
		.orient("bottom");

    var yAxisRain = d3.svg.axis()
						.innerTickSize(-widthRain)
						.outerTickSize(0)
					    .scale(yRain)
					    .orient("left");

	svgRain.append("g")
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

	svgRain.append("g")
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

    svgRain.selectAll(".box")	   
      .data(data)
	  .enter().append("g")
	  .attr("class", "b")
	  .attr("transform", function(d) { return "translate(" +  xRain(d[0])  + "," + 0 + ")"; } )
      .call(chart.width(xRain.rangeBand())); 

    d3.selectAll(".b").on("mouseover", function(d){
    	//debugger;	
    	d3.select(this).selectAll(".box").style("fill", "#6fa3a8");
    	d3.select(this).selectAll(".outlier").style("fill", "#6fa3a8");

    	if(Math.round(d[1].quartiles[1]) > 0){
	    	d3.select(this).append("text")
			    			.attr("class", "stats")
			    			.attr("x", 22)
			    			.attr("y", yRain(d[1].quartiles[1]))
			    			.text(function(){
			    				return Math.round(d[1].quartiles[1]) + " mm"
			    			});
			}
		//debugger;	
    	if(Math.round(yRain.invert(d3.select(this).selectAll(".whisker")[0][0].getAttribute("y2"))) > 0){
	    	d3.select(this).append("text")
	    			.attr("class", "stats")
	    			.attr("x", d3.select(this).selectAll(".whisker")[0][0].getAttribute("x2"))
	    			.attr("y", d3.select(this).selectAll(".whisker")[0][0].getAttribute("y2"))
	    			.text(Math.round(yRain.invert(d3.select(this).selectAll(".whisker")[0][0].getAttribute("y2"))) + " mm");
	    	}

	    d3.select(this).append("text")
    			.attr("class", "stats")
    			.attr("x", d3.select(this).selectAll(".whisker")[0][1].getAttribute("x2"))
    			.attr("y", d3.select(this).selectAll(".whisker")[0][1].getAttribute("y2"))
    			.text(Math.round(yRain.invert(d3.select(this).selectAll(".whisker")[0][1].getAttribute("y2"))) + " mm");
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
									.text(Math.round(yRain.invert(outliers[0][0][i].getAttribute("cy"))) + " mm")
				}		

    })
    .on("mouseout", function(d){

    	d3.select(this).selectAll(".box").style("fill", "#8CCDD3");
    	d3.select(this).selectAll(".outlier").style("fill", "none");

    	d3.selectAll(".stats").remove();

    })

    var zoomButton = svgRain.append("rect")
			.attr("class", "zoom")
			.attr("width", 90)
			.attr("height", 30)
			.attr("x", 10)
			.attr("y", 0)
			.style("stroke", "black")
			.style("stroke-width", 1.1)
			.style("filter", "url(#drop-shadow)");

	var zoomText = svgRain.append("text")
							.attr("x", 55)
							.attr("y", 22)
							.attr("text-anchor", "middle")
							.attr("pointer-events", "none")
							.style("font-weight", "bold")
							.style("font-size", "18px")
							.text("Zoom In");

	d3.select(".zoom").on("mouseover", function(){
		zoomButton.style("stroke-width", 2)
				  .style("fill", "#c5c5c5");
	})
	.on("mouseout", function(){
		zoomButton.style("stroke-width", 1.1)
				  .style("fill", "#DDDDDD");
	})
	.on("click", function(){
		if(!zoomed){
			zoomed = true;		
			 yRain.domain([0, 350]);
			 yAxisRain.scale(yRain);
			 svgRain.select("g.y.axis").transition()
									 .duration(1000)
									 .call(yAxisRain);;
			 chart.domain([0, 350]);
			 svgRain.selectAll(".b").call(chart.width(xRain.rangeBand()));
			 zoomText.text("Zoom Out");
		}else{
			zoomed = false;		
			 yRain.domain([0, 650]);
			 yAxisRain.scale(yRain);
			 svgRain.select("g.y.axis").transition()
									 .duration(1000)
									 .call(yAxisRain);
			 chart.domain([0, 650]);
			 svgRain.selectAll(".b").call(chart.width(xRain.rangeBand()));
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

var defs = svgRain.append("defs");

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

d3.select("#rainfall-selection-right").attr("class", "selected rainfall-selection")
									 .style("background-color", "white")
									 .style("bottom", "-1px");
d3.select("#rainfall-mon-stats").attr("class", "selected");  



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
					d3.select("#rainfall-charts .selected").classed("selected", false)
														   .transition()
														   .duration(500)
														   .style("opacity", 0);
					d3.selectAll("#rainfall-charts > div").transition()
													   .duration(0)
													   .delay(500)
													   .style("display", "none");

					if(this.textContent == "Monthly Rainfall - Boxplot"){
						d3.select("#rainfall-mon-box").attr("class", "selected")
														.style("display", "block")
														.transition()
														.duration(500)
														.style("opacity", 1); 
					}
				}	

				//if(this.textContent == "Monthly Rainfall - Boxplot")
			});

//d3.select("#rainfall-vis").style("opacity", 0)
							//.style("display", "none");		

