import {Modulo} from "./maintenance/modulo";
import {CurrentUser} from "./currentUser";
/**
 * Created by javier.cuicapuza on 3/17/2017.
 */
export class ChangeRolModel {
    constructor(
        public modulos?: Modulo[],
        public currentUser?: CurrentUser

    ){}
}