import {QuickFilter} from "./quickFilter";
export class PermisoEmpleadoQuickFilter extends QuickFilter{
    public desde: string;
    public hasta: string;
    public idJefeInmediato:number;
}