/************************
*************************
****** Location Map *****
*************************
************************/

mapboxgl.accessToken = 'pk.eyJ1IjoiYmF0Y2gyMSIsImEiOiJQUDEzTDBzIn0.49sCQ1PnCzCwXO1L8w51Ug';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
    center: [78.6757, 18.9209], // starting position
    zoom: 3.8 // starting zoom
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYmF0Y2gyMSIsImEiOiJQUDEzTDBzIn0.49sCQ1PnCzCwXO1L8w51Ug';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/batch21/ciqw43rbk000bcbmbwohidax7', //stylesheet location
    center: [78.6757, 18.9209], // starting position
    zoom: 3.5 // starting zoom
});


map.addControl(new mapboxgl.Navigation());
map.scrollZoom.disable();

map.on('style.load', function() {
  map.addSource("villageBoundary", {
    "type": "geojson",
    "data": "/assets/data/dhone_area.json"
    });

	map.addLayer({
	    'id': 'revenue-village-boundary',
	    'type': 'line',
	    "minzoom": 4,
	    'source': 'villageBoundary',
	    'layout': {},
	    'paint': {
	        'line-color': 'black',
	    	'line-width': 2
	    } 
	   
	});
});

map.on('style.load', function() {
  map.addSource("villageAreas", {
    "type": "geojson",
    "data": "/assets/data/village_areas.json"
    });

	map.addLayer({
	    'id': 'village-boundary',
	    'type': 'line',
	    "minzoom": 5.5,
	    "maxzoom": 13.5,
	    'source': 'villageAreas',
	    'layout': {},
	    'paint': {
	        'line-color': 'red',
	    	'line-width': 1
	    } 
	   
	});

	map.addLayer({
	    'id': 'village-areas',
	    'type': 'fill',
	    "minzoom": 5.5,
	    "maxzoom": 13.5,
	    'source': 'villageAreas',
	    'layout': {},
	    'paint': {
	    	'fill-color': "#DF837D",
	        'fill-opacity': 0.5
	    } 
	   
	});

	map.addLayer({
	    'id': 'village-areas-hover',
	    'type': 'fill',
	    "minzoom": 5.5,
	    "maxzoom": 13.5,
	    'source': 'villageAreas',
	    'layout': {},
	    'paint': {
	    	'fill-color': "#DF837D",
	        'fill-opacity': 0.1
	    },
	    "filter": ["==", "name", ""] 
	   
	});

	map.on("mousemove", function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["village-areas"] });
        if (features.length) {
            map.setFilter("village-areas-hover", ["==", "name", features[0].properties.name]);
        } else {
            map.setFilter("village-areas-hover", ["==", "name", ""]);
        }
    });

});

map.on('style.load', function() {
  map.addSource("villageCentres", {
    "type": "geojson",
    "data": "/assets/data/dhone_village_centres.json"
    });

    map.addLayer({
	    "id": "labels",
	    "type": "symbol",
	    "source": "villageCentres",
	    "minzoom": 10,
	    "maxzoom": 12.6,
	    "layout": {
	        "text-field": "{name}",
	        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
	        "text-offset": [-2, -2],
	        "text-anchor": "top",
	        "text-size": 10,
	        "text-allow-overlap": true,
	        "text-letter-spacing": 0.1
	    },
	    "paint":{
	    	"text-halo-color": "#dddddd",
	    	"text-halo-width": 2,
	    	"text-halo-blur": 1
	    }
    });

});

var popup = new mapboxgl.Popup({closeOnClick: false, closeButton: false, anchor: 'right'})
    .setLngLat([77.81, 15.40])
    .setHTML('<p>Revenue Village</p>')
    .addTo(map);

//map.on("zoom", labelAddRemove)

function labelAddRemove(){
	if(map.getZoom() > 7){
		popup.remove();
	} else if(map.getZoom() < 7){
		popup.addTo(map);
	}
}

document.getElementById('villageZoom').addEventListener('click', function() {

	popup.remove();

	map.flyTo({

		center: [77.8271, 15.389],
        zoom: 11.5,
        bearing: 0,
        speed: 0.3,
        curve: 1.42


	});
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

var layerList = document.getElementById('location-menu');
var inputs = layerList.getElementsByTagName('input');


function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/batch21/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}


/*********************************
**********************************
***** Rainfall Visualisation *****
**********************************
**********************************/


// dimension of rainfall vis
var marginRain = {top: 10, right: 10, bottom: 40, left: 60},
	marginRain2 = {top: 45, right: 40, bottom: 75, left: 70},
    widthRain = 1100 - marginRain.left - marginRain.right,
    heightRain = 400 - marginRain.top - marginRain.bottom;
    heightRain2 = 400 - marginRain2.top - marginRain2.bottom,
    widthRain2 = 1100 - marginRain2.left - marginRain2.right;

var minRain = 0,
    maxRain = 550,
    zoomed = false,
    annualRainfall,
    labels = false,
    dailyRainfall;

//create monthly rainfall svg
var svgRainBox = d3.select("#rainfall-mon-box").append("svg")
	.attr("width", widthRain + marginRain.left + marginRain.right)
	.attr("height", heightRain + marginRain.top + marginRain.bottom)
	.attr("class", "box rainfallSVG")    
	.append("g")
	.attr("transform", "translate(" + marginRain.left + "," + marginRain.top + ")");


// Monthley rainfall vis
 d3.csv("/assets/data/dhone_rainfall_monthly.csv", function(error, csv) {
 	
 	//setup data strucutre to use boxplot library
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

    // push csv data into data structure
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

	//create scale and axis for boxplot
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
		.orient("bottom")
		.outerTickSize(0);

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


    //add hover interactivity
    d3.selectAll(".b").on("mouseover", function(d){

    	d3.select(this).selectAll(".box").style("fill", "#55d0f1");
    	d3.select(this).selectAll(".outlier").style("fill", "#55d0f1");

    	if(Math.round(d[1].quartiles[1]) > 0){
	    	d3.select(this).append("text")
			    			.attr("class", "stats")
			    			.attr("x", 37)
			    			.attr("y", yRainBox(d[1].quartiles[1]))
			    			.text(function(){
			    				return Math.round(d[1].quartiles[1]) + " mm"
			    			});
			}
;	
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
		
    	var outliers = d3.selectAll(d3.select(this).selectAll(".outlier"));
    	var outliers = outliers[0][0].reverse();

    	if(outliers.length > 0){
    		var position = parseInt(outliers[0].getAttribute("cy")) - 50; 
    	}

		for (var i = 0; i < outliers.length; i++) {
			if((position - parseInt(outliers[i].getAttribute("cy"))) < - 5 || outliers.length == 1){
					d3.select(this).append("text")
									.attr("class", "stats")
									.attr("x", Math.round(outliers[i].getAttribute("cx")) + 10)
									.attr("y", Math.round(outliers[i].getAttribute("cy")))
									.text(Math.round(yRainBox.invert(outliers[i].getAttribute("cy"))) + " mm")

			}
			position = parseInt(outliers[i].getAttribute("cy"))
		}		

    })
    .on("mouseout", function(d){

    	d3.select(this).selectAll(".box").style("fill", "#4DBAD9");
    	d3.select(this).selectAll(".outlier").style("fill", "none");

    	d3.selectAll(".stats").remove();

    })

    //create zoom button
    var zoomButton = svgRainBox.append("rect")
			.attr("class", "zoom")
			.attr("width", 80)
			.attr("height", 30)
			.attr("x", 10)
			.attr("y", 0)
			.attr("rx", "5px")
			.attr("ry", "5px")
			.style("stroke", "black")
			.style("stroke-width", 1.1)
			.style("filter", "url(#drop-shadow)");

	var zoomText = svgRainBox.append("text")
							.attr("x", 50)
							.attr("y", 22)
							.attr("text-anchor", "middle")
							.attr("pointer-events", "none")
							.style("font-size", "16px")
							.text("Zoom In");

	// add zoom functionality							
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

//create svg for annual rainfall chart		
var svgRainAnn = d3.select("#rainfall-ann").append("svg")
	.attr("width", widthRain + marginRain.left + marginRain.right)
	.attr("height", heightRain + marginRain.top + marginRain.bottom)
	.attr("class", "box rainfallSVG")    
	.append("g")
	.attr("transform", "translate(" + marginRain.left + "," + marginRain.top + ")");

// create annual rainfall chart
d3.csv("/assets/data/dhone_rainfall_annual.csv", function(error, csv) {

	annualRainfall = csv;

	var xRainAnn = d3.scale.ordinal()	   
		.domain(d3.range(csv.length))	    
		.rangeRoundBands([0 , widthRain], 0.2, 0.2); 		

	var yRainAnn = d3.scale.linear()
		.domain([0, 1400])
		.range([heightRain, 0]);
    
	var xAxisAnn = d3.svg.axis()
		.scale(xRainAnn)
		.orient("bottom")
		.outerTickSize(0)
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
   					  .attr("x", parseInt(this.getAttribute("x")) + 15)
   					  .attr("y", parseInt(this.getAttribute("y")) + 15)
   					  .attr("class", "tooltip")
   					  .text(function(){
   					  	return Math.round(barData.total_rainfall);
   					  })
   					  .style("text-anchor", "middle")
   					  .style("font-size", "12px")
   					  .style("font-weight", "bold");

   			d3.select(this).style("fill", "#55d0f1")
   		})
   		.on("mouseout", function(d){
   			svgRainAnn.selectAll(".tooltip").remove();
   			d3.select(this).style("fill", "#4DBAD9")
   		});

   	svgRainAnn.append("line")
   			  .attr("class", "avLine")
   			  .attr("x1", 0)
   			  .attr("x2", widthRain)
   			  .attr("y1", yRainAnn(613))
   			  .attr("y2", yRainAnn(613));

   	d3.selectAll(".avLine").on("mouseover", function(){
   		d3.select(this).style("stroke-width", 5)
   					   .style("opacity", 1);
   		svgRainAnn.append("text")
   				  .attr("id", "avRainfall")
   				  .attr("x", widthRain/10)
   				  .attr("y", this.getAttribute("y1") - 5)
   				  .text("Average: 613 mm");

   	})
   	.on("mouseout", function(){
   		d3.select(this).style("stroke-width", 3)
   						.style("opacity", 0.8);
   		d3.select("#avRainfall").remove();
   	})		



});

//create svg for daily rainfall chart
var svgRD = d3.select("#rainfall-daily").append("svg")
	.attr("width", widthRain2 + marginRain2.left + marginRain2.right)
	.attr("height", heightRain2 + marginRain2.top + marginRain2.bottom)
	.attr("class", "box rainfallSVG")    
	
var svgRainDaily = 	svgRD.append("g")
						 .attr("transform", "translate(" + marginRain2.left + "," + marginRain2.top + ")");

//create daily rainfall chart
d3.csv("/assets/data/dhone_rainfall_daily.csv", function(error, csv) {

    var rainTotals = d3.nest()
				    	.key(function(d) {
				        	return d.water_year;
				        })
				        .key(function(d){
				        	return d.Month;
				        })
				    	.rollup(function(csv) {

				        	var count = d3.sum(csv, function(d) {
				            	return Math.round(d.Rainfall);
				        	});
				        	return count;
				   		 })
				    	.entries(csv);

    for (var i = 0; i < rainTotals.length; i++) {
    	var month = rainTotals[i].values;
    	var total = 0;
    	for (var j = 0; j < month.length; j++) {
    		total += month[j].values;
    	}
    	rainTotals[i]["annualTotal"] = Math.round(total);
    }

    rainTotals = rainTotals.reverse();

	var months = ["June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May"]
	var legendAmounts = [10, 25, 100, 250];
	
	var xDayScale = d3.scale.linear()
						.domain([1, 366])
						.range([5, 950]);

	var xAxisDaily = d3.svg.axis()
							.scale(xDayScale)
							.orient("bottom")
							.tickValues([1, 50, 100, 150, 200, 250, 300, 350]);

	var yDailyScale = d3.scale.ordinal()
						.domain(["97/98", "98/99", "99/00", "00/01", "01/02", "02/03", "03/04", "04/05", "05/06", "06/07", "07/08"])
						.rangeRoundBands([heightRain2, 0], 0, 0.2);

	var yAxisDaily = d3.svg.axis()
						.innerTickSize(-950)
						.outerTickSize(0)
					    .scale(yDailyScale)
					    .orient("left");

	var radiusScale = d3.scale.linear()
						.domain([0, 15.70986951])
						.range([0, 15]);

	var xMonthScale = d3.scale.ordinal()
							  .domain(months)
							  .rangeRoundBands([5, 950]);	

	var xAxisMonth = d3.svg.axis()
							.scale(xMonthScale)
							.orient("top")
							.outerTickSize(0)
							.innerTickSize(5);

	var zoomScale = d3.scale.ordinal()
							  .domain(months)
							  .range([[1, 30], [31, 61], [62, 92], [93, 122], [123, 153], [154, 183], [184, 214], [215, 245], [246, 274], [274, 305], [305, 335], [335, 366]]);	

	var xScaleDayMonth = d3.scale.linear()
						.domain([0, 32])
						.range([0, 950]);


	var xAxisDayMonth = d3.svg.axis()
							.scale(xScaleDayMonth)
							.orient("bottom")
							.outerTickSize(0)
							.tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);					

	var totals = svgRD.append("g")
							 .attr("transform", "translate(" + 1030 + "," + 35 + ")")

	totals.append("text")
		  .attr("x", "5px")
		  .attr("y", "12px")
		  .style("font-weight", "bold")
		  .style("font-size", "16px")
		  .style("text-decoration", "underline")
		  .text("Total")

	var rTotals = totals.selectAll("g")
					  .data(rainTotals)
					  .enter()
					  .append("g")
					  .append("text")
					  .attr("y", function(d, i){
					  		return 34 + (i * 24) + "px";
					  })
					  .attr("x", "5px")
					  .text(function(d){
					  	return d.annualTotal + " mm";
					  })
					  .style("font-size", "12px");					

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
		        .attr("x", (1000 / 2) )
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
					return yDailyScale(d.water_year) + 12;
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

	svgRainDaily.append("rect")
				.attr("width", 78)
				.attr("height", 280)
				.attr("x", 950)
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

				rTotals.transition()
					   .duration(1000)
					   .text(function(d){
					  		return d.annualTotal + " mm";
					  	})

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

				rTotals.transition()
					   .duration(1000)
				       .text(function(d){
							for (var i = 0; i < d.values.length; i++) {
								if(d.values[i].key == month){
									return d.values[i].values + " mm";
								}
							}
						});

			}		

		

		})

	svgRainDaily.append("text")
				.attr("x", widthRain2/2 + 220)
				.attr("y", heightRain2 + 60)
				.style("font-size", "20px")
				.style("font-weight", "bold")
				.style("fill", "#737373")
				.text("Click on months to zoom in/out");

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


/*****************************
******************************
***** Well visualisation *****
******************************
*****************************/

var startYear = 1980,
	step = startYear,
	sliderStatus = "paused",
	scrollTrig = true,
	yearDuration = 1000,
	buttonText = "Well Depth",
	interval, 
	wellData,
	wellCircles,
	lineData,
	wellTrig;

// define slider
var slider = d3.slider().axis(d3.svg.axis().ticks(33).tickSize(6).tickFormat(d3.format(".0d"))).min(startYear).max(2012).value(startYear).step(1);
d3.select('#slider').call(slider);

// Define Widths and heights and margins for well vis
var margin_map = {top: 5, right: 10, bottom: 5, left: 10},
	margin_bar = {top: 10, right: 5, bottom: 22, left: 40},
	margin_chart = {top: 15, right: 0, bottom: 18, left: 50},
	margin_line = {top: 15, right: 20, bottom: 18, left: 65};
var w = 520 - margin_map.left - margin_map.right,
	w2 = 280 - margin_bar.left - margin_bar.right,
	w3 = 615 - margin_line.left - margin_line.right,
	w4 = 310 - margin_bar.left - margin_bar.right,
	w5 = 300 - margin_bar.left - margin_bar.right,
    h = 550 - margin_map.top - margin_map.bottom,
    h2 = 180 - margin_bar.top - margin_bar.bottom,
    h3 = 275 - margin_chart.top - margin_chart.bottom,
    h4 = 270 - margin_chart.top - margin_chart.bottom;


// Define map projection
var projection = d3.geo.transverseMercator()
      				   .rotate([-77.8095, -15.391, 0])
      				   .translate([w/2, h/2])
      				   .scale(330000);


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
var dem_scale = d3.scale.linear().domain([390, 620]).range([0, 135]);


//create well svg
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
		.attr("width", 500)
		.attr("height", 540);


//create legends
var legend = d3.select("#legend").append("svg")
	   .attr("id", "legendSVG")
	   .attr("width", 165)
	   .attr("height", 200)
       .append("g")
       .attr("id", "legendBox")


dem_legend = legend.append("g")
	   				.attr("width", 135)
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
				        .attr("width", 135)
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
	.text("Study Area")
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
	   .attr("width", 165)
	   .attr("height", 25)
       
legendLanduse.append("text")
       .text("Show Landuse")
       .attr("x", 35)
       .attr("y", 18)
       .style("font-weight", "bold")
       .style("text-decoration", "underline");

// create land use legend when box is checked
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

//main function to draw geojson features
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

// draws wells and activates animation buttons	
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
								//debugger;
								var info = svg_map.append("svg")
											   .attr("class", "tooltip")
											   .attr("height", 66)
											   .attr("width", 145)
											   .attr("x", function(){
											   		if(d.lon <= 77.83){
											   	  		return projection([d.lon, d.lat])[0] - 20
											   	  	}else{
											   	  		return projection([d.lon, d.lat])[0] - 100
											   	  	}
											   })
											   .attr("y", function(){
											   	  return projection([d.lon, d.lat])[1] - 68
											   })
											   .append("g");

								info.append("rect")
									.attr("class", "wellInfoBox")
									.attr("height", 64)
									.attr("width", 143)
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
										return "Depth: " + d.depth + " metres";
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
								d3.select(this).attr("r", 3)
								d3.select('.tooltip').remove();
							});



		createCharts();
		sliderActivate();

		d3.select("#well-viz .glyphicon").attr("title", "Play Animation");
		d3.select(".playPause button").on("click", function(){
			if(sliderStatus === "finished"){
				step = startYear - 1;
				d3.select(".playPause span").classed("glyphicon", false)
								  			.attr("class", "glyphicon glyphicon-pause");
				sliderStatus = "playing";
				d3.select("#well-viz .glyphicon").attr("title", "Pause Animation");
				scrollTrig = false;
				animate();
			}else if (sliderStatus === "paused"){
				d3.select(".playPause span").classed("glyphicon", false)
								  			.attr("class", "glyphicon glyphicon-pause");
				sliderStatus = "playing";
				d3.select("#well-viz .glyphicon").attr("title", "Pause Animation");
				scrollTrig = false;
				animate();
			} else{
				clearInterval(interval);
				d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-play");
				sliderStatus = "paused";
				d3.select("#well-viz .glyphicon").attr("title", "Play Animation");
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

	});

}

// updates well legend	
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


//creates buttons for well characteristics
function createButtons(){

	d3.select("#wellDepthButton").style("background-color", "#FAE9BD")
							   	 .style("border-width", "1px");

	d3.selectAll(".buttonWells")
		.on("mouseover", function(){
			d3.select(this).style("opacity", 1)
						   .style("border-width", "2px")
						   .style("margin", " 0px 4px 0px 0px");
		})
		.on("mouseout", function(){
			d3.select(this).style("opacity", 0.95)
						   .style("border-width", "1px")
						   .style("margin", "1px 5px 1px 1px");
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
			.attr("width", w4 + margin_chart.left + margin_chart.right)
			.attr("height", h3 + margin_chart.top + margin_chart.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

var svg_avDep = d3.select("#well-viz-chart5").append("svg")
			.attr("width", w4 + margin_chart.left + margin_bar.right)
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
				  .range([0, w4])
				  .domain([1970, 2013]);
var yline = d3.scale.linear()
				  .range([h3, 0])
				  .domain([0, 600]);

var xAvDep = d3.scale.linear()
				  .range([0, w4])
				  .domain([1970, 2013]);
var yAvDep= d3.scale.linear()
				  .range([h3, 0])
				  .domain([0, 50]);

//creates bar charts
function createCharts(){		

	// Group data and define scale domains for type bar chart using complete dataset
	var wellTypes = countWells("type", 2012);
	xType.domain(d3.range(wellTypes.length))
	yType.domain([0, 280])

	svg_type.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yType)
		.orient("left")
		.innerTickSize(-w2)
		.outerTickSize(0)
		.tickValues([40, 80, 120, 160, 200, 240, 280]));

	svg_type.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xType)
		.orient("bottom")
		.innerTickSize(0)
		.outerTickSize(0)
		.tickFormat(function(d){return wellTypes[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xType.rangeBand());

	svg_type.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 15)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
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
   		.style("stroke", "black")
   		.style("stroke-width", 0)
   		.on("mouseover", function(d){

				if(sliderStatus != "playing"){
					d3.select(this)
					.style("fill",function(d){
			   			if(d.key == "Open Well"){
			   				return "#b9ea48"
			   			}else if(d.key == "Agricultural Borewell"){
			   				return "#4a8d0c"
			   			}else if(d.key == "Domestic Borewell"){
			   				return "#996c1a"
			   			}
			   		});

					svg_map.selectAll(".well")
					.attr("r", function(j){
		   				if (j.year <= slider.value() && this.getAttribute("display") == "yes"){
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

					d3.selectAll(".well-viz-charts .bar").attr("selected", "no")
							.style("stroke-width", 0)

					d3.select(this).attr("selected", "yes")
						.style("stroke-width", 3)

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
						d3.selectAll(".well-viz-charts .bar").attr("selected", "no")
							.style("stroke-width", 0)

						svg_map.selectAll(".well")
							.attr("display", "yes")
							.attr("r", function(j){
								if(this.getAttribute("display") === "yes" && j.year <= slider.value()){
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
				.style("fill", function(d){
		   			if(d.key == "Open Well"){
		   				return "#C4ED68"
		   			}else if(d.key == "Agricultural Borewell"){
		   				return "#59A80F"
		   			}else if(d.key == "Domestic Borewell"){
		   				return "#ba831f"
		   			}
		   		});

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
	
	svg_depth.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yDepth)
		.orient("left")
		.innerTickSize(-w2)
		.outerTickSize(0)
		.tickValues([40, 80, 120, 160, 200, 240, 280]));

	svg_depth.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xDepth)
		.orient("bottom")
		.innerTickSize(0)
		.outerTickSize(0)
		.tickFormat(function(d){return wellDepths[d].key;}));

	svg_depth.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 15)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
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
   		.style("stroke", "black")
   		.style("stroke-width", 0)
   		.on("mouseover", function(d){
				if(sliderStatus != "playing"){
					d3.select(this)
					.style("fill", function(d){
			   			if(d.key === "0 - 10 m"){
			   				return "#aac2d4";
			   			} else if (d.key === "10 - 50 m"){
			   				return "#4b9ece";
			   			} else if (d.key === "50 - 100 m"){
			   				return "#1c5d97";
			   			} else if(d.key === "100 m +"){
			   				return "#052047";
			   			}
			   		});

					svg_map.selectAll(".well")
					.attr("r", function(j){
		   				if (j.year <= slider.value() && this.getAttribute("display") === "yes"){
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

					d3.selectAll(".well-viz-charts .bar").attr("selected", "no")
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
					d3.selectAll(".well-viz-charts .bar").attr("selected", "no")
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
		   		});

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
		.innerTickSize(-w2)
		.outerTickSize(0)
		.tickValues([40, 80, 120, 160, 200, 240, 280]));

	svg_status.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xStatus)
		.orient("bottom")
		.innerTickSize(0)
		.outerTickSize(0)
		.tickFormat(function(d){return wellStatus[d].key;}))
		.selectAll(".tick text")
		.call(wrap, xStatus.rangeBand());

	svg_status.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 15)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
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
   		.style("stroke", "black")
   		.style("stroke-width", 0)
   		.on("mouseover", function(d){
				if(sliderStatus != "playing"){
					d3.select(this)
					.style("fill", function(d){
			   			if(d.key === "Defunct"){
			   				return "#60394d"
			   			} else if(d.key === "Fails every summer"){
			   				return "#b66449"
			   			} else if(d.key === "Fails during droughts"){
			   				return "#f7bc6e"
			   			} else if(d.key === "Has never failed"){
			   				return "#ffec99"
			   			}
			   		});

					svg_map.selectAll(".well")
					.attr("r", function(j){
		   				if (j.year <= slider.value() && this.getAttribute("display") === "yes"){
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

					d3.selectAll(".well-viz-charts .bar").attr("selected", "no")
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
					d3.selectAll(".well-viz-charts .bar").attr("selected", "no")
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
		   		});

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

//creates line charts
function addLineChart(){

	d3.csv("/assets/data/dhone_wells_year_totals.csv", function(data) {

		lineData = data;

      	svg_line.append("g")
			 	.attr("class", "y axis")
				.call(d3.svg.axis()
					.scale(yline)
					.orient("left")
					.innerTickSize(-w4)
					.outerTickSize(0)
					.tickValues([100, 200, 300, 400, 500, 600]));

		svg_line.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0, " + h3 + ")")
				.call(d3.svg.axis()
					.scale(xline)
					.orient("bottom")
					.outerTickSize(0)
					.tickFormat(d3.format("d"))
					.tickValues([1970, 1980, 1990, 2000, 2010]));

		svg_line.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin_chart.left + 25)
				.attr("x", 0 - (h3 / 2))
				.style("text-anchor", "middle")
				.style("font-size", "14px")
				.style("font-weight", "bold")
				.style("letter-spacing", "1.8px")
				.text("Number of Wells");

		var lineTotal = d3.svg.line()
	    			 .x(function(d) { return xline(d.year); })
	                 .y(function(d) { return yline(d.cumTotal); });

	    svg_line.append("path")
      			.datum(data)
      			.attr("class", "chartline")
      			.attr("d", lineTotal)

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
							.attr("stroke", "#800000")
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


      	svg_avDep.append("g")
			 	.attr("class", "y axis")
				.call(d3.svg.axis()
					.scale(yAvDep)
					.orient("left")
					.innerTickSize(-w4)
					.outerTickSize(0)
					.tickValues([10, 20, 30, 40, 50]));

		svg_avDep.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0, " + h3 + ")")
				.call(d3.svg.axis()
					.scale(xAvDep)
					.orient("bottom")
					.tickFormat(d3.format("d"))
					.outerTickSize(0)
					.tickValues([1970, 1980, 1990, 2000, 2010]));

		svg_avDep.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin_chart.left + 30)
				.attr("x",0 - (h3 / 2))
				.style("text-anchor", "middle")
				.style("font-size", "14px")
				.style("font-weight", "bold")
				.style("letter-spacing", "1.8px")
				.text("Average depth (metres)");

		var lineAv = d3.svg.line()
	    			 .x(function(d) { return xAvDep(d.year); })
	                 .y(function(d) { return yAvDep(d.cumAv); });

	    svg_avDep.append("path")
      			.datum(data)
      			.attr("class", "chartline")
      			.attr("d", lineAv)

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
							.attr("stroke", "#800000")
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

//update line chart marker 
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
				}else if(year == 2013){
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
				}else if(year == 2013){
					return yAvDep(49.7);
				}
			}
		});
}


// select wells by year
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

// slider interactions
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
			updateWells(value);
			updateLineChart(value);
			step = value;

		})
		.on("slideend", function(evt, value){
			if(value === 2013){
				sliderStatus = "finished";
				d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-repeat");
				d3.select("#well-viz .glyphicon").attr("title", "Replay Animation");
			}else if(sliderStatus === "playing"){
				animate();
			};
		})	
	

}

// wrap text for labels
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

//animate slider and update charts
function animate(){
	interval = setInterval(function(){ 

		step++;

		if (step === 2013){
			clearInterval(interval);
			updateWells(step);
			updateLineChart(step);
			sliderStatus = "finished";
			d3.select(".playPause span").classed("glyphicon", false)
								 			 .attr("class", "glyphicon glyphicon-repeat");
			d3.select("#well-viz .glyphicon").attr("title", "Replay Animation");
		}; 

		if(step <= 2012){
		   slider.value(step);	 
	       updateWells(step);
	       updateLineChart(step);
	       
		}
	}, yearDuration); 
}

//update wells by year
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
					} else if (d.year == year && sliderStatus === "playing"){
						return 8;
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


//animate vis on scroll
$(window).on("load", function(){
	$(window).on("scroll", function(){
		if( ($("#well-viz").offset().top - ($(window).scrollTop() + $(window).height())) < -($(window).height()/2) && scrollTrig && slider.value() < 2012){
			d3.select(".playPause span").classed("glyphicon", false)
												  			.attr("class", "glyphicon glyphicon-pause");
			sliderStatus = "playing";
			d3.select("#well-viz .glyphicon").attr("title", "Pause Animation");
			animate();
			scrollTrig = false;
		} 
	});	
});

//create well vis
function createWellVis(){
	drawFeatures();
	updateLegend(colorDepth);
	createButtons();
}

createWellVis();

/****************************
*****************************
***** RWH Visualisation *****
*****************************
****************************/

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