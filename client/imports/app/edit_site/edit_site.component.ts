import {Component, OnInit} from "@angular/core";
import template from "./edit_site.component.html";
import style from "./edit_site.component.scss";
import {Sites} from "../../../../both/models/sites.model";
import {SitesCollection} from "../../../../both/collections/sites.collection";
import {ActivatedRoute, Router} from "@angular/router";
import {SiteItemDataService} from "../site_item/site_item_data.service";

@Component({
    selector: "site_edit",
    template,
    styles: [style],
    providers: [
        SiteItemDataService
    ]
})

export class EditSiteComponent implements OnInit {

    site: any;
    id: number;

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit(): void {
        this.site={
            url:"",
            to_parse:false,
            title:"",
            priority:0,
            exeptions:[],
            init_url:"",
            protocol:""
        };

        this
            .route
            .params
            .subscribe(
                params => {
                    console.log(params['id']);
                    SiteItemDataService.getSite(params['id']).site.zone().subscribe(
                        site => {
                            this.site = site[0];
                            console.log(site[0]);
                        }
                    );
                    this.id = params['id'];
                }
            )
        ;
    }

    removeSite(): void {
        var result = SiteItemDataService.removeSite(this.id);
        console.log(result);
        this.router.navigateByUrl('/sites');
    }

    editSite(): void {
        delete this.site._id;
        var result = SiteItemDataService.updateSite(this.id, this.site);
        console.log(result);
        this.router.navigateByUrl('/sites');
    }
}
