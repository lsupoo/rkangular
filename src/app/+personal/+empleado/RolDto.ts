/**
 * Created by Javier on 5/12/2016.
 */
export class RolDto {
    constructor(
        public roleName?: string,
        public idEmpleado?: number,
        public subModulos?: Array<RolDto>
    ) { }
}
