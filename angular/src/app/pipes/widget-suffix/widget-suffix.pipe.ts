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
      case 'angle':
        suffix = '°';
        break;
      case 'distance':
        suffix = 'km';
        break;
      case 'hectoPascal':
        suffix = 'hPa';
        break;
      case 'velocity':
        suffix = 'm/s';
        break;
      default:
        suffix = '';
        break;
    }
    
    return suffix;
  }

}
