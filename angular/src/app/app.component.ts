import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, HostListener, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';
import { WidgetSuffixPipe } from './pipes/widget-suffix/widget-suffix.pipe';
import { WidgetValuePipe } from './pipes/widget-value/widget-value.pipe';
import { Cell, EMPTY_WIDGET, GridWidget, LocationValue, MenuItem } from './types';
import { MenuItemService } from './services/menu-item/menu-item.service';
import { GridWidgetService } from './services/grid-widget/grid-widget.service';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { icon, latLng, Layer, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { WidgetComponent } from './components/map-widget/map-widget.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ICON_LIST, MEASUREMENTS_LIST, WEATHER_INFO_LIST } from './models';

@Component({
  selector: 'app-root',
  // templateUrl: './app2.component.html',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    LeafletModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgIcon,
    WidgetComponent,
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
  editForm: FormGroup;

  iconList = ICON_LIST;
  weatherList = WEATHER_INFO_LIST;
  measurementsList = MEASUREMENTS_LIST;

  currentTab_= signal<string>('widgets');

  currentWidgetSource: any;

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey() {
    this.isDragging = false;
    this.isDraggingFile = false;
    this.isCreatingWidget = false;
    
    this.deactivateWidgetEdit();
    this.viewMode_.set(false);
  }

  constructor(
    private menuItemService: MenuItemService,
    private gridWidgetService: GridWidgetService,
    private cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    
    // EVENT SOURCE - receives notifications from subscription
    const widgetSource = new EventSource(this.apiUrl + '/events');
    widgetSource.onmessage = (event) => {
      const widgetSourceObj = JSON.parse(event.data).data[0];
      console.log(widgetSourceObj);

      // update menu, grid and refresh
      this.menuItemService.updateMenuItems(widgetSourceObj);
      this.gridWidgetService.updateGridWidgets(widgetSourceObj);
      
      this.cd.detectChanges();
    };

    this.editForm = this.fb.group({
      title: this.fb.control(''),
      icon: this.fb.control(''),
      measures: this.fb.control(''),
      weatherType: this.fb.control(''),
    });

    const titleSub = this.editForm.get('title')?.valueChanges.subscribe((value: string) => {
      if (this.previousWidget?.data?.metadata?.title) {
        this.previousWidget.data.metadata.title.value = value;
      }
    });

    const iconSub = this.editForm.get('icon')?.valueChanges.subscribe((value: string) => {
      if (this.previousWidget?.data?.metadata?.icon) {
        this.previousWidget.data.metadata.icon.value = value;
      }
    });

    const measuresSub = this.editForm.get('measures')?.valueChanges.subscribe((value: string) => {
      if (this.previousWidget?.data?.metadata?.measures) {
        this.previousWidget.data.metadata.measures.value = value;
      }
    });

    const weatherTypeSub = this.editForm.get('weatherType')?.valueChanges.subscribe((value: string) => {
      if (this.previousWidget?.data.type) {
        this.previousWidget.data.type = value;
      }
    });

    this.subscription.add(titleSub);
    this.subscription.add(iconSub);
    this.subscription.add(measuresSub);
    this.subscription.add(weatherTypeSub);
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

  setTab(tab: string) {
    this.currentTab_.set(tab);
  }

  setWidgetTransfer(event: DragEvent, widget: any, moved = false) {
    widget = {
      ...widget,
      moved
    };

    // populates preview widget
    this.previewWidget = {...widget};
    
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(widget));
      event.dataTransfer.effectAllowed = 'copy';
    } else {
      localStorage.setItem('transfer-widget', JSON.stringify(widget));
    }
  }

  onDragStart(event: DragEvent, widget: any, moved = false): void {
    this.isDragging = true;

    // adds moved attribute to widget so it's retrieved on drop
    this.setWidgetTransfer(event, widget, moved);
  }

  transferEmptyWidget(event: any, row: number, col: number) {
    const emptyWidget = { ...EMPTY_WIDGET, row, col };
    this.setWidgetTransfer(event, emptyWidget, false);
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

    if (!(row >= 0 && col >= 0)) {
      this.isDragging = false;
      this.previewWidget = null;
      return;
    }

    // adds widget to grid
    this.gridWidgetService.addGridWidget(event, row, col);

    // cleans up after drop
    this.previewWidget = null;
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

  /*# VIEW MODE #*/

  viewMode_ = signal(false);
  darkMode_ = signal(false);

  toggleViewMode() {
    const viewModeValue = this.viewMode_();
    this.viewMode_.set(!viewModeValue);

    if (!viewModeValue) {
      this.deactivateWidgetEdit();
    }
  }

  /*# DRAG HANDLE SHENANIGANS #*/

  handleOnMouseDown(event: MouseEvent) {
    (event.target as any)?.parentNode.setAttribute('draggable', 'true')
  }
  handleOnMouseUp(event: MouseEvent) {
    (event.target as any)?.parentNode.setAttribute('draggable', 'false')
  }

  /*# CREATE WIDGET INSTRUCTIONS #*/

  isCreatingWidget = false;
  creationWidget: any = null;

  toggleWidgetCreation() {
    this.isCreatingWidget = !this.isCreatingWidget;
  }

  handleCellClick(event: any, row: number, col: number) {
    this.transferEmptyWidget(event, row, col);
    this.onDrop(event, row, col);
    this.isCreatingWidget = false;
  }

  /*# REMOVE WIDGET #*/
  removeWidget() {
    this.gridWidgetService.removeWidget(this.previousWidget);
    this.deactivateWidgetEdit();
  }

  /*# EDIT WIDGET INSTRUCTIONS #*/
  isEditingWidget = false;
  previousWidget: GridWidget | null = null;

  toggleWidgetEdit(widget: GridWidget) {
    if (this.isEditingWidget) {
      if (this.previousWidget?.item.id === widget.item.id) {
        this.deactivateWidgetEdit();
      } else {
        this.previousWidget = widget;
        this.populateWidgetEditForm(widget);
      }
    } else {
      this.isEditingWidget = !this.isEditingWidget;
  
      if (!this.isEditingWidget) {
        this.deactivateWidgetEdit();
      } else {
        this.previousWidget = widget;
        this.populateWidgetEditForm(widget);
      }
    }
  }

  populateWidgetEditForm(widget: GridWidget) {
    const title = widget.data.metadata?.title?.value;
    const icon = widget.data.metadata?.icon?.value;
    const measures = widget.data.metadata?.measures?.value;
    const weatherType = widget.data.type;
    
    this.editForm.get('title')?.patchValue(title);
    this.editForm.get('icon')?.patchValue(icon);
    this.editForm.get('measures')?.patchValue(measures);
    this.editForm.get('weatherType')?.patchValue(weatherType);
  }

  deactivateWidgetEdit() {
    this.previousWidget = null;
    this.isEditingWidget = false;
    this.editForm.reset();
  }
}
