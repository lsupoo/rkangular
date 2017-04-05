/**
 * Created by javier.cuicapuza on 3/6/2017.
 */
export class ExpressionRegularValidate {

    public static isValidateDateInput(txtDate) {

        var currVal = txtDate;
        if (currVal == '' || txtDate == null || txtDate === undefined)
            return false;

        var rxDatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern);

        if (dtArray == null)
            return false;

        //Checks for mm/dd/yyyy format.
        var dtMonth = dtArray[3];
        var dtDay = dtArray[1];
        var dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;

    }

    public static isValidDateTimeInput(txtDateTime) {

        let currVal: string = txtDateTime;
        if (currVal == '' || txtDateTime == null || txtDateTime === undefined)
            return false;

        var rxDatePattern = /^(([0]?[1-9]|1[0-2])\/([0-2]?[0-9]|3[0-1])\/[1-2]\d{3}) (20|21|22|23|[0-1]?\d{1}):([0-5]?\d{1})$/;
        var dtArray = currVal.match(rxDatePattern);
        if (dtArray == null)
            return false;

        let date = dtArray[1];
        let isvalidDate = this.isValidateDateInput(date);
        let time = dtArray[4] + ':' + dtArray[5];
        let isvalidTime = this.isValidTimeInput(time);
        return isvalidDate && isvalidTime;
    }

    public static isValidTimeInput(txtDate) {

        var currVal = txtDate;
        if (currVal == '' || txtDate == null || txtDate === undefined)
            return false;

        var rxDatePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        var dtArray = currVal.match(rxDatePattern);
        if (dtArray == null)
            return false;
        var timeSplit = currVal.split(':');
        var hours = timeSplit[0];
        var minutes = timeSplit[1];
        if (!(0 <= hours && hours <= 23))
            return false;
        if (!(0 <= minutes && hours <= 59))
            return false;

        return true;
    }

}