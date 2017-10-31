import {MongoObservable} from "meteor-rxjs";
import {Page} from "../models/Page.model";

export const PagesCollection = new MongoObservable.Collection<Page>("pages");

if (Meteor.isServer) {
    Meteor.publish('pages_graph', function (site, update_date) {
        return PagesCollection.find({
                "site": site, "create_date": {$ne: null},
            },
            {limit: 20000}
        );
    });

    Meteor.publish('pages_table', function (selector, options) {
        return PagesCollection.find(
            selector,
            options
        );
    });
}