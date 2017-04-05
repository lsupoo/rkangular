"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
/**
 * Created by oscar.castillo on 28/02/2017.
 */
var ConfirmDialogComponent = (function () {
    function ConfirmDialogComponent() {
        this.status = "open";
        this.titulo = "";
        this.cancel = new core_1.EventEmitter();
        this.accept = new core_1.EventEmitter();
        this.active = false;
    }
    Object.defineProperty(ConfirmDialogComponent.prototype, "model", {
        set: function (dto) {
            this.dataItem = dto;
            dto === undefined ? this.active = false : this.active = true;
        },
        enumerable: true,
        configurable: true
    });
    ConfirmDialogComponent.prototype.onClose = function () {
        this.status = "closed";
        this.closeForm();
    };
    ConfirmDialogComponent.prototype.onAccept = function (e) {
        e.preventDefault();
        this.status = "accepted";
        this.accept.emit(this.dataItem);
        this.active = false;
    };
    ConfirmDialogComponent.prototype.onCancel = function (e) {
        e.preventDefault();
        this.status = "declined";
        this.closeForm();
    };
    ConfirmDialogComponent.prototype.onShow = function () {
        this.active = true;
    };
    ConfirmDialogComponent.prototype.closeForm = function () {
        this.active = false;
        this.cancel.emit();
    };
    return ConfirmDialogComponent;
}());
__decorate([
    core_1.Output()
], ConfirmDialogComponent.prototype, "cancel", void 0);
__decorate([
    core_1.Output()
], ConfirmDialogComponent.prototype, "accept", void 0);
__decorate([
    core_1.Input()
], ConfirmDialogComponent.prototype, "model", null);
ConfirmDialogComponent = __decorate([
    core_1.Component({
        selector: 'confirm-dialog-form',
        template: "\n\n        \n            <kendo-dialog *ngIf=\"active\" (close)=\"onClose()\" >\n        \n                <kendo-dialog-titlebar>\n                    {{titulo}}\n                </kendo-dialog-titlebar>\n            <div class=\"modal-body\">\n                    <div class=\"smart-form\">\n                    \n                    <div class=\"row\">\n                        <section class=\"col col-md-12\">\n                          <label class=\"control-label\">\u00BFEsta seguro que desea eliminar {{titulo}}?</label>\n                          \n                         </section>\n                       \n                    </div>\n                    \n                    </div>  \n               </div>     \n              <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-primary\" (click)=\"onAccept($event)\"> Si\n                </button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"onCancel($event)\"> No\n                </button>\n                \n              </div>\n        </kendo-dialog>\n    \n\n    "
    })
], ConfirmDialogComponent);
exports.ConfirmDialogComponent = ConfirmDialogComponent;
