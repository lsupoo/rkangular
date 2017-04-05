/**
 * Created by josediaz on 22/11/2016.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthenticationService} from "../+services/authentication.service";


@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private auth: AuthenticationService,private router: Router) { }

    canActivate() {

        if (!this.auth.loggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;

    }
}