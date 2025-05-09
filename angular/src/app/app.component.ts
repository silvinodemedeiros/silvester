import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapClouds } from '@ng-icons/bootstrap-icons';

interface Cell {
  row: number;
  col: number;
  content?: string;
}

interface Widget {
  id: string;
  label: string;
  type: string;
  width: number;
  height: number;
  content?: object | null;
  data?: object | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    NgIcon
  ],
  providers: [
    provideIcons({bootstrapClouds})
  ],
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'silvester';
  apiUrl = 'http://localhost:3000';

  widgetItems = [
    {content: { id: 'w1', label: 'Chart', width: 2, height: 2 }},
    {content: { id: 'w2', label: 'Table', width: 3, height: 1 }},
    {content: { id: 'w3', label: 'Text Box', width: 2, height: 1 }},
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

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    // EVENT SOURCE
    
    const eventSource = new EventSource('http://localhost:3000/events');
    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log('📡 Received event:', notification);
    };


    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push({ row, col });
      }
    }

    const widgetSub = this.httpClient.get<any>(this.apiUrl + '/entities').subscribe((response) => {
      const widgetData = response[0];
      console.log(widgetData);

      this.widgetItems = Object.keys(widgetData).reduce((acc: any[], key, index) => {
        if(typeof widgetData[key] === 'object') {
          return [...acc, {
            content: {
              id: 'wi' + (index + 1),
              type: widgetData[key].type,
              label: key,
              width: 2,
              height: 2
            },
            data: widgetData
          }];
        }

        return acc;
      }, []);
    });

    this.subscription.add(widgetSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

    const widget: Widget = JSON.parse(data);
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
        content: {...widget.content}
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
