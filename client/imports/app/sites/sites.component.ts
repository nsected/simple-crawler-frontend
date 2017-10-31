import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SitesDataService } from "./sites-data.service";
import { Sites } from "../../../../both/models/sites.model";
import template from "./sites.component.html";
import style from "./sites.component.scss";
import {SitesCollection} from "../../../../both/collections/sites.collection";

@Component({
  selector: "sites",
  template,
  styles: [ style ],
  providers: []
})
export class SitesComponent implements OnInit {
  greeting: string;
  data: Observable<Sites[]>;

  constructor(private sitesDataService: SitesDataService) {
    this.greeting = "Hello Sites Component!";
  }

  ngOnInit() {
      // SitesCollection.find({})
    this.data = this.sitesDataService.getData().zone();
  }

  public toggle_parsing(id, to_parse){
console.log(id);
    console.log(to_parse);
    let oid = new Mongo.ObjectID(`${id}`);
    let site = SitesCollection
        .update(oid, {
      $set: { to_parse: !to_parse },
    });
  }
}
