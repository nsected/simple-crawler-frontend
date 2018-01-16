import {Injectable} from "@angular/core";
import {UrlsCollection} from "../../../../both/collections/urls.collection";
import {Urls} from "../../../../both/models/urls.model";
import {PagesCollection} from "../../../../both/collections/pages.collection";

@Injectable()
export class UrlsDataService {

    public static getUrls(host: string): Urls {
        Meteor.subscribe('urls',host, { $ne: null });
        Meteor.subscribe('pages_graph', host, { $ne: null });

        let data: Urls = {};
        try {
            data.pages = PagesCollection.find({site:host, "create_date": {$ne: null}});
            data.urls = UrlsCollection.find({site:host});
            return data
        } catch (error) {
            console.log(error);
            data.err = error;
            return data
        }
    }
}
