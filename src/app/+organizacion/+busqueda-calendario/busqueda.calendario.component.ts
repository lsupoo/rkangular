import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import * as moment from 'moment';
import {CalendarioResult} from "../../+dto/calendarioResult";
import {CalendarioService} from "../../+common/service/calendario.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {Subscription} from "rxjs";
import {CalendarioFilter} from "../../+dto/calendarioFilter";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {MesCalendario} from "../../+dto/mesCalendario";
import {YearCalendario} from "../../+dto/yearCalendario";
import {Calendario} from "../../+dto/maintenance/calendario";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
    selector: 'busqueda-calendario',
    templateUrl: 'busqueda.calendario.component.html'
})
export class BusquedaCalendarioComponent extends ComponentBase{

    public fecha: string;
    private currentDate = new Date();
    private year = this.currentDate.getFullYear();
    private yearAfterClean = this.currentDate.getFullYear();

    busquedaCalendario: CalendarioFilter = new CalendarioFilter();

    public mesCalendario: MesCalendario[] = [
        { nombreMes: "Enero", numeroMes: 1 },
        { nombreMes: "Febrero", numeroMes: 2 },
        { nombreMes: "Marzo", numeroMes: 3 },
        { nombreMes: "Abril", numeroMes: 4 },
        { nombreMes: "Mayo", numeroMes: 5 },
        { nombreMes: "Junio", numeroMes: 6 },
        { nombreMes: "Julio", numeroMes: 7 },
        { nombreMes: "Agosto", numeroMes: 8 },
        { nombreMes: "Setiembre", numeroMes: 9 },
        { nombreMes: "Octubre", numeroMes: 10 },
        { nombreMes: "Noviembre", numeroMes: 11 },
        { nombreMes: "Diciembre", numeroMes: 12 }
    ];

    public yearCalendario: YearCalendario[] = [
        { numberYear: this.yearAfterClean-3 },
        { numberYear: this.yearAfterClean-2 },
        { numberYear: this.yearAfterClean-1 },
        { numberYear: this.yearAfterClean },
        { numberYear: this.yearAfterClean+1 },
        { numberYear: this.yearAfterClean+2 },
        { numberYear: this.yearAfterClean+3 },
        { numberYear: this.yearAfterClean+4 }

    ];

    public calendarioMes: MesCalendario = new MesCalendario();
    public defaultItemMes: MesCalendario = new MesCalendario("Todos", null);
    public calendarioYear: YearCalendario = new YearCalendario();
    public defaultItemYear: YearCalendario = { numberYear: 2017 };

    private calendarioResult: CalendarioResult[] = [];
    private gridView: GridDataResult;
    private pageSize: number = 10;
    private skip: number = 0;

    public isEmpty:boolean = true;
    busy: Subscription;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    constructor(public backendService: BackendService,
                private calendarioService: CalendarioService,
                private empleadoService: EmpleadoService,
                private _router: Router) {

        super(backendService,'OR004');
        this.onSubmit();

    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getServiceDateFromDB();
    }
    onLimpiar(){

        this.fecha = undefined;
        this.calendarioMes.numeroMes = undefined;
        this.calendarioYear.numberYear = undefined;
        this.busquedaCalendario.fecha = undefined;
        this.busquedaCalendario.mes = undefined;
        this.busquedaCalendario.year = undefined;

        this.gridView = {
            data: [],
            total: 0
        };

    }

    private validarValoresSeleccionados(){


        if(this.fecha !== undefined){
            (this.fecha === undefined) ? this.busquedaCalendario.fecha = ''
                : this.busquedaCalendario.fecha = (this.fecha);
            this.busquedaCalendario.mes = 0;
            this.busquedaCalendario.year = 0;
        }else{
            (this.calendarioMes.numeroMes === undefined || this.calendarioMes.numeroMes == null) ? this.calendarioMes.numeroMes = 0
                : this.busquedaCalendario.mes = (this.calendarioMes.numeroMes);

            (this.calendarioYear.numberYear === undefined || this.calendarioYear.numberYear == null) ? this.calendarioYear.numberYear = 0
                : this.busquedaCalendario.year = (this.calendarioYear.numberYear);

        }

    }
    private getServiceDateFromDB(){

        if(this.busquedaCalendario.mes === undefined){
            this.busquedaCalendario.mes = 0;
        }
        if(this.busquedaCalendario.year === undefined){
            this.busquedaCalendario.year = 0;
        }
        this.busy = this.calendarioService.obtenerDiasNoLaborables(this.busquedaCalendario).subscribe(
            data => {
                this.calendarioResult = data;
                this.skip = 0;
                this.obtenerCalendarios();
            },
            error =>  this.errorMessage = <any>error);
    }

    private obtenerCalendarios(): void {
        if(this.calendarioResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.calendarioResult.slice(this.skip, this.skip + this.pageSize),
                total: this.calendarioResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }
    }

    private onAgregarFeriado(){
        this.storeSessionFilter.isNew = true;
        this.empleadoService.storeSessionStorage('editCalendarioResult',this.storeSessionFilter);
        this._router.navigate(['/organizacion/administrarCalendario']);
    }
    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idCalendario;
        this.empleadoService.storeSessionStorage('editCalendarioResult',this.storeSessionFilter);
        this._router.navigate(['/organizacion/administrarCalendario']);


    }
    private onEliminar(dataItem: Calendario): void{

        this.calendarioService.eliminarDiasNoLaborables(dataItem.idCalendario).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getServiceDateFromDB();
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );

    }

    onChangeFecha(value){
        this.fecha = value;
        this.year = null;
    }

    selectedMes(value){

        this.calendarioMes.numeroMes = value;
    }

    selectedYear(value){

        this.calendarioYear.numberYear = value;
    }

    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerCalendarios();

    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Calendario): void {
        this.confirmDialogComponent.titulo="Eliminar Calendario"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }




}
