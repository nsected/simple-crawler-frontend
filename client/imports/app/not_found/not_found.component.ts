import { Component, OnInit } from "@angular/core";
import template from "./not_found.component.html";
import style from "./not_found.component.scss";

@Component({
  selector: "not_found",
  template,
  styles: [ style ]
})
export class NotFoundComponent implements OnInit {
  ngOnInit() {
  }
}
