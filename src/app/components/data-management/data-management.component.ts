import { CommonModule, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonAction } from "src/app/core/interfaces/action-button.interface";
import { DynamicTablePipe } from "src/app/core/pipes/dynamic-table.pipe";
import { DataManagementService } from "./data-management.service";

@Component({
    selector: 'app-data-management',
    templateUrl: './data-management.component.html',
    standalone: true,
    imports: [CommonModule, DynamicTablePipe, FormsModule, NgSwitch, NgSwitchCase, NgSwitchDefault],
    styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent {
    @Input() databaseList: any[] = [];
    @Input() title: string = 'All Routes';
    @Input() removeKeys: string[] = [];
    @Input() dateKeys: string[] = [];
    @Input() orderKeys: string[] = [];
    @Input() actionKeys: ButtonAction[] = [];
    @Input() renameHeaderKeys: any[] = [];
    @Input() actionButtonType: string = 'Action';
    @Output() openModal =  new EventEmitter();

    public array: any = Array;
    public actionName: string = 'Action'

    public itemPerPage: number = 10;
    public tableKeys: any[] = [];
    public tableHeadingKeys: any[] = [];
    public isCopied: boolean = false;
    public isHeader: boolean = false;

    public checkedItemsList: any[] = [];
    public selectedItems: any[] = [];
    public isSelectedAll: boolean[] = [false];
    public userRole: string = '';
    
    constructor(
        private router: Router, 
        private dataManagementService: DataManagementService){}

    ngOnChanges(){
        if(this.databaseList && this.databaseList.length){
            this.tableKeys = Object.keys(this.databaseList[0]);
            this.tableKeys = this.dataManagementService.arrangeArray(this.tableKeys, this.orderKeys);
            // this.tableKeys = this.dataManagementService.renameHeaderKeys(this.tableKeys, this.renameHeaderKeys);
            this.transformKeyValue();
        }
        
    }

    transformKeyValue(){
        if(this.removeKeys.length) this.removeItemsFromArray();
        if(this.actionKeys.length) this.tableKeys.unshift(this.actionButtonType);
        this.tableHeadingKeys = this.dataManagementService.renameHeaderKeys(this.tableKeys, this.renameHeaderKeys);
        this.tableHeadingKeys = this.tableHeadingKeys.map((key: string) => {
            // return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            return key
            .replace(/^is([A-Z])/, '$1') // Remove 'is' at the start if followed by a capital letter
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters (camelCase)
            .replace(/_/g, ' ') // Replace underscores with spaces (snake_case)
            .replace(/\b\w/g, (char: string) => char.toUpperCase()); // Capitalize the first letter of each word
        });
    }

    removeItemsFromArray() {
        this.tableKeys = this.tableKeys.filter((item: string) => !this.removeKeys.includes(item));
    }

    navigate(item: any, action: any){
        if(action.isModal) this.openModal.emit({ ...item, action });
        else if(action.isNavigate) this.router.navigateByUrl(action.navigateUrl);
        else return;
    }

    navigateTo(inventory: any, status: string, from: string){
        this.openModal.emit({ inventory, status: status.toLowerCase(), from });
    }

}