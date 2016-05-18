var width = 900,
    height = 900;

var map = d3.map();

var quantize = d3.scale.quantize()
    // sets the range of numbers that come in
    // in the future, a max/min combo will be needed here
    .domain([0, 1])
    // defines
    .range(d3.range(9).map(function(i) {
		// for different datasets, could different css classes be applied?
        return "A" + i + "-9";
    }));

var projection = d3.geo.albers()
    .rotate([120, 0])
    .center([-0.7, 44.2])
    .scale(width * 9.5)
    .translate([width / 2, height / 2]);
// .scale(6000)
// .center([-25, 47.4]);
// .translate([width / 3, height / 3]);
// console.log(projection.center());

var path = d3.geo.path()
    .projection(projection);

// appends the svg element to the body element in the DOM
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var commodity = "Turkeys";
// var commodity = "Cattle";

queue()
    // performs the .defer tasks, and then calls the callback function passed to the .await function
    // in this instance, .defer() is being passed a function, as well as the file
    // references and anonymous function that get passed to that function
    .defer(d3.json, "oregon.json")
    // the data received from the data.tsv file, using the d3.tsv function - is
    // passed into an anonymous callback function and used in the map function
    .defer(d3.tsv, "data.tsv", function(d) {
		// FIGURE OUT WHAT map.set IS DOING HERE
        map.set(d.id, +d.rate);
		console.log(d.rate);
    })
	// .defer(d3.json, "http://api.cropcompass.org/data/nass_animals_inventory?commodity="+commodity, function(d) {
	// 	for(var i=0; i<d.length; i++) {
	// 		var
	// 	}
		// console.log(d.data[0].animals)
    //     map.set(d.id, +d.rate);
    // })
    .await(ready);

function ready(error, oregon) {
    if (error) throw error;

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(oregon, oregon.objects.tl_2015_us_county_STATEFP__41).features)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return quantize(map.get(d.id));
        })
        .attr("d", path)
        .style("stroke", "black")
        .style("stroke-width", "1");
        // .style('fill', function(d) {
            // var randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
            // return randomColor;
        // });
    // .attr("transform", "rotate(-15)");
}

d3.select(self.frameElement).style("height", height + "px");
