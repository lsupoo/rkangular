"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var kendo_angular_buttons_1 = require("@progress/kendo-angular-buttons");
var kendo_angular_grid_1 = require("@progress/kendo-angular-grid");
var kendo_angular_dialog_1 = require("@progress/kendo-angular-dialog");
var kendo_angular_upload_1 = require("@progress/kendo-angular-upload");
var kendo_angular_dropdowns_1 = require("@progress/kendo-angular-dropdowns");
var smartadmin_input_module_1 = require("../../shared/forms/input/smartadmin-input.module");
var smartadmin_module_1 = require("../../shared/smartadmin.module");
var jquery_ui_module_1 = require("../../shared/ui/jquery-ui/jquery-ui.module");
var regularizar_vacacion_component_1 = require("./regularizar.vacacion.component");
var smartadmin_validation_module_1 = require("../../shared/forms/validation/smartadmin-validation.module");
var simple_notifications_module_1 = require("angular2-notifications/src/simple-notifications.module");
var growl_1 = require("primeng/components/growl/growl");
var angular2_text_mask_1 = require("angular2-text-mask");
var ng2_completer_1 = require("ng2-completer");
var ng2_auto_complete_1 = require("ng2-auto-complete");
var RegularizarVacacionModule = (function () {
    function RegularizarVacacionModule() {
    }
    return RegularizarVacacionModule;
}());
RegularizarVacacionModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            smartadmin_module_1.SmartadminModule,
            kendo_angular_buttons_1.ButtonsModule,
            http_1.HttpModule,
            http_1.JsonpModule,
            kendo_angular_grid_1.GridModule,
            kendo_angular_dropdowns_1.DropDownsModule,
            kendo_angular_dialog_1.DialogModule,
            kendo_angular_upload_1.UploadModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            smartadmin_input_module_1.SmartadminInputModule,
            smartadmin_validation_module_1.SmartadminValidationModule,
            jquery_ui_module_1.JqueryUiModule,
            simple_notifications_module_1.SimpleNotificationsModule,
            growl_1.GrowlModule,
            angular2_text_mask_1.TextMaskModule,
            ng2_completer_1.Ng2CompleterModule,
            ng2_auto_complete_1.Ng2AutoCompleteModule
        ],
        declarations: [regularizar_vacacion_component_1.RegularizarVacacionComponent],
        bootstrap: [regularizar_vacacion_component_1.RegularizarVacacionComponent]
    })
], RegularizarVacacionModule);
exports.RegularizarVacacionModule = RegularizarVacacionModule;
