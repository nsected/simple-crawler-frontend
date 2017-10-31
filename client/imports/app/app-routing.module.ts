import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SitesComponent } from "./sites/sites.component";
import { NotFoundComponent } from "./not_found/not_found.component";
import { SiteItemComponent } from "./site_item/site_item.component";
import {AddSiteComponent} from "./add_site/add_site.component";
import {EditSiteComponent} from "./edit_site/edit_site.component";

const routes: Routes = [
  { path: '', redirectTo: '/sites', pathMatch: 'full' },
  { path: 'sites/site', redirectTo: '/sites', pathMatch: 'full' },
  { path: 'sites', component: SitesComponent },
  { path: 'add-site', component: AddSiteComponent},
  { path: 'sites/site/:id', component: SiteItemComponent },
  { path: 'sites/edit/:id', component: EditSiteComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
