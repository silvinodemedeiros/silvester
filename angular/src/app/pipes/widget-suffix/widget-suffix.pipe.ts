import { Pipe, PipeTransform } from '@angular/core';

export const widget_suffix = (unit: unknown): string => {
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

@Pipe({
  name: 'widgetSuffix'
})
export class WidgetSuffixPipe implements PipeTransform {

  transform(unit: unknown): unknown {
    return widget_suffix(unit);
  }

}
