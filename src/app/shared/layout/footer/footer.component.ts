import {Component, OnInit} from '@angular/core';
import {CurrentUser} from "../../../+dto/currentUser";


@Component({
    selector: 'sa-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

    build: string;
    revision: string;
    timestamp: string;
    currentUser: CurrentUser = new CurrentUser();

    constructor() {
        this.currentUser = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');

        if (this.currentUser) {
            this.build = this.currentUser.build;
            this.revision = this.currentUser.revision;
            this.timestamp = this.currentUser.timestamp;
        }

    }

    ngOnInit() {
    }

}
