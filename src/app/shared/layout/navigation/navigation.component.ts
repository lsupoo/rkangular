import {Component} from "@angular/core";
import {Modulo} from "../../../+dto/maintenance/modulo";

declare var $: any;

@Component({
  selector: 'sa-navigation',
  templateUrl: 'navigation.component.html'
})
export class NavigationComponent {



  private modulos: Array<Modulo> = [];
  public errorMessage: string;

  constructor() {

    this.modulos = JSON.parse(localStorage.getItem("modulos") || '{}');

  }


}