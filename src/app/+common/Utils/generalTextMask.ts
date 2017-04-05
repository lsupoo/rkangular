/**
 * Created by javier.cuicapuza on 3/6/2017.
 */
export class GeneralTextMask {
    public static get datetimeMask(): any { return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; };
    public static get timeMask(): any { return [/\d/, /\d/, ':', /\d/, /\d/]; };
    public static get datetime(): any { return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ',/\d/, /\d/, ':', /\d/, /\d/]; };

    public static get currencyMask(): any { return [/\d/, /\d/, /\d/, /\d/, /\d/,',', /\d/, /\d/ ]; };

    public static placerholderFormatDateTime: string = "MM/DD/YYYY HH:MM";
    public static placerholderFormatDate: string = "MM/DD/YYYY";
}