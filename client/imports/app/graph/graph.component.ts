import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import template from "./graph.component.html";
import style from "./graph.component.scss";
import {Url} from "../../../../both/models/url.model";
import {ObservableCursor} from "meteor-rxjs";
import * as d3 from "d3";
import {Page} from "../../../../both/models/page.model";
import {Subscription} from "rxjs/Subscription";

//todo: форма создания сайта-задачи для парсера +
//todo: кнопка включения-отключения задач +
//todo: сохранение распарсенных страниц в бд+
//todo: выгрузка компонента графа при загрузке другой страницы +
//todo: Выделять ноды цветом в зависимости от http статуса и факта распарсивания страницы +-
//todo: редактирование и удаление сайтов+
//todo: сделать фильтр, выводящий страницы по параметрам+
//todo: оптимизация скорости загрузки данных+
//todo: симуляция графа на сервере либо в web worker+
//todo: двигать тултип вместо пересоздания каждый тик+

//todo: Выделять ноды размером в зависимости от количества исходящих ссылок
//todo: исправить динамический рендеринг графа
//todo: исправить exeptions
//todo: оптимизация дата-сервисов получения данных
//todo: исправить баг при idle состоянии в getworkdata
//todo: прописать все интерфейсы

@Component({
    selector: "graph",
    template,
    styles: [style],
    encapsulation: ViewEncapsulation.None
})

export class GraphComponent implements OnInit {
    @Input() urls: ObservableCursor<Url>;
    @Input() pages: ObservableCursor<Page>;
    @Input() host: string;
    @Input() is_init: boolean;
    timerId: any;
    init: boolean;

    ngOnInit(): void {
        var is_init = this.is_init;
        var hst = this.host;
        var redrawed = false;
        var build_graph_worker = new Worker("/js/build_graph.js");
        var graph_subscription: Subscription;
        window.urls = {
            links: [
                {
                    site: "",
                    source: "/",
                    target: "/",
                }
            ],
            nodes: [
                {
                    id: "/"
                }
            ]
        };

        if (this.urls) {
            graph_subscription = this.urls
                .subscribe(
                    urls => {
                        clearTimeout(this.timerId);
                        this.timerId = setTimeout(function () {
                            if (!redrawed) {
                                //проверка на ссылки без нод. Если нет ноды, она будет добавлена
                                console.log('проверка на ссылки без нод');
                                urls.forEach(link => {
                                    let found = window.urls.nodes.some(function (el) {
                                        return el.url == link.target;
                                    });

                                    if (!found) {
                                        window.urls.nodes.push({
                                            contentType: null,
                                            url: link.target,
                                            redirectURL: null,
                                            create_date: null,
                                            update_date: null,
                                            status: null,
                                            bodySize: null,
                                            site: "developer.mozilla.org"
                                        });

                                    }
                                });

                                window.urls.links = urls;
                                graph_build(window.urls);
                            }
                        }, 700);
                    }
                )
            ;
        }

        if (this.pages) {
            this.pages
                .subscribe(
                    pages => {
                        window.urls.nodes = pages;
                    }
                )
            ;
        }


        this.init = true;


        var html_container = document.querySelector(".html-container");
        var svg_container = document.querySelector("#d3-container-svg");
        var canvas = document.querySelector("canvas"),
            context = canvas.getContext("2d"),
            width = canvas.width,
            height = canvas.height,
            radius = 3,
            transform = d3.zoomIdentity;
        context.fillStyle = "rgb(187, 187, 187)";
        var svg = d3.select(svg_container);
        var fast_draw;
        var full_draw;
        var dragging = false;
        svg
            .call(
                d3
                    .drag()
                    .subject(dragsubject)
                // .on("drag", dragged)
            )
            .call(
                d3
                    .zoom()
                    .scaleExtent([1 / 8, 8])
                    .on("zoom", zoomed)
            );


        function graph_build() {
            build_graph_worker.postMessage({
                nodes: window.urls.nodes,
                links: window.urls.links,
                width: width,
                height: height
            });

            build_graph_worker.onmessage = function (event) {
                window.urls.nodes = event.data.nodes;
                window.urls.links = event.data.links;
                full_draw();
                document.querySelector("#loader").remove();
                graph_subscription.unsubscribe();
            };
        }

        function fast_draw() {
            // Array
            //     .from(
            //         document.getElementsByClassName('info')
            //     )
            //     .forEach(
            //         elem => {
            //             elem.parentNode.removeChild(elem)
            //         }
            //     );
            context.beginPath();
            window.urls.nodes.forEach(
                (d, i) => {
                    drawFastNode(d, i)
                }
            );
            context.fill();
        }

        function full_draw() {
            // Array
            //     .from(
            //         document.getElementsByClassName('info')
            //     )
            //     .forEach(
            //         elem => {
            //             elem.parentNode.removeChild(elem)
            //         }
            //     );
            context.beginPath();
            window.urls.nodes.forEach(
                (d, i) => {
                    drawFastNode(d, i)
                }
            );
            svg.selectAll("*").remove();

            context.clearRect(0, 0, width, height);
            context.save();

            context.translate(transform.x, transform.y);
            context.scale(transform.k, transform.k);

            context.beginPath();
            window.urls.links.forEach(drawLink);
            context.strokeStyle = 'rgba(0, 12, 24, 0.2)';
            context.stroke();

            window.urls.nodes.forEach(drawNode);
            context.restore();
        }

        function clicked() {
            var i,
                x = transform.invertX(d3.event.x),
                y = transform.invertY(d3.event.y),
                dx,
                dy;
            var point;
            for (i = window.urls.nodes.length - 1; i >= 0; --i) {
                point = window.urls.nodes[i];
                dx = x - point.x;
                dy = y - point.y;
                if (dx * dx + dy * dy < 5 * 5) {
                    full_draw();
                }
            }


        }

        function dragsubject() {

            // console.log(d3.event);
            var i,
                x = transform.invertX(d3.event.x),
                y = transform.invertY(d3.event.y),
                dx,
                dy;
            var point;

            for (i = window.urls.nodes.length - 1; i >= 0; --i) {
                point = window.urls.nodes[i];
                dx = x - point.x;
                dy = y - point.y;

                if (dx * dx + dy * dy < radius * radius) {
                    // console.log(x - window.urls.nodes[i].x);
                    // console.log(y - window.urls.nodes[i].y);
                    // console.log(transform.applyX(point.x));
                    // console.log(transform.applyY(point.y));
                    if (point.toggle == true) {
                        point.toggle = false;
                        document.getElementById(point.url).remove();
                    } else {
                        point.toggle = true;
                        html_container.insertAdjacentHTML('beforeend', `
                <div
                id="${point.url}"
                class= "info has-tooltip"
                style="
                position: absolute;
                left: ${transform.applyX(point.x)}px;
                top: ${transform.applyY(point.y)}px;
                pointer-events: none !important;
                ">
                <span class="tooltip"
                pointer-events: none !important;
                >
                <span style="pointer-events: all;">
                Адрес: <a href = "${hst + point.url}">${point.url}</a><br />
                Тип: ${point.contentType || '-'}<br />
                Статус: ${point.status || '-'}<br />
                Размер байт: ${point.selector || '-'}<br />
                Дата обновления: ${point.create_date || 'страница еще не парсилась'}<br />
                </span>
                </div>`);

                    }
                    fast_draw();
                    full_draw();
                }
            }
        }

        function dragged() {
            d3.event.subject.x = transform.invertX(d3.event.x);
            d3.event.subject.y = transform.invertY(d3.event.y);
            full_draw();
        }

        function zoomed() {
            transform = d3.event.transform;
            context.save();
            context.clearRect(0, 0, width, height);
            context.translate(transform.x, transform.y);
            context.scale(transform.k, transform.k);
            fast_draw();
            context.restore();

            clearTimeout(this.timerId);
            this.timerId = setTimeout(
                () => {
                    new Promise(
                        () => {
                            full_draw();
                        }
                    );
                }, 100);

        }

        function drawLink(d) {
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
        }

        function drawFastNode(d, i) {
            // if (i % 2) {

            context.moveTo(d.x, d.y);
            context.arc(d.x, d.y, radius, 0, 7);
            // }
            if (!!d.toggle) {
                    let point = document.getElementById(d.url);
                    point.style.left = transform.applyX(d.x) + 'px';
                    point.style.top = transform.applyY(d.y) + 'px';
                // if (!!d.url) {
                //     var parse_date;
                //     if (!!d.create_date) {
                //         parse_date = new Date(d.create_date).toISOString().substring(0, 10)
                //     }
                //     if (!!d.update_date) {
                //         parse_date = new Date(d.update_date).toISOString().substring(0, 10)
                //     }
                // }
            }
        }

        function drawNode(d) {
            context.beginPath();

            if (d.create_date == null) {
                context.fillStyle = "rgb(187, 187, 187)";
                radius = 3
            }
            else {
                context.fillStyle = "rgb(141, 187, 256)";
                radius = 5
            }
            context.moveTo(d.x, d.y);
            context.arc(d.x, d.y, radius, 0, 7);

            context.strokeStyle = "#fff";
            context.stroke();
            context.fill();

        }
    }
}
