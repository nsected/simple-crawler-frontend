import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { SitesComponent } from "./sites/sites.component";
import { SitesDataService } from "./sites/sites-data.service";
import { NotFoundComponent } from "./not_found/not_found.component";
import { SiteItemComponent } from "./site_item/site_item.component";
import {GraphComponent} from "./graph/graph.component";
import {RouterModule} from "@angular/router";
import {AddSiteComponent} from "./add_site/add_site.component";
import {FormsModule} from "@angular/forms";
import {EditSiteComponent} from "./edit_site/edit_site.component";
import {ResultsTableComponent} from "./results_table/results_table.component";


@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    SitesComponent,
    NotFoundComponent,
    SiteItemComponent,
    GraphComponent,
    AddSiteComponent,
    EditSiteComponent,
    ResultsTableComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent
  ],
  // Providers
  providers: [
    SitesDataService
  ],
  // Modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {

  }
}
