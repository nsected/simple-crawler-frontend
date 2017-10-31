import { Injectable } from "@angular/core";
import { ObservableCursor } from "meteor-rxjs";
import { Sites } from "../../../../both/models/sites.model";
import { SitesCollection } from "../../../../both/collections/sites.collection";

@Injectable()
export class SitesDataService {
  private data: ObservableCursor<Sites>;

  constructor() {
  }

  public getData(): ObservableCursor<Sites> {
    return SitesCollection.find({});
  }
}
