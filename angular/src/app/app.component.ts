import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Cell {
  row: number;
  col: number;
  content?: string;
}

interface Widget {
  id: string;
  label: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule
  ],
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
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

  get widgets() {
    return Object.values(this._widgets);
  }

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push({ row, col });
      }
    }
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
