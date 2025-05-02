import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'silvester';

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('http://localhost:3000/').subscribe(console.log);
  }
}
