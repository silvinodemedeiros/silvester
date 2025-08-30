import { Injectable, Signal, signal } from '@angular/core';
import { MenuWidget } from '../../types';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuWidgetService {

  sub = new Subscription();
  apiUrl = 'http://localhost:3000';
  entitiesUrl = this.apiUrl + '/entities';
  menuWidgets = signal<MenuWidget[]>([]);

  constructor(
    private httpClient: HttpClient
  ) { }

  init() {
    const sub = this.httpClient.get<any>(this.entitiesUrl).subscribe((response) => {
      this.updateMenuWidgets(response[0]);
    });

    this.sub.add(sub);
  }

  updateMenuWidgets(widgetsObject: any) {
    const menuWidgets: MenuWidget[] = Object.keys(widgetsObject).reduce((acc: MenuWidget[], key, index) => {
      if(typeof widgetsObject[key] === 'object') {
        return [...acc, {
          item: {
            id: 'wi' + (index + 1),
            type: widgetsObject[key].type,
            label: widgetsObject[key].metadata.title.value,
            width: 2,
            height: 2
          },
          data: {...widgetsObject[key]}
        }];
      }

      return acc;
    }, []);

    this.menuWidgets.set(menuWidgets);
  }

  destroy() {
    this.sub.unsubscribe();
  }
}
