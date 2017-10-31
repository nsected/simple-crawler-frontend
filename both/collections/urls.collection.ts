import {MongoObservable} from "meteor-rxjs";
import {Url} from "../models/url.model";

export const UrlsCollection = new MongoObservable.Collection<Url>("urls");

if (Meteor.isServer) {
    Meteor.publish('urls', function (site, update_date) {
        return UrlsCollection.find({
                "site": site,
                "update_date": {$ne: null},

            },
            {limit: 20000});
    });
}

