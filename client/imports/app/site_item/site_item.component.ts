import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import template from "./site_item.component.html";
import style from "./site_item.component.scss";
import {Sites} from "../../../../both/models/sites.model";
import {ActivatedRoute} from '@angular/router';
import {SiteItemDataService} from "./site_item_data.service";
import {UrlsDataService} from "./site_urls_data.service";
import {Url} from "../../../../both/models/url.model";
import {GraphComponent} from "../graph/graph.component";
import {ObservableCursor} from "meteor-rxjs";
import {Page} from "../../../../both/models/page.model";
import {ResultsTableComponent} from "../results_table/results_table.component";

@Component({
    selector: "site_item",
    template,
    styles: [style],
    providers: [
        SiteItemDataService,
        UrlsDataService
    ]
})

export class SiteItemComponent implements OnInit, OnDestroy {


    @ViewChild(GraphComponent)
    @ViewChild(ResultsTableComponent)
    graph: GraphComponent;
    results_table: ResultsTableComponent;

    site_data: Sites;
    urls: ObservableCursor<Url>;
    pages: ObservableCursor<Page>;
    host: string;
    is_init: boolean;
    timerId: any;
    site: any;
    site_id: number;

    constructor(private route: ActivatedRoute) {
        this.site_data = {_id: '', title: '', url: '',};
        this
            .route
            .params
            .subscribe(
                params => {
                    this.site = SiteItemDataService.getSite(params['id']);
                    this.site_id = params['id'];
                }
            )
        ;

        this.is_init = true;
        if (!!this.site.err) {
            this.site_data.title = 'Wrong site ID';
        }
        else {
            this.site
                .site
                .zone()
                .subscribe(
                    site => {
                        this.site_data = site[0];
                        this.host = new URL(this.site_data.url).host;
                        this.urls = UrlsDataService
                            .getUrls(this.host)
                            .urls;
                        this.pages = UrlsDataService
                            .getUrls(this.host)
                            .pages
                    }
                )
            ;
        }
    }
    ngOnDestroy(): void {
        this.site.site.stop();
        this.urls.stop();
        this.pages.stop();
        this.is_init = false;
        this.host = "";
    }

    ngOnInit(): void {


    }
}
