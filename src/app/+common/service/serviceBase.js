"use strict";
var environment_1 = require("../../../environments/environment");
var rxjs_1 = require("rxjs");
var ServiceBase = (function () {
    function ServiceBase() {
        this.localhost = environment_1.environment.backend;
        this.port = environment_1.environment.port;
    }
    ServiceBase.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return rxjs_1.Observable.throw(error.json() || 'Server error');
    };
    return ServiceBase;
}());
exports.ServiceBase = ServiceBase;
