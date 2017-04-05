import { Component, Directive, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, Validators, FormBuilder, FormControlName, FormGroup, FormControl } from '@angular/forms';
import { Jsonp, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

class Product {
    constructor(
        public ProductID?: number,
        public ProductName?: string,
        public Discountinued?: boolean,
        public UnitsInStock?: number
    ) { }
}

@Component({
    selector: 'kendo-grid-edit-form',
    styles: [`
       .ng-valid {
            border-left: 5px solid #42A948;
        }

        .ng-invalid {
            border-left: 5px solid #a94442;
        }
        .invalid {
            color: #a94442;
        }
    `],
    template: `
        <kendo-dialog *ngIf="active" title="Edit" (onClose)="active=false">
            <form [formGroup]="editForm">
                <div>
                    <label for="ProductName">ProductName</label>
                    <input type="text" formControlName="ProductName" [(ngModel)]="dataItem.ProductName" />
                    <div [hidden]="editForm.controls.ProductName.valid || editForm.controls.ProductName.pristine" class="invalid">
                        ProductName is required
                    </div>
                </div>
                <div>
                    <label for="UnitPrice">UnitPrice</label>
                    <input type="text" formControlName="UnitPrice" [(ngModel)]="dataItem.UnitPrice"/>
                </div>
                <div>
                    <label for="Discontinued">Discontinued</label>
                    <input type="checkbox" formControlName="Discontinued" [(ngModel)]="dataItem.Discontinued"/>
                </div>
                <div>
                    <label for="UnitsInStock">UnitsInStock</label>
                    <input type="text" formControlName="UnitsInStock" [(ngModel)]="dataItem.UnitsInStock"/>
                    <div [hidden]="editForm.controls.UnitsInStock.valid || editForm.controls.UnitsInStock.pristine" class="invalid">
                        UnitsInStock must be between 0 and 99
                    </div>
                </div>
            </form>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">Cancel</button>
                <button class="k-button k-primary" [disabled]="!editForm.valid" (click)="onSave($event)">Save</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})

export class GridEditFormComponent {
    dataItem;
    editForm;
    @Input() public set model (product: Product) {
        this.dataItem = product;
        product === undefined ? this.active = false: this.active = true;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.editForm = new FormGroup({
            'ProductName': new FormControl("", Validators.required),
            'UnitPrice': new FormControl(),
            'UnitsInStock': new FormControl("", Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
            'Discontinued': new FormControl(false)
        })
    }

    public active: boolean = false;

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.dataItem);
        this.active = false;
    }
    public onCancel(e): void {
        e.preventDefault();
        this.active = false;
        this.cancel.emit(undefined);
    }

    public addProduct() {
        this.model = new Product();
        this.active = true;
    }
}

@Component({
    selector: 'grid-test',
    template: `
      <button (click)="addProduct()" class="k-button k-button-icontext k-grid-add">Add new</button>
      <kendo-grid [data]="view">
        <kendo-grid-column field="ProductName"></kendo-grid-column>
        <kendo-grid-column field="UnitPrice" title="UnitPrice"></kendo-grid-column>
        <kendo-grid-column field="Discontinued" title="Discontinued"></kendo-grid-column>
        <kendo-grid-column field="UnitsInStock" title="UnitsInStock"></kendo-grid-column>
         <kendo-grid-column>
            <template kendoHeaderTemplate>
                Editing
            </template>
            <template kendoGridCellTemplate let-dataItem>
                <button (click)="onEdit(dataItem)" class="k-button k-button-icontext k-grid-edit">Edit</button>
                <button (click)="onDelete(dataItem)" class="k-button k-button-icontext k-grid-delete">Delete</button>
            </template>
        </kendo-grid-column>
      </kendo-grid>
      <kendo-grid-edit-form [model]="dataItem" (cancel)="onCancel()" (save)="onSave($event)"></kendo-grid-edit-form>
  `
})
class AppComponent {
    public dataItem: Product;

    @ViewChild(GridEditFormComponent) protected editFormComponent: GridEditFormComponent;

    private view: Array<Product>;

    constructor(private jsonp: Jsonp) {
        this.getProducts()
            .subscribe(data => this.view = data);
    }

    public onEdit(dataItem: any): void {
        this.dataItem = dataItem;
    }

    public onCancel(): void {
        this.dataItem = undefined;
    }

    public addProduct(): void {
        this.editFormComponent.addProduct();
    }

    public onSave(product: Product): void {
        const operation = product.ProductID === undefined ?
            this.createProduct(product) :
            this.saveProducts(product);

        operation.switchMap(x => this.getProducts())
            .subscribe((response: Product[]) => {
                this.view = response;
            });
    }

    public onDelete(e: Product): void {
        this.deleteProduct(e)
            .switchMap(x => this.getProducts())
            .subscribe((response: Product[]) => {
                this.view = response;
            });
    }

    public getProducts(): Observable<Product[]> {
        return this.fetch();
    }

    public saveProducts(data: Product): Observable<Product[]> {
        return this.fetch("update", data);
    }

    public createProduct(data: Product): Observable<Product[]> {
        data.ProductID = null;
        return this.fetch("create", data);
    }

    public deleteProduct(data: Product): Observable<Product[]> {
        return this.fetch("destroy", data);
    }

    private fetch(action: string = "", data?: Product): Observable<Product[]>  {
        return this.jsonp
            .get(`http://demos.telerik.com/kendo-ui/service/Products/${action}?callback=JSONP_CALLBACK${this.serializeModels(data)}`)
            .map(response => response.json());
    }

    private serializeModels(data?: Product): string {
        return data ? `&models=${JSON.stringify([data])}` : '';
    }
}