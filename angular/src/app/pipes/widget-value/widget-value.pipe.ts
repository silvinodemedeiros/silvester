import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'widgetValue'
})
export class WidgetValuePipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) {}

  formatOffset(offset: number): string {
    const sign = offset >= 0 ? '+' : '-';
    const absValue = Math.abs(offset).toString().padStart(2, '0');
    return `${sign}${absValue}00`;
  }

  transform(widget: any): unknown {
    
    let resultValue;
    const valueType = widget.data.metadata.measures?.value;

    switch(valueType) {
      case 'time':
        resultValue = this.datePipe.transform(widget.data.value * 1000, 'HH:mm');
        break;
      case 'distance':
        resultValue = widget.data.value / 1000;
        break;
      case 'timezoneOffset':
        resultValue = this.formatOffset(widget.data.value / 3600);
        break;
      default:
        resultValue = widget.data.value;
        break;
    }

    return resultValue;
  }

}
