import {Component, OnDestroy, OnInit} from "@angular/core";
import template from "./add_site.component.html";
import style from "./add_site.component.scss";
import {Sites} from "../../../../both/models/sites.model";
import {SiteItemDataService} from "./add_site_data_service";
import {SitesCollection} from "../../../../both/collections/sites.collection";
import {Router} from "@angular/router";

@Component({
    selector: "site_item",
    template,
    styles: [style],
    providers: [
        SiteItemDataService
    ]
})

export class AddSiteComponent implements OnInit, OnDestroy {

    site_data: Sites;
    newsite: any;
    collection: any;
    constructor(private router: Router) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.newsite = {
            title: 'New site',
            url: '',
            priority: 1,
            init_url: '',
            to_parse: false
        };
    }

    addSite(): void {
        this.newsite.url = new URL(this.newsite.url).origin;
        var collection = SitesCollection.find({url: this.newsite.url});
        if (collection.cursor.count() === 0) {
            console.log(this.newsite.url);
            SitesCollection.insert(this.newsite);
            collection.stop()
        }
        this.router.navigateByUrl('/sites');
    }
}
