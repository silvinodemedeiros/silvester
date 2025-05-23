import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';
import { WidgetSuffixPipe } from './pipes/widget-suffix/widget-suffix.pipe';
import { WidgetValuePipe } from './pipes/widget-value/widget-value.pipe';

interface Cell {
  row: number;
  col: number;
  item?: string;
}

interface Widget {
  id: string;
  item?: null | {
    id: string;
    label: string;
    width: number;
    height: number;
  };
  data?: any | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    NgIcon,
    WidgetSuffixPipe,
    WidgetValuePipe
  ],
  providers: [
    DatePipe,
    provideIcons(bootstrapIcons)
  ],
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'silvester';
  apiUrl = 'http://localhost:3000';

  widgetItems: any[] = [];

  rows = 6;
  cols = 12;
  cells: Cell[] = [];

  _widgets: Record<any, any> = {};

  isDragging = false;
  subscription = new Subscription();

  previewWidget: any = null;

  get widgets() {
    return Object.values(this._widgets);
  }

  constructor(
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
    // EVENT SOURCE - receives events from backend
    const widgetSource = new EventSource(this.apiUrl + '/events');
    widgetSource.onmessage = (event) => {
      const widgetSourceObj = JSON.parse(event.data).data[0];

      // update widgetItems data
      this.updateWidgetItems(widgetSourceObj);
      
      // update grid widgets
      Object.keys(this._widgets).forEach((key) => {
        const gridWidget = this._widgets[key];
        const gridWidgetLabel = gridWidget.item.label;

        if (Object.keys(widgetSourceObj).some((label) => label === gridWidgetLabel)) {
          this._widgets = {
            ...this._widgets,
            [key]: {
              ...gridWidget,
              data: {...widgetSourceObj[gridWidgetLabel]}
            }
          };
        }
      });
      
      this.cd.detectChanges();
    };

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push({ row, col });
      }
    }

    // populates widgets with first item
    const widgetSub = this.httpClient.get<any>(this.apiUrl + '/entities').subscribe((response) => {
      const widgetObject = response[0];
      this.updateWidgetItems(widgetObject);
    });

    this.subscription.add(widgetSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hasPreview(cellRow: number, cellCol: number): boolean {
    const {width, height} = this.previewWidget.item;
    const {row, col} = this.previewWidget;

    return (
      cellRow >= row && cellRow < row + width &&
      cellCol >= col && cellCol < col + height
    );
  }

  updateWidgetItems(widgetsObject: any) {
    this.widgetItems = Object.keys(widgetsObject).reduce((acc: any[], key, index) => {
      if(typeof widgetsObject[key] === 'object') {
        return [...acc, {
          item: {
            id: 'wi' + (index + 1),
            type: widgetsObject[key].type,
            label: widgetsObject[key].metadata.title.value,
            width: 2,
            height: 2
          },
          data: {...widgetsObject[key]}
        }];
      }

      return acc;
    }, []);
  }

  exportGrid() {

    if (this.widgets.length === 0) {
      console.log('No widgets detected...');
      return;
    }
    
    const json = JSON.stringify(this._widgets, null, 2); // pretty-print with 2-space indent
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'grid.json';
    anchor.click();

    URL.revokeObjectURL(url); // clean up
  }

  onDragStart(event: DragEvent, widget: any, moved = false): void {
    this.isDragging = true;

    // adds moved attribute to widget so it's retrieved on drop
    widget = {
      ...widget,
      moved
    };

    // populates preview widget
    this.previewWidget = {...widget};
    
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(widget));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragOver(event: DragEvent, row: number, col: number): void {
    event.preventDefault();

    // updates drop preview (with (-1, -1) as invalid)
    if (
      row != -1 && col != -1 && 
      (this.previewWidget?.row != row || this.previewWidget?.col != col)
    ) {
      this.previewWidget = {
        ...this.previewWidget,
        row,
        col
      };
    }
  }

  onDrop(event: DragEvent, row: number, col: number): void {

    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');


    if (!(row >= 0 && col >= 0) || !data) {
      this.isDragging = false;
      this.previewWidget = null;
      return;
    }

    // populates _widgets array
    const widget = JSON.parse(data);
    this._widgets = {
      ...this._widgets,
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
      delete this._widgets[widgetKey];
    }

    // cleans up after drop
    this.previewWidget = null;
  }

  onDragLeave(): void {
  }

  onUploadDragOver(): void {}

  onUploadDragLeave(): void {}

  onUploadDrop(event: any): void {
    this.isDraggingFile = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file || file.type !== 'application/json') {
      console.warn('Only JSON files are accepted.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this._widgets = {...json};
        console.log('Loaded JSON:', json);
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };

    reader.readAsText(file);
  }

  isDraggingFile = false;

  importGrid() {
    this.isDraggingFile = true;
  }
}
