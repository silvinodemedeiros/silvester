import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridWidget, LocationValue, MenuItem } from '../../types';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { MapOptions, tileLayer, Layer, Map, marker, icon, latLng } from 'leaflet';

@Component({
  selector: 'app-map-widget',
  imports: [
    CommonModule,
    LeafletModule
  ],
  templateUrl: './map-widget.component.html',
  styleUrl: './map-widget.component.less'
})
export class WidgetComponent implements OnInit {

  @Input('data') gridWidget: any;
  @Input('has-preview') gridPreview = false;

  @Output() mapReady = new EventEmitter<any>();
  @Output() dragStart = new EventEmitter<any>();
  @Output() dragEnd = new EventEmitter<any>();

  mapOptions: MapOptions = {
    layers: [
      tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18
      })
    ]
  };

  mapLayers: Layer[] = [];
  mapPoints: any[] = [];

  map: Map | null = null;
  mapCenter: any;
  mapZoom: any;

  constructor() {}

  ngOnInit(): void {
    const {lat, lng} = this.gridWidget.data.value as LocationValue;
    const latLngView = latLng(lat, lng);

    this.mapOptions = {
      ...this.mapOptions,
      zoom: this.mapZoom ? this.mapZoom : 14,
      center: this.mapCenter ? this.mapCenter : latLngView
    };
  }

  addPoint(locationValue: LocationValue, label?: string): void {
    const {lat, lng} = locationValue;
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

  handleMapReady(map: Map) {
    this.map = map;
  }

  handleMapMoveEnd() {
    this.mapCenter = this.map?.getCenter();
    this.mapZoom = this.map?.getZoom();
  }
}
