/**
 * Created by javier.cuicapuza on 1/24/2017.
 */
export class AssignedRole{

    constructor(
        public roleName?: string,
        public roleDescription?: string,
        public assigned?: boolean,
        public roleDefault?:boolean
    ){}
}