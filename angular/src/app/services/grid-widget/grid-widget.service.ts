import { effect, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridWidget, GridWidgetSource } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class GridWidgetService {

  _gridWidgets = signal<GridWidgetSource>({});
  update_ = signal(false);
  
  sub = new Subscription();
  apiUrl = 'http://localhost:3000';
  eventsUrl = this.apiUrl + '/events';

  widgetIdCounter = 1;
  widgetSource_ = signal<any>(null);

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
    let widgetJsonStr;

    // retrieves widget data FROM drag event data transfer OR FROM local storage)
    if (event.dataTransfer) {
      widgetJsonStr = event.dataTransfer?.getData('application/json');
    } else {
      widgetJsonStr = localStorage.getItem('transfer-widget');
    };

    if (!widgetJsonStr) return;

    // populates _gridWidgets array
    const widget = JSON.parse(widgetJsonStr);
    gridWidgets = {
      ...this._gridWidgets(),
      [`${row}${col}`]: {
        row,
        col,
        item: {
          ...widget.item,
          id: widget.moved ? widget.item.id : 'wi_' + this.widgetIdCounter
        },
        data: {...widget.data}
      }
    };

    this._gridWidgets.set(gridWidgets);

    // increments widget counter
    this.widgetIdCounter += 1;

    return gridWidgets[`${row}${col}`];
  }

  removeWidget(widget: GridWidget | null) {

    this._gridWidgets.update((gridWidgetSource: GridWidgetSource) => {
      return Object.entries(gridWidgetSource).reduce((acc, [widgetRowCol, gridWidget]) => {
        if (widget?.item.id === gridWidget.item.id) {
          return acc;
        }

        return {
          ...acc,
          [widgetRowCol]: {...gridWidget}
        };
      }, {});
    });
  }

  updateGridWidgets(widgetSourceObj: any) {

    this._gridWidgets.update((gridWidgetSource: GridWidgetSource) => {
      return Object.entries(gridWidgetSource).reduce((acc, [widgetRowCol, gridWidget]) => {
        const widgetType = gridWidget.data.type.toLowerCase();

        if (widgetType === gridWidget.data.type) {
          return {
            ...acc,
            [widgetRowCol]: {
              ...gridWidget,
              data: {
                ...gridWidget.data,
                value: widgetSourceObj[widgetType].value
              }
            }
          }
        }

        return {
          ...acc,
          [widgetRowCol]: {...gridWidget}
        };
      }, {});
    });
  }
}
