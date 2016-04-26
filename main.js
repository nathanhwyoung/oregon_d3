var width = 900,
	height = 900;

// Constructs a new map and declares it rateById. If object is specified, copies all enumerable properties
// from the specified object into this map. The specified object may be an array.
// An optional key function may be specified to compute the key for each value in the array.
// this is A MAP FUNCTION
var rateById = d3.map();

// creates a QUANTIZED scale that applies one of ten css classes based on input
// this results in one of ten colors being used to fill in the counties color
// this has a DISCRETE (10 classes) domain, rather than continious
// EXAMPLE:
// var q = d3.scale.quantize().domain([0, 1]).range(['a', 'b', 'c']);
//q(0.3) === 'a', q(0.4) === 'b', q(0.6) === 'b', q(0.7) ==='c';
 //q.invertExtent('a') returns [0, 0.3333333333333333]
var quantize = d3.scale.quantize()
	.domain([0, .15])
	.range(d3.range(9).map(function(i) {
		return "q" + i + "-9";
	}));

var projection = d3.geo.albersUsa()
	.scale(1280);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("body").append("svg");



// A queue evaluates zero or more deferred asynchronous tasks with configurable
// concurrency: you control how many tasks run at the same time. When all the
// tasks complete, or an error occurs, the queue passes the results to your await callback.
// https://github.com/d3/d3-queue
// To run multiple tasks simultaneously, create a queue, defer your tasks, and
// then register an await callback to be called when all of the tasks complete (or an error occurs):
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
		// Returns the GeoJSON Feature or FeatureCollection for the specified object
		// in the given topology. If the specified object is a GeometryCollection,
		// a FeatureCollection is returned, and each geometry in the collection is
		// mapped to a Feature. Otherwise, a Feature is returned.
		.data(topojson.feature(oregon, oregon.objects.tl_2015_us_county_STATEFP__41).features)
		.enter()
		.append("path")
		.attr("class", function(d) {
			// console.log(d);
			// console.log(quantize(rateById.get(d.id)));
			return quantize(rateById.get(d.id));
		})
		.attr("d", path)
		.style("stroke", "green")
		.style("stroke-width", "1")
		.attr("transform", "rotate(-15)");
}

d3.select(self.frameElement).style("height", height + "px");
