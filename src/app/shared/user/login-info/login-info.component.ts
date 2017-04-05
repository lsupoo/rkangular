import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {LayoutService} from "../../layout/layout.service";
import {JwtHelper} from "angular2-jwt";
declare var $: any;

@Component({

  selector: 'sa-login-info',
  templateUrl: 'login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  user: any;
  nombreCompleto: string;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private userService: UserService,
              private layoutService: LayoutService) {

    var token = localStorage.getItem('id_token');
    if (token) {
      var decoded = this.jwtHelper.decodeToken(token);
      this.nombreCompleto = decoded.empleado;

    }


  }

  ngOnInit() {
    this.userService.getLoginInfo().subscribe(user => {
      this.user = user
    })

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
