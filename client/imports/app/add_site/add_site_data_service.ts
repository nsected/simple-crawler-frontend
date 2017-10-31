import {Injectable} from "@angular/core";
import {ObservableCursor} from "meteor-rxjs";
import {SitesCollection} from "../../../../both/collections/sites.collection";
import {MongoObservable} from "meteor-rxjs";
import {Site} from "../../../../both/models/site.model";

@Injectable()
export class SiteItemDataService {
    constructor() {
    }

    public static getSite(url: string): Site {
        let data: Site = {};
        try {
            data.site = SitesCollection.find({url: url});
            return data
        } catch (error) {
            console.log(error);
            data.err = error;
            return data
        }
    }
}
