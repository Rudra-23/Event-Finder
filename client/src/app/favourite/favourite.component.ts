import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit, OnChanges {
  fav_data: any = [];

  constructor() { }

  deleteFav(fav: any, index: number): void {
    localStorage.removeItem(fav.id);
    this.fav_data.splice(this.fav_data.indexOf(fav), 1)
    alert('Removed from Favorites!')
  }

  ngOnInit(): void {
    this.fav_data = []
    for (let obj in { ...localStorage }) {
      let temp = localStorage.getItem(obj);
      this.fav_data.push(JSON.parse(temp || '{}'))
    }
    this.fav_data.sort((a: any, b: any): any => {
      return a.timeStamp - b.timeStamp
    })
  }

  ngOnChanges(): void {
    this.fav_data = []
    for (let obj in { ...localStorage }) {
      let temp = localStorage.getItem(obj);
      this.fav_data.push(JSON.parse(temp || '{}'))
    }
    this.fav_data.sort((a: any, b: any): any => {
      return a.timeStamp - b.timeStamp
    })
  }

}
