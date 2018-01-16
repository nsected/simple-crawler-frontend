import {MongoObservable} from "meteor-rxjs";
import {Url} from "../models/url.model";

export const UrlsCollection = new MongoObservable.Collection<Url>("urls");

if (Meteor.isServer) {
    Meteor.publish('urls', function (site, update_date) {
        return UrlsCollection.find({
                "site": site,
            $or:[
                {"update_date": {$ne: null}},
                {"create_date": {$ne: null}},
                ]
            },
            {
                sort: {create_date: 1},
                limit: 5000
            });
    });
}

