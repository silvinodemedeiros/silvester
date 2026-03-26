import { Injectable } from '@angular/core';
import { GridWidget } from '../../types';
import { DatePipe } from '@angular/common';
import { widget_value } from '../../pipes/widget-value/widget-value.pipe';
import { widget_suffix } from '../../pipes/widget-suffix/widget-suffix.pipe';

@Injectable({
  providedIn: 'root'
})
export class HtmlGeneratorService {

  indexHead = 
  `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="styles.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
      <title>Dashboard X</title>
    </head>
    <body>
      
      <div class="layout layout-preview">
        <main class="content content-preview">

          <div class="grid grid-structure grid-preview">

            <div class="grid-structure grid-widgets-wrapper grid-widgets-wrapper-preview">`;

  indexTail = 
  `         </div>
          </div>
        </main>
      </div>
      
      <div id="dark-mode-toggle" class="accessibility" tabIndex="1">
        <i class="bi bi-moon-stars"></i>
      </div>
    </body>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.min.js" integrity="sha384-G/EV+4j2dNv+tEPo3++6LCgdCROaejBqfUeNjuKAiuXbjrxilcCdDz6ZAVfHWe1Y" crossorigin="anonymous"></script>
  
    <script src="script.js" type="text/javascript" language="javascript"></script>

  </html>`;

  // map between ng-icons and pure bootstrap icons
  ngIconsHtmlIconMap: Record<string, string> = {
    'bootstrapDropletHalf': 'droplet-half',
    'bootstrapDroplet': 'droplet',
    'bootstrapWatch': 'watch',
    'bootstrapEmojiSunglasses': 'emoji-sunglasses',
    'bootstrapChevronBarDown': 'chevron-bar-down',
    'bootstrapSunrise': 'sunrise',
    'bootstrapSunset': 'sunset',
    'bootstrapThermometerHalf': 'thermometer-half',
    'bootstrapClock': 'clock',
    'bootstrapClockFill': 'clock-fill',
    'bootstrapArrowDownRight': 'arrow-down-right',
    'bootstrapEye': 'eye',
    'bootstrapArrowsMove': 'arrows-move',
    'bootstrapWind': 'wind',
    'bootstrapGeo': 'geo',
    'bootstrapClouds': 'clouds'
  };

  constructor(
    private datePipe: DatePipe
  ) { }

  parseIconName(iconName: string): string {
    return this.ngIconsHtmlIconMap[iconName];
  }

  generateWidget(gridWidget: GridWidget) {
    return `
      <div
        class="grid-widget grid-widget-has-preview grid-widget-${gridWidget.data.type} cell monochromatic"
        style="grid-area: ${gridWidget.row + 1} / ${gridWidget.col + 1} / span ${gridWidget.item.height} / span ${gridWidget.item.width};"
        tabIndex="1"
      >

        <p class="grid-widget-title">
          ${gridWidget.data.metadata?.title?.value}
        </p>

        <span class="grid-widget-value">
          ${widget_value(gridWidget, this.datePipe)}
          <span class="grid-widget-value-suffix">
            ${widget_suffix(gridWidget.data.metadata?.measures?.value)}
          </span>
        </span>

        <p class="grid-widget-icon">
          <i class="bi bi-${this.ngIconsHtmlIconMap[gridWidget.data.metadata?.icon?.value as string]}"></i>
        </p>
      </div>
    `;
  }

  generateWidgetList(gridWidgets: GridWidget[]) {
    return gridWidgets.map((widget => this.generateWidget(widget))).join('');
  }

  buildIndexHtml(gridWidgets: GridWidget[]): string {
    return `
      ${this.indexHead}
      ${this.generateWidgetList(gridWidgets)}
      ${this.indexTail}
    `;
  }
}
