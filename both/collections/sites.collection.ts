import { MongoObservable } from "meteor-rxjs";
import {Sites} from "../models/sites.model";

export const SitesCollection = new MongoObservable.Collection<Sites>("sites", { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.publish('sites', function(){
        return SitesCollection.find();
    });
}

if (Meteor.isClient) {
    Meteor.subscribe('sites');
}