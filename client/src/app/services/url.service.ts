import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  getEventsUrl(url_head: string, keyword: string, category: string, distance: number,
    latitude: number, longitude: number): string {
    let combine_url = '';
    combine_url += "keyword=" + encodeURIComponent(keyword)
    combine_url += "&category=" + category
    combine_url += "&distance=" + distance

    combine_url += "&latitude=" + latitude
    combine_url += "&longitude=" + longitude

    return url_head + 'search/events?' + combine_url
  }
  constructor() { }
}
