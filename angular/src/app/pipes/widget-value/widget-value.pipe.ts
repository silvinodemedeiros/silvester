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
    const abs = Math.abs(offset);
    const hours = Math.floor(abs);
    const minutes = Math.round((abs - hours) * 60);
  
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
  
    return `${sign}${hh}${mm}`;
  }

  transform(widget: any): unknown {
    
    let resultValue;
    const valueType = widget.data.metadata.measures?.value;
    const dataType = widget.data.type;

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

    switch(dataType) {
      case 'Integer':
        resultValue = parseInt(resultValue, 10);
        break;
      case 'Float':
        resultValue = parseFloat(resultValue).toFixed(1);
        break;
    }

    return resultValue;
  }

}
