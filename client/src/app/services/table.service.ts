import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  createTable(res: any): any {
    let events_list = [];

    let events = res['_embedded']['events']
    for (let i = 0; i < events.length && i < 20; i++) {

      let Date = ''
      let Time = ''
      if (events[i].hasOwnProperty('dates') && events[i]['dates'].hasOwnProperty('start')) {
        Date = events[i]['dates']['start'].localDate
        Time = events[i]['dates']['start'].localTime
        if (Date == undefined || Date.toLowerCase() == 'undefined') {
          Date = ''
        }
        if (Time == undefined || Date.toLowerCase() == 'undefined') {
          Time = ''
        }
      }


      let Image_url = ''
      if (events[i].hasOwnProperty('images') && events[i]['images'].length != 0 && events[i]['images'][0].hasOwnProperty('url')) {
        Image_url = events[i]['images'][0].url
        if (Image_url == undefined) {
          Image_url = ''
        }
      }

      let Genre = ''
      if (events[i].hasOwnProperty('classifications') && events[i]['classifications'].length != 0 &&
        events[i]['classifications'][0].hasOwnProperty('segment')) {
        Genre = events[i]['classifications'][0]['segment'].name
        if (Genre == undefined || Genre.toLowerCase() == 'undefined') {
          Genre = ''
        }
      }

      let Venue = ''
      if (events[i].hasOwnProperty('_embedded') && events[i]['_embedded'].hasOwnProperty('venues') &&
        events[i]['_embedded']['venues'].length != 0 &&
        events[i]['_embedded']['venues'][0].hasOwnProperty('name')) {
        Venue = events[i]['_embedded']['venues'][0].name
        if (Venue == undefined || Venue.toLowerCase() == 'undefined') {
          Venue = ''
        }
      }
      events_list.push({
        "Date": Date,
        "Time": Time,
        "Icon": Image_url,
        "Title": events[i].name,
        "Genre": Genre,
        "Venue": Venue,
        "Url": events[i].url,
        "Id": events[i].id
      })
    }
    return events_list;
  }
}
