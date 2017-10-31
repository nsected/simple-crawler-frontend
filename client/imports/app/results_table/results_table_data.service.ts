import {Injectable} from "@angular/core";
import {PagesCollection} from "../../../../both/collections/pages.collection";

@Injectable()
export class ResultsTableDataService {

    public static getPages(pages_sub2, selector, options, timerId, format_date, _pages): any {
        pages_sub2 = PagesCollection.find(
            selector,
            options
        ).subscribe(pages => {
            clearTimeout(timerId);
            timerId = setTimeout(function () {
                let objectPages = Object.assign([], pages);
                objectPages = Object.keys(objectPages)
                    .map(it => {
                        objectPages[it].update_date = format_date(objectPages[it].update_date);
                        objectPages[it].create_date = format_date(objectPages[it].create_date);
                        return objectPages[it]
                    });
                _pages.next(objectPages);
            }, 500);
        })
    }
}
