
var data = {"nodes":[
           {"name": "River Flow", "color": "#5063af"},
           {"name": "Diversion 1", "color": "#5063af"},
           {"name": "Diversion 2", "color": "#5063af"},
           {"name": "Outflow", "color": "#5063af"},
           {"name": "Upstream Farmers", "color": "#6ac96c"},
           {"name": "Downstream Farmers", "color": "#6ac96c"},
           {"name": "Water Use", "color": "#704c0b"}     
           ],
           "links":[
           {"source":"River Flow","target":"Diversion 1","value":100, "color": "#336dcc"},  
           {"source":"Diversion 1","target":"Diversion 2","value":60, "color": "#336dcc"},
           {"source":"Diversion 1","target":"Upstream Farmers","value":40, "color": "#7faaef"},
           {"source":"Upstream Farmers","target":"Water Use","value":20, "color": "#9b601b"},
           {"source":"Upstream Farmers","target":"Diversion 2","value":20, "color": "#7faaef"},
           {"source":"Diversion 2","target":"Downstream Farmers","value":40, "color": "#7faaef"},
           {"source":"Diversion 2","target":"Outflow","value":40, "color": "#336dcc"},
           {"source":"Downstream Farmers","target":"Outflow","value":20, "color": "#7faaef"},
           {"source":"Downstream Farmers","target":"Water Use","value":20, "color": "#9b601b"},
           ]};


var dispatch = d3.dispatch("update-efficiency", "update-area", "update-efr");
var current_efficiency = 50;
var current_abstraction = 40;
var current_efr = 20;


var margin = {top: 20, right: 50, bottom: 20, left: 10}, 
    width = 850 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var svg = d3.select("#sankey")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
   .attr("fill", "none")
   .attr("stroke", "#9ea0a3")
   .attr("stroke-width", 1)
   .attr("x", -margin.left)
   .attr("y", -margin.top)
   .attr("height", height + margin.bottom + margin.top)
   .attr("width", width + margin.left + margin.right);

var sankey = d3.sankey()
               .nodeId(function id(d){
                  return d.name
                })
               .nodeWidth(15)
               .nodePadding(50)
               .extent([[25, 75], [width - 50, height - 150]])
               .iterations([0]);
               

var links = svg.append("g")
              .attr("class", "links")
              .attr("fill", "none")
              .attr("stroke-opacity", 0.8)
              .selectAll("path");


var node = svg.append("g")
              .attr("class", "nodes")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .selectAll("g");


var node = svg.append("g")
              .selectAll(".node")
              .data(data.nodes)
              .enter()
              .append("g")
              .attr("class", "node");


sankey(data)

// Manually reposition nodes
data.nodes[4].y0 = data.nodes[4].y0 + 200;
data.nodes[4].y1 = data.nodes[4].y1 + 200;
data.nodes[5].y0 = data.nodes[5].y0 + 125;
data.nodes[5].y1 = data.nodes[5].y1 + 125;
data.nodes[6].y0 = data.nodes[6].y0 + 75;
data.nodes[6].y1 = data.nodes[6].y1 + 75;
sankey.update(data)

links = links.data(data.links)
           .enter()
           .append("path")
           .attr("d", d3.sankeyLinkHorizontal())
           .attr("stroke", function(d){
              return d.color;
            })
           .attr("stroke-width", function(d) {return Math.max(1, d.width); });


node.append("rect")
    .attr("x", function(d) { return d.x0; })
    .attr("y", function(d) { return d.y0; })
    .attr("height", function(d) { return d.y1 - d.y0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .attr("fill", function(d) { 
      return d.color;
    })
    .attr("stroke", function(d){
      return "#757575"; 
    });

var node_labels = node.append("text")
                      .attr("transform", function(d){
                        return "translate(" + (d.x0 + 20) + "," + (d.y0 + Math.abs(d.y1 - d.y0)/2) +")";
                      })
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "start")
                      .classed("node-label", true)
                      .html(function(d) { 
                        if(d.name.indexOf("Farmers") !== -1){         
                          return "<tspan x='0' dy='-0.2em'>" + d.name.split(" ")[0] + "</tspan>" + 
                                 "<tspan x='0' dy='1.2em'>" + d.name.split(" ")[1] + "</tspan>"
                        }else{
                          return d.name; 
                        }
                      });

var outflow_deficit_label = add_deficit_label(3)
var d_farmers_deficit_label = add_deficit_label(5)

function add_deficit_label(idx){
  /** adds an initially hidden deficit label to a node that is specified by its index **/
  var label = d3.select(node.nodes()[idx])
                .append("text")
                .attr("transform", function(d){
                  return "translate(" + (d.x0 - 10) + "," + (d.y0 + Math.abs(d.y1 - d.y0)/2) +") rotate(-90)";
                })
                .attr("text-anchor", "middle")
                .attr("opacity", 0)
                .classed("deficit-label", true)
                .text("Deficit!")

  return label
}


dispatch.on("update-efficiency", function(value){
  
  current_efficiency = value;

  data.links[3]["value"] =  data.links[2]["value"] * (value/100);
  data.links[4]["value"] =  data.links[2]["value"] - data.links[3]["value"];
 
  data.links[6]["value"]  = data.links[4]["value"] + data.links[1]["value"] - data.links[5]["value"];

  if(current_abstraction > (data.links[1]["value"] + data.links[4]["value"])){

    data.links[5]["value"] = data.links[1]["value"] + data.links[4]["value"];
    data.links[6]["value"] = 0;
    data.links[6]["color"] = "white"; 
    data.nodes[5]["color"] = "#ba3535";
    d_farmers_deficit_label.attr("opacity", 1)

  }else{
    data.links[6]["color"] = "#336dcc";
    data.nodes[5]["color"] = "#6ac96c";
    d_farmers_deficit_label.attr("opacity", 0)
  }

  data.links[8]["value"] =  data.links[5]["value"] * (value/100);
  data.links[7]["value"] =  data.links[5]["value"] - data.links[8]["value"];
  
  update_sankey()
  
})


area_scale = d3.scaleLinear()
               .domain([0, 100])
               .range([20, 80]);


dispatch.on("update-area", function(value){

  current_abstraction = area_scale(value)

  data.links[1]["value"] = 100 - current_abstraction;
  data.links[2]["value"] = current_abstraction;
  data.links[3]["value"] = current_abstraction * (current_efficiency/100);
  data.links[4]["value"] = current_abstraction - data.links[3]["value"] ;

  if(current_abstraction > (data.links[1]["value"] + data.links[4]["value"])){
    data.links[5]["value"] = data.links[1]["value"] + data.links[4]["value"];
    data.links[6]["value"] = 0;
    data.links[6]["color"] = "white"; 
    data.nodes[5]["color"] = "#ba3535";
    d_farmers_deficit_label.attr("opacity", 1)
  } else{
    data.links[5]["value"] = current_abstraction;
    data.links[6]["value"] = data.links[1]["value"] + data.links[4]["value"] - current_abstraction;
    data.links[6]["color"] = "#336dcc";
    data.nodes[5]["color"] = "#6ac96c";
    d_farmers_deficit_label.attr("opacity", 0)
  }

  data.links[8]["value"] = data.links[5]["value"] * (current_efficiency/100);
  data.links[7]["value"] = data.links[5]["value"] - data.links[8]["value"] ;
  
  update_sankey()

})


function update_sankey(){
  /*** update sankey diagram after data has been updated ***/

  sankey(data)

  // Manually reposition nodes 
  data.nodes[4].y0 = data.nodes[4].y0 + 200;
  data.nodes[4].y1 = data.nodes[4].y1 + 200;
  data.nodes[5].y0 = data.nodes[5].y0 + 125;
  data.nodes[5].y1 = data.nodes[5].y1 + 125;
  data.nodes[6].y0 = data.nodes[6].y0 + 75;
  data.nodes[6].y1 = data.nodes[6].y1 + 75;
  sankey.update(data)

  links.transition()
       .duration(500)
       .attr("d", d3.sankeyLinkHorizontal())
       .attr("stroke", function(d){
         return d.color;
       })
       .attr("stroke-width", function(d) {return Math.max(1, d.width); });

  node.selectAll('rect')
      .transition()
      .duration(500)
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", function(d) { 
        return d.color;
      });

  
  node_labels.transition()
             .duration(500)
             .attr("transform", function(d){
               return "translate(" + (d.x0 + 20) + "," + (d.y0 + Math.abs(d.y1 - d.y0)/2) +")";
             });

  d_farmers_deficit_label.transition()
                         .duration(500)
                         .attr("transform", function(d){
                           return "translate(" + (d.x0 - 10) + "," + (d.y0 + Math.abs(d.y1 - d.y0)/2) +") rotate(-90)";
                         })
 
}


function create_slider(id, dispatch_event, title, slider_height, start, end, init_val, symbol, arrows){
  // modified from this code: https://bl.ocks.org/mbostock/6452972

  var svg = d3.select(id)

  var svg = d3.select("#" + id)
              .append("svg")
              .attr("height", slider_height)
              .attr("width", width + margin.left + margin.right);

  var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + slider_height / 2 + ")");

  var x = d3.scaleLinear()
      .domain([start, end])
      .range([0, width])
      .clamp(true);

  slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true)); 
        })
        .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(d3.drag().on("drag", function() { 
            move(x.invert(d3.event.x)); 
        }));

  if(arrows){

  slider.append("line")
        .attr("x1", 100)
        .attr("x2", width - 100)
        .attr("y1", 20)
        .attr("y2", 20)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow-end)")
        .attr("marker-start", "url(#arrow-start)");

  slider.append("text")
        .attr("x", 15)
        .attr("y", 25)
        .classed("slider-label", true)
        .text("Smaller")

  slider.append("text")
        .attr("x", width - 75)
        .attr("y", 25)
        .classed("slider-label", true)
        .text("Larger")

  }else{

  slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) {
          return d + symbol;
        });

  }
  
  slider.append("text")
        .attr("x", width/2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .classed("slider-title", true)
        .text(title);

  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("cx", width/2);

  function move(h) {
    handle.attr("cx", x(h))
    dispatch.call(dispatch_event, this, h);
  }
  
  return slider
}


create_slider("slider2", "update-efficiency", "Water Efficiency", 70, 20, 80, current_efficiency, "%", false);
create_slider("slider1", "update-area", "Irrigated Area", 70, 0, 100, current_abstraction, "", true)
//create_slider("slider3", "update-efr", "Environmental Flow Requirement", 60, 0, 50, current_efr, "", true)


var defs = svg.append("defs")

defs.append("marker")
    .attr("id", "arrow-end")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class","arrowHead");

defs.append("marker")
    .attr("id", "arrow-start")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M10,-5L0,0L10,5")
      .attr("class","arrowHead");

