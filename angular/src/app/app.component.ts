import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, ElementRef, HostListener, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as bootstrapIcons from '@ng-icons/bootstrap-icons';
import * as tablerIcons from '@ng-icons/tabler-icons';
import * as simpleIcons from '@ng-icons/simple-icons';
import * as lucideIcons from '@ng-icons/lucide';
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
import html2canvas from 'html2canvas';

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
    provideIcons(bootstrapIcons),
    provideIcons(tablerIcons),
    provideIcons(simpleIcons),
    provideIcons(lucideIcons)
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
  dropPreview: any = null;

  subscription = new Subscription();
  exportForm: FormGroup;

  iconList = ICON_LIST;
  weatherList = WEATHER_INFO_LIST;
  measurementsList = MEASUREMENTS_LIST;
  currentWidgetSource: any;

  // MAGNIFICATION PROPERTIES
  focusedWidgetElem: any = null;

  // EDITOR PROPERTIES
  previewMode_ = signal(false);
  darkMode_ = signal(false);

  // MOVE WIDGET PROPERTIES
  movedWidget: GridWidget | null = null;

  // EXPORT
  export_ = signal(false);

  // FILE IMPORTS
  isUploaderActive = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

    // effect(() => {
    //   if (this.export_()) {
    //     this.exportForm.get('title')?.patchValue('My Dashboard');
    //   }
    // });

    this.exportForm = this.fb.group({
      title: this.fb.control(''),
      icon: this.fb.control(''),
      measures: this.fb.control(''),
      weatherType: this.fb.control(''),
    });

    // PREVIEW EFFECT
    effect(() => {
      const previewMode = this.previewMode_();

      // if preview is now deactivated
      if (!previewMode) {
        this.darkMode_.set(false);
      } else {
        this.export_.set(false);
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
      this.isUploaderActive = false;
    }

    this.onDrop(null, -1, -1);

    if (!escParams?.skipPreviewLayer) {
      this.previewMode_.set(false);
    }

    this.closeExport();
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

  hasDropPreview(cellRow: number, cellCol: number): boolean {
    const {width, height} = this.dropPreview.item;
    const {row, col} = this.dropPreview;

    return (
      cellRow >= row && cellRow < row + height &&
      cellCol >= col && cellCol < col + width
    );
  }

  onDragStart(event: DragEvent, widget: any, moved = false, element: any = null): void {
    this.isDragging = true;
    
    widget = {
      ...widget,
      moved
    };

    // populates preview widget
    this.dropPreview = {...widget};

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

    if (!(row >= 0 && col >= 0)) {
      return;
    }

    event.preventDefault();

    const hasChangedCells = (this.dropPreview?.row != row || this.dropPreview?.col != col);
    const isCellValid_w = col + this.dropPreview.item.width <= this.cols;
    const isCellValid_h = row + this.dropPreview.item.height <= this.rows;

    // updates drop preview (with (-1, -1) as invalid)
    if (row != -1 && col != -1 && hasChangedCells) {
      this.dropPreview = {
        ...this.dropPreview,
        row: isCellValid_h ? row : this.dropPreview.row,
        col: isCellValid_w ? col : this.dropPreview.col
      };
    }
  }

  onDrop(event: DragEvent | null, row: number, col: number): void {

    if (row == -1 || col == -1) {
      this.isDragging = false;
      this.dropPreview = null;
      return;
    }

    const previewRow = this.dropPreview.row;
    const previewCol = this.dropPreview.col;
    
    if (this.movedWidget) {
      this.removeWidget(this.movedWidget);
    }

    // adds widget to grid
    if (event) {
      this.gridWidgetService.addGridWidget(event, previewRow, previewCol);
    }

    // cleans up after drop
    this.dropPreview = null;
    this.movedWidget = null;
  }

  onDragLeave(): void {
  }

  importJson() {
    this.isUploaderActive = true;
  }

  closeImportJson() {
    this.isUploaderActive = false;
  }

  toggleExport() {
    this.export_.update((value) => !value);
  }

  closeExport() {
    this.export_.update(() => false);
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

  onUploadDragOver(event: any): void {
    event.preventDefault();
  }

  onUploadDragLeave(): void {}

  onUploadDrop(event: any): void {
    event.preventDefault();

    const file = event.dataTransfer?.files?.[0];
    this.readJsonAsText(file);
  }

  onUploadClick(event: any): void {
    const file = event.target.files[0];
    this.readJsonAsText(file);
  }

  readJsonAsText(file:any) {
    
    if (!file) {
      return;
    } else if (file.type !== 'application/json') {
      alert('Only JSON files are accepted.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this.gridWidgetService.setGridWidgets(json);
        this.isUploaderActive = false;
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

  closePreview() {
    this.previewMode_.set(false);
  }

  toggleDarkMode() {
    const darkModeValue = this.darkMode_();
    this.darkMode_.set(!darkModeValue);
  }

  /*# DRAG HANDLE SHENANIGANS # */

  handleOnMouseMove() {
    // this.handleOnEscapeKey({
    //   skipImportLayer: true,
    //   skipPreviewLayer: true
    // });
  }

  handleOnMouseDown(event: MouseEvent) {
    const target = event.target as any;
    target.parentNode.setAttribute('draggable', 'true');
  }

  handleOnMouseUp(event: MouseEvent) {
    const target = event.target as any;
    target.parentNode.setAttribute('draggable', 'false');
  }

  /*# REMOVE WIDGET #*/
  removeWidget(widget: GridWidget) {
    this.gridWidgetService.removeWidget(widget);
  }

  goToGithub() {
    window.open('https://github.com/silvinodemedeiros/silvester', '_blank');
  }

  @ViewChild('captureArea') captureArea!: ElementRef<HTMLElement>;

  async exportToPng(): Promise<void> {
    const timerSub = await timer(2000).subscribe(async () => {
      const element = this.captureArea.nativeElement;
  
      const canvas = await html2canvas(element, {
        scale: 2
      });
  
      const pngUrl = canvas.toDataURL('image/png');
  
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'dashboard.png';
      link.click();
    });

    this.subscription.add(timerSub);
  }
}
