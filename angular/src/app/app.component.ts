import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';
import { WidgetSuffixPipe } from './pipes/widget-suffix/widget-suffix.pipe';
import { WidgetValuePipe } from './pipes/widget-value/widget-value.pipe';
import { Cell, GridWidget, LocationValue, MenuItem } from './types';
import { MenuItemService } from './services/menu-item/menu-item.service';
import { GridWidgetService } from './services/grid-widget/grid-widget.service';
import { LeafletDirective, LeafletModule } from '@bluehalo/ngx-leaflet';
import { icon, LatLng, latLng, Layer, MapOptions, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-root',
  // templateUrl: './app2.component.html',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    LeafletModule,
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

  menuItems = computed(() => this.menuItemService.menuItems());

  rows = 6;
  cols = 12;
  cells: Cell[] = [];

  _gridWidgets = computed(() => this.gridWidgetService._gridWidgets());
  gridWidgets = computed(() => Object.values(this._gridWidgets()));

  isDragging = false;
  isDraggingFile = false;
  previewWidget: any = null;

  subscription = new Subscription();

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey() {
    this.isDragging = false;
    this.isDraggingFile = false;
  }

  constructor(
    private menuItemService: MenuItemService,
    private gridWidgetService: GridWidgetService,
    private cd: ChangeDetectorRef
  ) {
    
    // EVENT SOURCE - receives notifications from subscription
    const widgetSource = new EventSource(this.apiUrl + '/events');
    widgetSource.onmessage = (event) => {
      const widgetSourceObj = JSON.parse(event.data).data[0];

      // update menu, grid and refresh
      this.menuItemService.updateMenuItems(widgetSourceObj);
      this.gridWidgetService.updateGridWidgets(widgetSourceObj);
      this.cd.detectChanges();
    };
  }

  ngOnInit(): void {
    
    // initializes cells
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push({ row, col });
      }
    }
  }

  ngOnDestroy(): void {
    this.menuItemService.destroy();
    this.subscription.unsubscribe();
  }

  hasPreview(cellRow: number, cellCol: number): boolean {
    const {width, height} = this.previewWidget.item;
    const {row, col} = this.previewWidget;

    return (
      cellRow >= row && cellRow < row + height &&
      cellCol >= col && cellCol < col + width
    );
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
    
    const widgetJsonStr = event.dataTransfer?.getData('application/json');
    if (!widgetJsonStr) return;

    // populates _gridWidgets array
    const widget = JSON.parse(widgetJsonStr);

    event.preventDefault();

    if (!(row >= 0 && col >= 0)) {
      this.isDragging = false;
      this.previewWidget = null;
      return;
    }

    // adds widget to grid
    this.gridWidgetService.addGridWidget(event, row, col);

    // cleans up after drop
    this.previewWidget = null;

    // initializes if widget is of type location
    if (widget.data.type === 'Location') {
      this.initMapWidget(widget);
    }
  }

  onDragLeave(): void {
  }

  importGrid() {
    this.isDraggingFile = true;
  }

  exportGrid() {

    if (this.gridWidgets.length === 0) {
      console.log('No widgets detected...');
      return;
    }
    
    const json = JSON.stringify(this._gridWidgets(), null, 2); // pretty-print with 2-space indent
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'grid.json';
    anchor.click();

    URL.revokeObjectURL(url); // clean up
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
        this.gridWidgetService.setGridWidgets(json);
        console.log('Loaded JSON:', json);
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };

    reader.readAsText(file);
  }

  /*# MAP INSTRUCTIONS #*/

  mapOptions: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    ]
  };

  mapLayers: Layer[] = [];
  mapPoints: any[] = [];

  @ViewChild('leaflet') leaflet!: LeafletDirective;

  addPoint(lat: number, lng: number, label?: string): void {
    const point = marker([lat, lng], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });

    if (label) {
      point.bindPopup(label);
    }

    this.mapLayers.push(point);
    this.mapPoints = [{lat, lng}];
  }

  initMapWidget(menuItem: MenuItem) {
    const {lat, lng} = menuItem.data.value as LocationValue;
    const latLngView = latLng(lat, lng);

    this.mapOptions = {
      ...this.mapOptions,
      zoom: 15,
      center: latLngView
    };

    if (!this.mapPoints.includes({lat, lng})) {
      this.addPoint(lat, lng);
    }
  }
}
