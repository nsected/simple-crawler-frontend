import {Sites} from "./sites.model";
import {ObservableCursor} from "meteor-rxjs";
export interface Site {
    site?: ObservableCursor<Sites>;
    err?: Error
}
