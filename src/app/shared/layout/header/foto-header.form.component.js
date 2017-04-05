"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var adjunto_1 = require("../../../+personal/+empleado/adjunto");
var componentBase_1 = require("../../../+common/service/componentBase");
var FotoHeaderFormComponent = (function (_super) {
    __extends(FotoHeaderFormComponent, _super);
    function FotoHeaderFormComponent(backendService) {
        var _this = _super.call(this, backendService, '') || this;
        _this.backendService = backendService;
        _this.uploadSaveUrl = _this.urlUploadFile;
        _this.uploadRemoveUrl = _this.urlRemoveFile;
        _this.uploadValidation = { allowedExtensions: [".jpg", ".png"], maxFileSize: 8388608 };
        _this.cancel = new core_1.EventEmitter();
        _this.save = new core_1.EventEmitter();
        _this.active = false;
        _this.titulo = "Foto Empleado";
        _this.editForm = new forms_1.FormGroup({
            'Imagen': new forms_1.FormControl()
        });
        return _this;
    }
    Object.defineProperty(FotoHeaderFormComponent.prototype, "model", {
        set: function (dto) {
            this.file = dto;
            dto === undefined ? this.active = false : this.active = true;
        },
        enumerable: true,
        configurable: true
    });
    FotoHeaderFormComponent.prototype.onSuccessUpload = function (event) {
        this.file = event.response.json();
    };
    FotoHeaderFormComponent.prototype.onSave = function (e) {
        e.preventDefault();
        this.save.emit(this.file);
        this.active = false;
    };
    FotoHeaderFormComponent.prototype.subirImagen = function () {
        this.model = new adjunto_1.Adjunto();
        this.active = true;
    };
    FotoHeaderFormComponent.prototype.onCancel = function (e) {
        e.preventDefault();
        this.closeForm();
    };
    FotoHeaderFormComponent.prototype.onClose = function () {
        this.closeForm();
    };
    FotoHeaderFormComponent.prototype.closeForm = function () {
        this.active = false;
        this.cancel.emit();
    };
    return FotoHeaderFormComponent;
}(componentBase_1.ComponentBase));
__decorate([
    core_1.Input()
], FotoHeaderFormComponent.prototype, "model", null);
__decorate([
    core_1.Output()
], FotoHeaderFormComponent.prototype, "cancel", void 0);
__decorate([
    core_1.Output()
], FotoHeaderFormComponent.prototype, "save", void 0);
FotoHeaderFormComponent = __decorate([
    core_1.Component({
        selector: 'foto-header-form',
        template: "\n\n<kendo-dialog *ngIf=\"active\" (close)=\"onClose()\" >\n    \n            <kendo-dialog-titlebar>\n                {{titulo}}\n            </kendo-dialog-titlebar>\n        <div class=\"modal-body\">\n            <div class=\"smart-form\" style=\"width: 600px;\">\n                \n            <div class=\"row\">\n            \n                 \n                 <section class=\"col col-md-12\">\n                  <label>Imagen</label>\n                  <label class=\"input\"> \n                        <kendo-upload [saveUrl]=\"uploadSaveUrl\" [removeUrl]=\"uploadRemoveUrl\" [multiple]=\"false\" [restrictions]=\"uploadValidation\" (success)=\"onSuccessUpload($event)\"></kendo-upload>\n                  </label>\n                 </section>\n            \n            </div>\n             \n            </div>  \n           </div>     \n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"onSave($event)\"><i class=\"fa fa-sign-out\"></i> Agregar\n            </button>\n            <button type=\"button\" class=\"btn btn-default\" (click)=\"onCancel($event)\"><i class=\"fa fa-arrow-circle-left\"></i> Cancelar\n            </button>\n          </div>\n    </kendo-dialog>\n\n\n   \n"
    })
], FotoHeaderFormComponent);
exports.FotoHeaderFormComponent = FotoHeaderFormComponent;
