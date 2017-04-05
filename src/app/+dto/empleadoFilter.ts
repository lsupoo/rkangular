/**
 * Created by josediaz on 2/11/2016.
 */

export class EmpleadoFilter {

    public nombres: string;
    public apePaterno: string;
    public apeMaterno: string;
    public codigo: string;
    public tipoDocumento: string;
    public tipoDocumentoString: string = '';
    public numeroDocumento: string;


    public unidadNegocio: string;
    public departamento: string;
    public proyecto: string;


    public jefeInmediato: string;
    public centroCosto: string;
    public centroCostoString: string = '';
    public correoElectronico: string;
    public estado: string;
    public estadoString: string = '';

    public idJefeInmediato:number;
    public idEmpleado: number;
    public fechaIngresoDesde: string;
    public fechaIngresoHasta: string;
    public fechaCeseDesde: string;
    public fechaCeseHasta: string;



}