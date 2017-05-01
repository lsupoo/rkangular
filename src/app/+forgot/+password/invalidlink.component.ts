/**
 * Created by oscar.castillo on 12/01/2017.
 */
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
declare var $: any;

@Component({
    selector: 'mensaje-envioMailRecuperacionPassword',
    templateUrl: 'invalidlink.component.html'

})

export class InvalidLinkComponent implements OnInit {
    public constructor(private router: Router
    ) {
        // You need this small hack in order to catch application root view container ref


    }
    ngOnInit(){

    }

    inicio() {
        this.router.navigate(['/login']);
    }

}

