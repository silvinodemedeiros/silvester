import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, HostListener, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';
import { WidgetSuffixPipe } from './pipes/widget-suffix/widget-suffix.pipe';
import { WidgetValuePipe } from './pipes/widget-value/widget-value.pipe';
import { Cell, EMPTY_WIDGET, GridWidget } from './types';
import { MenuItemService } from './services/menu-item/menu-item.service';
import { GridWidgetService } from './services/grid-widget/grid-widget.service';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { WidgetComponent } from './components/map-widget/map-widget.component';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ICON_LIST, MEASUREMENTS_LIST, WEATHER_INFO_LIST } from './models';
import { HtmlGeneratorService } from './services/html-generator/html-generator.service';

@Component({
  selector: 'app-root',
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
    HtmlGeneratorService,
    provideIcons(bootstrapIcons)
  ],
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'silvester';
  apiUrl = 'http://localhost:3000';

  menuItems = computed(() => this.menuItemService.menuItems());

  cols = 24;
  rows = 12;
  cells: Cell[] = [];
  macroCells: Cell[] = [];

  gridWidgets_ = computed(() => this.gridWidgetService.gridWidgets_());
  gridWidgets = computed(() => Object.values(this.gridWidgets_()));
  isGridEmpty_ = computed(() => Array.isArray(this.gridWidgets()) && this.gridWidgets().length === 0);

  isDragging = false;
  isDraggingFile = false;
  previewWidget: any = null;

  subscription = new Subscription();
  editForm: FormGroup;

  iconList = ICON_LIST;
  weatherList = WEATHER_INFO_LIST;
  measurementsList = MEASUREMENTS_LIST;
  currentWidgetSource: any;

  // MAGNIFICATION PROPERTIES
  focusedWidgetElem: any = null;

  // COLOR PROPERTIES
  previewMode_ = signal(false);
  darkMode_ = signal(false);

  // MOVE WIDGET PROPERTIES
  movedWidget: GridWidget | null = null;

  constructor(
    private menuItemService: MenuItemService,
    private gridWidgetService: GridWidgetService,
    private htmlGeneratorService: HtmlGeneratorService,
    private cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    
    // SUBSCRIBES TO WIDGET SOURCE - receives notifications from subscription
    const widgetSource = new EventSource(this.apiUrl + '/events');
    widgetSource.onmessage = (event) => {
      this.currentWidgetSource = JSON.parse(event.data).data[0];

      // update menu, grid and refresh
      this.updateGridWidgets();
    };

    effect(() => {
      this.currentWidgetSource = this.menuItemService.widgetSource_();
    });

    this.editForm = this.fb.group({
      title: this.fb.control(''),
      icon: this.fb.control(''),
      measures: this.fb.control(''),
      weatherType: this.fb.control(''),
    });

    effect(() => {
      const previewMode = this.previewMode_();

      if (!previewMode) {
        this.darkMode_.set(false);
      }
    });
  }

  terminateWidgetFocus() {
    this.focusedWidgetElem?.classList.remove('magnified');
    this.focusedWidgetElem = null;
  }

  focusWidget(event: any) {
    if (this.previewMode_()) {
      event.target.focus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.handleOnEscapeKey(null);
  }

  handleOnEscapeKey(escParams: {
    skipImportLayer: boolean,
    skipPreviewLayer: boolean
  } | null) {

    if (this.focusedWidgetElem) {
      this.terminateWidgetFocus();
      return;
    }
    
    this.isDragging = false;

    if (!escParams?.skipImportLayer) {
      this.isDraggingFile = false;
    }

    this.onDrop(null, -1, -1);

    if (!escParams?.skipPreviewLayer) {
      this.previewMode_.set(false);
    }
    
  }

  @HostListener('document:keydown', ['$event'])
  onTabKey(event: KeyboardEvent) {
    const focusableElements = document.querySelectorAll('[tabindex="0"]');
    const firstElement: any = focusableElements[0];
    const lastElement: any = focusableElements[focusableElements.length - 1];
    
    if (event.key === 'Tab') {
      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    } else if (event.key === "Enter") {

      const activeElement = document.activeElement;
      const darkModeToggle = document.getElementById("dark-mode-toggle");

      if (activeElement === darkModeToggle) {
        this.toggleDarkMode();
      }

    }
  }

  onWidgetFocus(event: any) {
    if (this.previewMode_()) {
      event.target.classList.add('magnified');
      this.focusedWidgetElem = event.target;
    }
  }

  onWidgetBlur(event: any) {
    if (this.previewMode_()) {
      event.target.classList.remove('magnified');
      this.focusedWidgetElem = null;
    }
  }

  ngOnInit(): void {
    
    // initializes cells
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push({ row, col });
      }
    }
    
    // initializes macro cells
    for (let row = 0; row < this.rows / 2; row++) {
      for (let col = 0; col < this.cols / 2; col++) {
        this.macroCells.push({ row, col });
      }
    }
  }

  ngOnDestroy(): void {
    this.menuItemService.destroy();
    this.subscription.unsubscribe();
  }

  updateGridWidgets() {
    this.gridWidgetService.updateGridWidgets(this.currentWidgetSource);
    this.menuItemService.updateMenuItems(this.currentWidgetSource);
  
    this.cd.detectChanges();
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
    
    widget = {
      ...widget,
      moved
    };

    // populates preview widget
    this.previewWidget = {...widget};

    // if widget as moved instead of added, delete previous widget
    if (widget.moved) {
      this.movedWidget = widget;
    }
    
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

  onDrop(event: DragEvent | null, row: number, col: number): void {

    if (!(row >= 0 && col >= 0)) {
      this.isDragging = false;
      this.previewWidget = null;
      return;
    }

    if (this.movedWidget) {
      this.removeWidget(this.movedWidget);
    }

    // adds widget to grid
    if (event) {
      this.gridWidgetService.addGridWidget(event, row, col);
    }

    // cleans up after drop
    this.previewWidget = null;
  }

  onDragLeave(): void {
  }

  importJson() {
    this.isDraggingFile = true;
  }

  exportJson() {

    if (this.gridWidgets().length === 0) {
      console.log('No widgets detected...');
      return;
    }
    
    const json = JSON.stringify(this.gridWidgets_(), null, 2); // pretty-print with 2-space indent
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'grid.json';
    anchor.click();

    URL.revokeObjectURL(url); // clean up
  }

  exportHtml() {
    const json = this.htmlGeneratorService.buildIndexHtml(this.gridWidgets());

    const blob = new Blob([json], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'index.html';
    anchor.click();

    URL.revokeObjectURL(url); // clean up
  }

  onUploadDragOver(): void {}

  onUploadDragLeave(): void {}

  onUploadDrop(event: any): void {
    event.preventDefault();
    
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
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };

    reader.readAsText(file);
  }

  /*# COLOR METHODS #*/

  togglePreview() {
    const previewModeValue = this.previewMode_();
    this.previewMode_.set(!previewModeValue);
  }

  toggleDarkMode() {
    const darkModeValue = this.darkMode_();
    this.darkMode_.set(!darkModeValue);
  }

  /*# DRAG HANDLE SHENANIGANS # */

  handleOnMouseMove() {
    this.handleOnEscapeKey({
      skipImportLayer: true,
      skipPreviewLayer: true
    });
  }

  handleOnMouseDown(event: MouseEvent) {
    (event.target as any)?.parentNode.setAttribute('draggable', 'true')
  }
  handleOnMouseUp(event: MouseEvent) {
    (event.target as any)?.parentNode.setAttribute('draggable', 'false')
  }

  /*# REMOVE WIDGET #*/
  removeWidget(widget: GridWidget) {
    this.gridWidgetService.removeWidget(widget);
  }
}
