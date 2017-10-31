importScripts("/js/d3.min.js");

onmessage = function(event) {
    var nodes = event.data.nodes,
        links = event.data.links,
        width = event.data.width,
        height = event.data.height;

    var simulation = d3
        .forceSimulation()
        .force("link", d3.forceLink()
            .distance(200)
            .strength(0.6)
            .id(
                (d) => {
                    return d.url;
                }
            )
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .stop();

    simulation
        .nodes(nodes);

    simulation.force("link")
        .links(links);

    simulation.alphaTarget(1);
    for (var i = 0; i < 60; ++i) {
        simulation.tick()
    }

    postMessage({nodes: nodes, links: links});
};