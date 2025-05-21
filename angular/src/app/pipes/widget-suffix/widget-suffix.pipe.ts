import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'widgetSuffix'
})
export class WidgetSuffixPipe implements PipeTransform {

  transform(unit: unknown, ...args: unknown[]): unknown {
    let suffix = '';

    switch (unit) {
      case 'percentage':
        suffix = '%';
        break;
      case 'temperature':
        suffix = '°C';
        break;
      case 'distance':
        suffix = 'm';
        break;
      case 'hectoPascal':
        suffix = 'hPa';
        break;
      case 'angle':
        suffix = '°';
        break;
      default:
        suffix = '';
        break;
    }
    
    return suffix;
  }

}
