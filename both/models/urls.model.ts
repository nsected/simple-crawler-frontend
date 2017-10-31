import {ObservableCursor} from "meteor-rxjs";
import {Url} from "./url.model";
import {Page} from "./page.model";
export interface Urls {
    urls?: ObservableCursor<Url>;
    pages?: ObservableCursor<Page>;
    err?: Error
}
