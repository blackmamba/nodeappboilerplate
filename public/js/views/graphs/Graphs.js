/*global window, define, Backbone, $, _, d3, lax, console*/
window.lax = window.lax || {};
define([
    // These are path alias that we configured in our bootstrap
    'd3' // lib/jquery/jquery
], function(d3) {
    "use strict";

    // Above we have passed in jQuery, Underscore and Backbone
    // They will not be accessible in the global scope
    var margin, x, y, width, height, format, parseDate, color, xAxis, yAxis,
        line, svg, attributes, attr, leg;
    var Graph = Backbone.View.extend({
        // initialize: function() {
        //     this.render();
        // },
        context: '',
        initialize: function(context) {
            // console.log("typeof lax.clicks: " + typeof lax.clicks);
            this.context = context || 'clicks';

            this.listenTo(lax.clicks, 'reset', this.render);
            margin = {
                top: 20,
                right: 100,
                bottom: 30,
                left: 50
            };
            width = 960 - margin.left - margin.right;
            height = 500 - margin.top - margin.bottom;

            // var parseDate = d3.time.format("%H").parse;
            format = d3.time.format.utc("%H:%M");
            parseDate = format.parse;
            x = d3.time.scale()
                .range([0, width]);


            y = d3.scale.linear()
                .range([height, 0]);

            color = d3.scale.category10();

            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(format);
            // .ticks(d3.time.day);
            //.tickValues([0,23]);
            // .tickSize(1);

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            line = d3.svg.line()
                .x(function(d) {
                    return x(d.created);
                })
                .y(function(d) {
                    return y(d.count);
                });

            // var line2 = d3.svg.line()
            //     .x(function(d) { return x(d.created); })
            //     .y(function(d) { return y(d.postback); });


            svg = d3.select(".graph").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        },
        switchContext: function(context) {
            if (!context) throw 'context required for setting a switching context';
            this.context = context;
        },
        getContext: function() {
            return this.context
        },
        render: function(clicks) {



            //data related stuff starts here
            var that = this;
            svg.selectAll("*").remove();
            d3.select(".graph ul").remove();
            var models = clicks.models;
            models.forEach(function(d) {
                //  // any pre processing that is required on data needs to be done here
                // d.created = parseDate(d.created);
                d.set('created', parseDate(d.get('created')));
            });


            color.domain(d3.keys(models[0].attributes).filter(function(key) {
                return key !== "created"
                    // key.indexOf(that.getContext()) > 0;
            }));
            attributes = color.domain().map(function(name) {
                return {
                    name: name,
                    values: lax.clicks.models.map(function(d) {
                        return {
                            created: d.get('created'),
                            count: d.get(name)
                        };
                    })
                };
            });
            x.domain(d3.extent(lax.clicks.models, function(d) {
                return d.get('created');
            }));
            y.domain([
                d3.min(attributes, function(d) {
                    return d3.min(d.values, function(v, i) {
                        return v.count;
                    });
                }),
                d3.max(attributes, function(d) {
                    return d3.max(d.values, function(v, i) {
                        return v.count;
                    });
                })
            ]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);



            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Count");

            attr = svg.selectAll(".attr")
                .data(attributes)
                .enter().append("g")
                .attr("class", "attr");

            attr.append("path")
                .attr("class", "line")
                .attr("d", function(d) {
                    return line(d.values);
                })
                .style("stroke", function(d) {
                    return color(d.name);
                });

            // att.on("mouseover", function(d) {
            //     d3.select(this).transition().duration(300).style("opacity", 1);
            //     div.transition().duration(300)
            //         .style("opacity", 1)
            //     div.text(pairNameWithId[d.id] + " : " + pairRateWithId[d.id])
            //         .style("left", (d3.event.pageX) + "px")
            //         .style("top", (d3.event.pageY - 30) + "px");
            // }).on("mouseout", function() {
            //     d3.select(this)
            //         .transition().duration(300)
            //         .style("opacity", 0.8);
            //     div.transition().duration(300)
            //         .style("opacity", 0);
            // })

            var texts = [];
            attr.append("text")
                .datum(function(d) {
                    return {
                        name: d.name,
                        value: d.values[d.values.length - 1]
                    };
                })
                .attr("transform", function(d) {
                    return "translate(" + x(d.value.created) + "," + y(d.value.count) + ")";
                })
                .attr("x", 3)
                .attr("dy", ".35em")
                .text(function(d) {
                    texts.push(d.name);
                    return d.name;

                });
            //creating legend



            // var sv = d3.select("svg"),
            var legend;
            leg = d3.select(".graph").append("ul").attr("class", "leg")
                .attr("transform", "translate(" + (width - 70) + "," + (margin.top) + ")")
                .attr("list-style-type", "none");
            legend = leg
                .selectAll("li.legend")
                .data(texts)
                .enter().append("li")
                .attr("class", "legend");


            // legend = sv.append("g")
            //     .attr("class", "leg")
            //     .attr("transform", "translate(" + (width - 70) + "," + (margin.top) + ")")
            // // .append("rect")
            // // .attr("width", 150)
            // // .attr("height", 150)
            // // .style("fill", "#fff")
            // // .attr("class", "leg-rec")
            // .selectAll("g.legend")
            //     .data(texts)
            //     .enter().append("g")
            //     .attr("class", "legend");

            // var ls_w = 20,
            //     ls_h = 20;

            legend.append("span")
            // .attr("x", 20)
            // .attr("y", function(d, i) {
            //     return height - (i * ls_h) - 2 * ls_h;
            // })
            // .style("display", "inline-block")
            // .attr("width", ls_w)
            // .attr("height", ls_h)
            .style("background-color", function(d, i) {
                return color(d);
            });

            // .style("opacity", 0.8);

            legend.append("span")
            // .attr("x", 50)
            // .attr("y", function(d, i) {
            //     return height - (i * ls_h) - ls_h - 4;
            // })
            .text(function(d, i) {
                return d;
                //legend_labels[i];
            });
        }

    });
    return Graph;
});
