import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';

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
    NgIcon
  ],
  providers: [
    provideIcons(bootstrapIcons)
  ],
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'silvester';
  apiUrl = 'http://localhost:3000';

  widgetItems = [
    {item: { id: 'w1', label: 'Chart', width: 2, height: 2 }},
    {item: { id: 'w2', label: 'Table', width: 3, height: 1 }},
    {item: { id: 'w3', label: 'Text Box', width: 2, height: 1 }},
  ];

  rows = 6;
  cols = 12;
  cells: Cell[] = [];

  _widgets: Record<any, any> = {};

  isDragging = false;
  subscription = new Subscription();

  get widgets() {
    return Object.values(this._widgets);
  }

  constructor(
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // EVENT SOURCE
    
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

    const widgetSub = this.httpClient.get<any>(this.apiUrl + '/entities').subscribe((response) => {
      const widgetObject = response[0];
      this.updateWidgetItems(widgetObject);

      console.log(widgetObject);
    });

    this.subscription.add(widgetSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateWidgetItems(widgetsObject: any) {
    this.widgetItems = Object.keys(widgetsObject).reduce((acc: any[], key, index) => {
      if(typeof widgetsObject[key] === 'object') {
        return [...acc, {
          item: {
            id: 'wi' + (index + 1),
            type: widgetsObject[key].type,
            label: key,
            width: 2,
            height: 2
          },
          data: {...widgetsObject[key]}
        }];
      }

      return acc;
    }, []);
  }

  onDragStart(event: DragEvent, widget: any, moved = false): void {
    this.isDragging = true;

    // adds moved attribute to widget so it's retrieved on drop
    widget = {
      ...widget,
      moved
    };
    
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(widget));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragOver(event: DragEvent, row: number, col: number): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');
    if (!data) return;

    const widget = JSON.parse(data);
  }

  onDrop(event: DragEvent, row: number, col: number): void {

    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');

    if (!(row >= 0 && col >= 0) || !data) {
      this.isDragging = false;
      return;
    }

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

    if (widget.moved) {
      const widgetKey = `${widget.row}${widget.col}`;
      delete this._widgets[widgetKey];
    }
  }

  onDragLeave(): void {
  }
}
