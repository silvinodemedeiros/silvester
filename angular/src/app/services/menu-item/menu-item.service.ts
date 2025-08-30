import { Injectable, Signal, signal } from '@angular/core';
import { MenuItem } from '../../types';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  sub = new Subscription();
  apiUrl = 'http://localhost:3000';
  entitiesUrl = this.apiUrl + '/entities';
  menuItems = signal<MenuItem[]>([]);

  constructor(
    private httpClient: HttpClient
  ) { }

  init() {
    const sub = this.httpClient.get<any>(this.entitiesUrl).subscribe((response) => {
      this.updateMenuItems(response[0]);
    });

    this.sub.add(sub);
  }

  updateMenuItems(widgetsObject: any) {
    const menuItems = Object.keys(widgetsObject).reduce((acc: MenuItem[], key, index) => {
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

    this.menuItems.set(menuItems);
  }

  destroy() {
    this.sub.unsubscribe();
  }
}
