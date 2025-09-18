import { effect, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridWidgetSource } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class GridWidgetService {

  _gridWidgets = signal<GridWidgetSource>({});
  update_ = signal(false);
  
  sub = new Subscription();
  apiUrl = 'http://localhost:3000';
  eventsUrl = this.apiUrl + '/events';

  constructor() {
    effect(() => {
      // console.log('grid widget svc log', this._gridWidgets());
    });
  }

  setGridWidgets(data: any) {
    this._gridWidgets.set({...data});
  }

  addGridWidget(event: DragEvent, row: number, col: number) {
    let gridWidgets: any = {};
    
    const widgetJsonStr = event.dataTransfer?.getData('application/json');
    if (!widgetJsonStr) return;

    // populates _gridWidgets array
    const widget = JSON.parse(widgetJsonStr);
    gridWidgets = {
      ...this._gridWidgets(),
      [`${row}${col}`]: {
        row,
        col,
        item: {...widget.item},
        data: {...widget.data}
      }
    };

    // if widget as moved instead of added, delete previous widget
    if (widget.moved) {
      const widgetKey = `${widget.row}${widget.col}`;
      delete gridWidgets[widgetKey];
    }

    this._gridWidgets.set(gridWidgets);
  }

  updateGridWidgets(widgetSourceObj: any) {
    let gridWidgets = {};
      
    // update grid widgets
    Object.keys(this._gridWidgets()).forEach((key) => {
      const gridWidget = this._gridWidgets()[key];
      const gridWidgetLabel = gridWidget.item.label.toLowerCase();

      if (Object.keys(widgetSourceObj).some(
        (label) => label === gridWidgetLabel
      )) {
        gridWidgets = {
          ...this._gridWidgets(),
          [key]: {
            ...gridWidget,
            data: {...widgetSourceObj[gridWidgetLabel]}
          }
        };
      }
    });
    
    this._gridWidgets.set(gridWidgets);
  }
}
