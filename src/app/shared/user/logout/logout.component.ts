import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../+auth/+services/authentication.service";


declare var $:any;

@Component({
  selector: 'sa-logout',
  template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
        <span> <a routerlink="/login" title="Cerrar sesi&oacute;n" data-action="userLogout"
                  data-logout-msg="Puedes mejorar aún más tu seguridad, si después de cerrar la sesión,  cierras el navegador"><i
          class="fa fa-sign-out"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  showPopup(){
    $.SmartMessageBox({
      title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> ¿ Cerrar sesi&oacute;n <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content : "Puedes mejorar aún más tu seguridad, si después de cerrar la sesión,  cierras el navegador",
      buttons : '[No][Si]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Si") {
        this.logout()
      }
    });
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login'])
  }

  ngOnInit() {

  }



}
