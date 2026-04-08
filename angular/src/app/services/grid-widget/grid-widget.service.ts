import { computed, effect, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridWidget, GridWidgetSource } from '../../types';
import { GRID_TEMPLATE } from './grid-widget.model';

@Injectable({
  providedIn: 'root'
})
export class GridWidgetService {

  gridWidgets_ = signal<GridWidgetSource>({});
  update_ = signal(false);
  
  sub = new Subscription();
  apiUrl = 'http://localhost:3000';
  eventsUrl = this.apiUrl + '/events';

  widgetIdCounter_ = computed(() => {
    const gridWidgets = this.gridWidgets_();

    let highestId = Object.values(gridWidgets).reduce((acc, widget) => {
      const widgetIdStr = widget.item.id.split('_')[1];
      const widgetId = parseInt(widgetIdStr, 10);
      return widgetId <= acc ? acc : widgetId;
    }, 1);

    highestId += 1;

    return highestId;
  });

  widgetSource_ = signal<any>(null);

  constructor() {
    effect(() => {
      // console.log('grid widget log', this.gridWidgets_());
    });
  }

  loadGridTemplate() {
    this.gridWidgets_.set(GRID_TEMPLATE);
  }

  setGridWidgets(data: any) {
    this.gridWidgets_.set({...data});
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

    // populates gridWidgets_ array
    const widget = JSON.parse(widgetJsonStr);
    gridWidgets = {
      ...this.gridWidgets_(),
      [`${row}_${col}`]: {
        row,
        col,
        item: {
          ...widget.item,
          id: widget.moved ? widget.item.id : 'wi_' + this.widgetIdCounter_()
        },
        data: {...widget.data}
      }
    };

    this.gridWidgets_.set(gridWidgets);

    return gridWidgets[`${row}${col}`];
  }

  removeWidget(widget: GridWidget | null) {

    this.gridWidgets_.update((gridWidgetSource: GridWidgetSource) => {
      return Object.entries(gridWidgetSource).reduce((acc, gridWidgetEntry) => {
        const [widgetRowCol, gridWidget] = gridWidgetEntry;

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

    this.gridWidgets_.update((gridWidgetSource: GridWidgetSource) => {
      return Object.entries(gridWidgetSource).reduce((acc, [widgetRowCol, gridWidget]) => {
        const widgetType = gridWidget.data.type.toLowerCase();

        if (widgetType === gridWidget.data.type && widgetSourceObj[widgetType]) {
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
