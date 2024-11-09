import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() { }

  addborderFav(): void {
      document.getElementById('search')?.classList.add('addborder')
      document.getElementById('favourite')?.classList.remove('addborder')
  }
  addborderSearch(): void {
      document.getElementById('search')?.classList.remove('addborder')
      document.getElementById('favourite')?.classList.add('addborder')
    }

  title = 'client';
}
