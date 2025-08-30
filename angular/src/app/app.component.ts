import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, computed, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';
import { WidgetSuffixPipe } from './pipes/widget-suffix/widget-suffix.pipe';
import { WidgetValuePipe } from './pipes/widget-value/widget-value.pipe';
import { MenuWidget, Cell } from './types';
import { MenuWidgetService } from './services/menu-widget/menu-widget.service';

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

  menuWidgets = computed(() => {
    return this.menuWidgetService.menuWidgets();
  });

  rows = 6;
  cols = 12;
  cells: Cell[] = [];

  _gridWidgets: Record<any, any> = {};

  isDragging = false;
  isDraggingFile = false;
  previewWidget: any = null;

  subscription = new Subscription();

  get gridWidgets() {
    return Object.values(this._gridWidgets);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey() {
    this.isDragging = false;
    this.isDraggingFile = false;
  }

  constructor(
    private menuWidgetService: MenuWidgetService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
    // EVENT SOURCE - receives events from backend
    const widgetSource = new EventSource(this.apiUrl + '/events');
    widgetSource.onmessage = (event) => {
      const widgetSourceObj = JSON.parse(event.data).data[0];

      // update menuWidgets data
      this.menuWidgetService.updateMenuWidgets(widgetSourceObj);
      
      // update grid widgets
      Object.keys(this._gridWidgets).forEach((key) => {
        const gridWidget = this._gridWidgets[key];
        const gridWidgetLabel = gridWidget.item.label.toLowerCase();

        if (Object.keys(widgetSourceObj).some((label) => label === gridWidgetLabel)) {
          this._gridWidgets = {
            ...this._gridWidgets,
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

    // initializes menu service
    this.menuWidgetService.init();
  }

  ngOnDestroy(): void {
    this.menuWidgetService.destroy();
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

  exportGrid() {

    if (this.gridWidgets.length === 0) {
      console.log('No widgets detected...');
      return;
    }
    
    const json = JSON.stringify(this._gridWidgets, null, 2); // pretty-print with 2-space indent
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

    // populates _gridWidgets array
    const widget = JSON.parse(data);
    this._gridWidgets = {
      ...this._gridWidgets,
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
      delete this._gridWidgets[widgetKey];
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
        this._gridWidgets = {...json};
        console.log('Loaded JSON:', json);
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };

    reader.readAsText(file);
  }

  importGrid() {
    this.isDraggingFile = true;
  }
}
