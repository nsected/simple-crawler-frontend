import {Component, Input, OnInit} from "@angular/core";
import template from "./results_table.component.html";
import style from "./results_table.component.scss";
import {ResultsTableDataService} from "./results_table_data.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import SubscriptionHandle = Meteor.SubscriptionHandle;
import {Subscription} from "rxjs/Subscription";

interface Options {
    [key: string]: any
}

@Component({
    selector: "results_table",
    template,
    styles: [style]
})

export class ResultsTableComponent implements OnInit {
    @Input() host: string;
    timerId: any;
    pages: BehaviorSubject<Array> = new BehaviorSubject<Array>([]);
    pages_sub2: Subscription;
    pages_sub3: SubscriptionHandle;
    pages_sub: Subscription;
    selector: BehaviorSubject<Object> = new BehaviorSubject<Object>({
        site: null,
        create_date: {$ne:null}
    });

    ngOnInit(): void {
        let pages_sub2 = this.pages_sub2;
        let host = this.host;
        this.pages_sub = this.selector.subscribe((selector) => {
            let options = {limit: 100};
            let _pages = this.pages;

            _pages.next([]);
            this.pages_sub3 = Meteor
                .subscribe('pages_table',
                    selector,
                    options
                );

            ResultsTableDataService.getPages(pages_sub2, selector, options, this.timerId, format_date, _pages);
        });

        function format_date(date) {
            try {
                return date.toLocaleDateString('ru-RU')
                    // + ':'
                    // + date.toLocaleTimeString('ru-RU')
            } catch (err) {
                return date
            }
        }
    }

    ngOnDestroy() {
        if (this.pages_sub) {
            this.pages_sub.unsubscribe();
        }
        if (this.pages_sub2) {
            this.pages_sub2.unsubscribe();
        }
    }

    ngAfterContentInit(): void {
        let host = this.host;
        this.selector.next({
            site: host
        });
    }

    filter(event, selector, type) {
        let new_selector = this.selector.value;
        let value = event.target.value;
        let previous_selector_observable = this.selector;

        if (type === 'gte') {
            if (value === '') {
                if (!!new_selector[selector].$lte) {
                    delete new_selector[selector].$gte;
                    previous_selector_observable.next(new_selector);
                } else {
                    delete new_selector[selector];
                    previous_selector_observable.next(new_selector);
                }

            } else {
                insert_values(value, '$gte', selector)
            }
        }
        if (type === 'lte') {
            if (value === '') {
                if (!!new_selector[selector].$gte) {
                    delete new_selector[selector].$lte;
                    previous_selector_observable.next(new_selector);
                } else {
                    delete new_selector[selector];
                    previous_selector_observable.next(new_selector);
                }
            } else {
                insert_values(value, '$lte', selector)
            }
        }

        function insert_values(value, type, selector) {
            switch (selector) {
                case 'contentType':
                    if (!new_selector[selector]) {
                        new_selector[selector] = {}
                    }
                    new_selector[selector] = value;
                    break;
                case 'url':
                    if (!new_selector[selector]) {
                        new_selector[selector] = {}
                    }
                    new_selector[selector] = value;
                    break;
                case 'create_date':
                    if (!new_selector[selector]) {
                        new_selector[selector] = {}
                    }
                    new_selector[selector][type] = new Date(value);
                    break;
                case 'update_date':
                    if (!new_selector[selector]) {
                        new_selector[selector] = {}
                    }
                    new_selector[selector][type] = new Date(value);
                    break;
                case 'status':
                    if (!new_selector[selector]) {
                        new_selector[selector] = {}
                    }
                    new_selector[selector][type] = parseInt(value);
                    break;
                case 'bodySize':
                    if (!new_selector[selector]) {
                        new_selector[selector] = {}
                    }
                    new_selector[selector][type] = parseInt(value);
                    break;
            }

            previous_selector_observable.next(new_selector);
        }
    }
}
