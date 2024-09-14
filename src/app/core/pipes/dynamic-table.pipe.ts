import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dynamicTablePipe',
    standalone: true
})
export class DynamicTablePipe implements PipeTransform{
    transform(value: any, limit: number = 18, checkLen: number = 21, isEmpty = false): string {
        if(typeof value == 'boolean') value = value? 'True': 'False';
        else {
            value = value || 'N/A';
            if(value.toString().length > checkLen) value = value.toString().substring(0, limit) + '...';
        }
        if(isEmpty && value=='N/A') return '';
        return value;
    }
}