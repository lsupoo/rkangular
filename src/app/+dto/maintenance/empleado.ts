import {DocumentoEmpleado} from "./documentoEmpleado";
import {Educacion} from "./educacion";
import {ExperienciaLaboral} from "./experienciaLaboral";
import {EquipoEntregado} from "./equipoEntregado";
import {Dependiente} from "./dependiente";
import {Licencia} from "./licencia";
import {AuditingEntity} from "../auditingEntity";

export class Empleado extends AuditingEntity{

     constructor(
         public idEmpleado?: number,
         public idEmpresa?: number,
         public nombre?: string,
         public apellidoPaterno?: string,
         public apellidoMaterno?:string,
         public tipoDocumento?:string,
         public tipoDocumentoString?:string,
         public numeroDocumento?:string,
         public genero?:string,
         public generoString?:string,
         public estadoCivil?:string,
         public estadoCivilString?:string,
         public grupoSangre?:string,
         public grupoSangreString?:string,

         public paisNacimiento?:string,
         public paisNacimientoString?:string,
         public departamentoNacimiento?:string,
         public departamentoNacimientoString?:string,
         public provinciaNacimiento?:string,
         public provinciaNacimientoString?:string,
         public distritoNacimiento?:string,

         public codigo?:string,
         public emailInterno?:string,
         public telefonoInterno?:string,
         public anexoInterno?:string,
         public idCentroCosto?:number,
         public centroCostoString?:string,
         public contratoTrabajo?:string,
         public contratoTrabajoString?:string,
         public regimenHorario?:string,
         public regimenHorarioString?:string,
         public regimenLaboral?:string,
         public regimenLaboralString?:string,
         public tipoTrabajador?:string,
         public tipoTrabajadorString?:string,
         public telefonoCasa?:string,
         public telefonoCelular?:string,
         public telefonoAdicional?:string,
         public emailPersonal?:string,
         public tipoDomicilio?:string,
         public tipoDomicilioString?:string,
         public direccionDomicilio?:string,

         public paisDomicilio?:string,
         public paisDomicilioString?:string,
         public departamentoDomicilio?:string,
         public departamentoDomicilioString?:string,
         public provinciaDomicilio?:string,
         public provinciaDomicilioString?:string,
         public distritoDomicilio?:string,

         public nombreContactoEmergencia?:string,
         public emailContactoEmergencia?:string,
         public telefonoContactoEmergencia?:string,
         public relacionContactoEmergencia?:string,
         public relacionContactoEmergenciaString?:string,
         public motivoRenuncia?:string,
         public estado?:string,
         public estadoString?:string,
         public fechaNacimiento?:string,
         public fecNac?:string,

         public fechaIngreso?:string,

         public edad?:number,

         public esPersonalDeConfianza:boolean=false,
         public discapacitado:boolean= false,

         public nombreProyecto?:string,
         public nombreDepartamento?:string,
         public nombreUnidadNegocio?:string,
         //darBaja
         public fechaRenuncia?: string,
         public fechaCese?: string,

         public tieneEps:boolean= false,

         public entidadBancariaSueldo?:string,
         public afp?:string,
         public eps?:string,
         public cts?:string,

         public entidadBancariaSueldoString?:string,
         public afpString?:string,
         public epsString?:string,
         public ctsString?:string,

         public nombreCompletoEmpleado?:string,

         public fotoPerfil:DocumentoEmpleado = new DocumentoEmpleado(),

         public documentos:DocumentoEmpleado[]=[],
         public educaciones:Educacion[]=[],
         public experienciasLaborales:ExperienciaLaboral[]=[],
         public equiposEntregados:EquipoEntregado[]=[],
         public dependientes:Dependiente[]=[],
         public licencias:Licencia[]=[]
     ) {
          super();
     }


}
