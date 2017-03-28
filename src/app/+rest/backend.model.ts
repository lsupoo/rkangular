/**
 * Created by josediaz on 22/02/2017.
 */


export enum RequestTypes {
    get,
    post,
    put,
    delete,
    patch,
    head,
    options
}

export interface IUrlOptions {
    restOfUrl: string,
}

