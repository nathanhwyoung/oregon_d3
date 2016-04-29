var width = 900,
    height = 900;

var rateById = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) {
        return "q" + i + "-9";
    }));

var projection = d3.geo.albers()
    .scale(6000)
	.center([-25, 47.4]);
	// .translate([width / 3, height / 3]);
	console.log(projection.center());

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
        .style("stroke", "green")
        .style("stroke-width", "1")
        .attr("transform", "rotate(-15)");
}

d3.select(self.frameElement).style("height", height + "px");
