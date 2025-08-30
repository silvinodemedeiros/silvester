import { TestBed } from '@angular/core/testing';

import { MenuWidgetService } from './menu-widget.service';

describe('MenuWidgetService', () => {
  let service: MenuWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
