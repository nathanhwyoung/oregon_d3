var width = 900,
    height = 900;

var rateById = d3.map();

var quantize = d3.scale.quantize()
	// sets the range of numbers that come in
	// in the future, a max/min combo will be needed here
    .domain([0, 1])
    .range(d3.range(9).map(function(i) {
        return "q" + i + "-9";
    }));

var projection = d3.geo.albers()
    .scale(6000)
    .center([-25, 47.4]);
// .translate([width / 3, height / 3]);
// console.log(projection.center());

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "oregon.json")
    .defer(d3.tsv, "data.tsv", function(d) {
        rateById.set(d.id, +d.rate);
    })
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
            return quantize(rateById.get(d.id));
        })
        .attr("d", path)
        .style("stroke", "black")
        .style("stroke-width", "1")
        // .style('fill', function(d) {
        //     var randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        //     return randomColor;
        // })
        .attr("transform", "rotate(-15)");
		// this should allow the rate to popup, but only works with d.id
		// .append("title")
		// .text( function(d) { return d.rate });
}

d3.select(self.frameElement).style("height", height + "px");
