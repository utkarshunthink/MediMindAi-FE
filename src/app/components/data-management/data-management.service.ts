import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class DataManagementService {
    constructor() {}

    arrangeArray(main: any, order: any) {
        return main.sort((a: any, b: any) => {
            const indexA = order.indexOf(a);
            const indexB = order.indexOf(b);
    
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            } else if (indexA !== -1) {
                return -1;
            } else if (indexB !== -1) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    renameHeaderKeys(tableKeys: any[], newKeys: any[]){
        const output = tableKeys.map(item => {
            const modifiedItem = newKeys.find((replacement: any) => replacement.original === item);
            return modifiedItem ? modifiedItem.modify : item;
        });
        return output;
    }
}