import {Injectable} from "@angular/core";
import {SitesCollection} from "../../../../both/collections/sites.collection";
import {Site} from "../../../../both/models/site.model";

@Injectable()
export class SiteItemDataService {
    constructor() {
    }

    public static getSite(id: number): Site {
        let data: Site = {};
        try {
            let oid = new Mongo.ObjectID(`${id}`);
            data.site = SitesCollection.find({_id: oid});
            return data
        } catch (error) {
            console.log(error);
            data.err = error;
            return data
        }
    }

    public static removeSite(id: number): Site {
        let data: Site = {};
        try {
            let oid = new Mongo.ObjectID(`${id}`);
            data.site = SitesCollection.remove({_id: oid});
            return data
        } catch (error) {
            console.log(error);
            data.err = error;
            return data
        }
    }

    public static updateSite(id: number, site: any): Site {
        let data: Site = {};
        try {
            let oid = new Mongo.ObjectID(`${id}`);
            data.site = SitesCollection.update({_id: oid},{$set:site});
            return data
        } catch (error) {
            console.log(error);
            data.err = error;
            return data
        }
    }
}
