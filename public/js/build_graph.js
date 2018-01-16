importScripts("/js/d3.min.js");

onmessage = function(event) {
    var nodes = event.data.nodes,
        nodes2 = event.data.nodes2,
        links = event.data.links,
        width = event.data.width,
        height = event.data.height;

    nodes.forEach(link => {
        nodes2.forEach(link2 => {
            if(link.url == link2.url){
                link = link2
            }
        });
    });

    //проверка на ссылки без нод. Если нет ноды, она будет добавлена
    console.log('проверка на ссылки без нод');
    links.forEach(link => {
        let found = nodes.some(function (el) {
            return el.url == link.target;
        });

        if (!found) {
            nodes.push({
                contentType: null,
                url: link.target,
                redirectURL: null,
                create_date: null,
                update_date: null,
                status: null,
                bodySize: null,
                site: ""
            });

        }
    });


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