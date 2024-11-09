import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private httpClient: HttpClient) {}
  getDetails(event: any): any {

    let localDate = '';
    let localTime = '';
    if (event.hasOwnProperty('dates') && event['dates'].hasOwnProperty('start')) {
      localDate = event['dates']['start'].localDate
      localTime = event['dates']['start'].localTime
    }


    let artistTeam = []
    let MusicArtistTeam = []
    if (event.hasOwnProperty('_embedded') && event['_embedded'].hasOwnProperty('attractions')) {
      for (let i = 0; i < event['_embedded']['attractions'].length; i++) {
        if (event['_embedded']['attractions'][i].hasOwnProperty('name') &&
          event['_embedded']['attractions'][i].name.toLowerCase() != 'undefined') {
          artistTeam.push(event['_embedded']['attractions'][i].name)

          if (event['_embedded']['attractions'][i].hasOwnProperty('classifications')
            && event['_embedded']['attractions'][i]['classifications'][0].hasOwnProperty('segment')
            && event['_embedded']['attractions'][i]['classifications'][0]['segment'].hasOwnProperty('name')) {

            let temp = event['_embedded']['attractions'][i]['classifications'][0]['segment'];
            if (temp.name == 'Music')
              MusicArtistTeam.push(event['_embedded']['attractions'][i].name)
          }
        }
      }
    }



    let venue = ''
    if (event.hasOwnProperty('_embedded') && event['_embedded'].hasOwnProperty('venues') &&
      event['_embedded']['venues'].length != 0 && event['_embedded']['venues'][0].hasOwnProperty('name')) {
      venue = event['_embedded']['venues'][0].name
    }

    let genre_arr = []
    if (event.hasOwnProperty('classifications')) {
      for (let i = 0; i < event['classifications'].length; i++) {
        for (let ele of ['segment', 'genre', 'subGenre', 'type','subType']) {
          if (event['classifications'][i].hasOwnProperty(ele) &&
            event['classifications'][i][ele].hasOwnProperty('name')) {
            if (event['classifications'][i][ele].name.toLowerCase() != 'undefined')
              genre_arr.unshift(event['classifications'][i][ele].name)
          }
        }
      }
    }

    let price_ranges_min = '';
    let price_ranges_max = '';
    if (event.hasOwnProperty('priceRanges') && event['priceRanges'].length != 0) {
      if (event['priceRanges'][0].hasOwnProperty('min') && event['priceRanges'][0].hasOwnProperty('min')) {
        price_ranges_min = event['priceRanges'][0].min
        price_ranges_max = event['priceRanges'][0].max
      }
    }

    let color = ''
    let code = ''

    if (event.hasOwnProperty('dates') && event['dates'].hasOwnProperty('status')
      && event['dates']['status'].hasOwnProperty('code')) {
      let statusCode = event['dates']['status'].code

      if (statusCode == 'onsale') {
        color = 'green'; code = 'On Sale';
      }
      else if (statusCode == 'offsale') {
        color = 'red'; code = 'Off Sale';
      }
      else if (statusCode == 'cancelled') {
        color = 'black'; code = 'Canceled'
      }
      else if (statusCode == 'rescheduled') {
        color = 'orange'; code = 'Rescheduled'
      }
      else {
        color = 'orange'; code = 'Postponed'
      }
    }
    let buyTicketAt = ''
    if (event.hasOwnProperty('url')) {
      buyTicketAt = event['url']
    }


    let seatMap = ''
    if (event.hasOwnProperty('seatmap') && event['seatmap'].hasOwnProperty('staticUrl')) {
      seatMap = event['seatmap'].staticUrl
    }

    return {
      'Date': localDate,
      'Time': localTime,
      'artistTeam': artistTeam,
      'venue': venue,
      'genre_arr': genre_arr,
      'price_ranges_min': price_ranges_min,
      'price_ranges_max': price_ranges_max,
      'color': color,
      'code': code,
      'buyTicketAt': buyTicketAt,
      'seatMap': seatMap,
      'title': event['name'],
      'id': event['id'],
      'MusicArtistTeam': MusicArtistTeam
    }
  }

  getVenueDetails(venue: any): any {

    venue = venue['_embedded']['venues'][0]

    let name = ''
    if (venue.hasOwnProperty('name')) name = venue['name']

    let street_address = ''
    if (venue.hasOwnProperty('address') && venue['address'].hasOwnProperty('line1'))
      street_address = venue['address'].line1

    let city = ''
    if (venue.hasOwnProperty('city') && venue['city'].hasOwnProperty('name'))
      city = venue['city'].name

    let state = (venue.hasOwnProperty('state') &&
      venue['state'].hasOwnProperty('name')) ? venue['state'].name : ''

    let phone_number = (venue.hasOwnProperty('boxOfficeInfo') && venue['boxOfficeInfo'].hasOwnProperty('phoneNumberDetail')) ?
      venue['boxOfficeInfo'].phoneNumberDetail : ""

    let open_hours = (venue.hasOwnProperty('boxOfficeInfo') && venue['boxOfficeInfo'].hasOwnProperty('openHoursDetail')) ?
      venue['boxOfficeInfo'].openHoursDetail : ""

    let general_rule = (venue.hasOwnProperty('generalInfo') && venue['generalInfo'].hasOwnProperty('generalRule')) ?
      venue['generalInfo'].generalRule : ""

    let child_rule = (venue.hasOwnProperty('generalInfo') && venue['generalInfo'].hasOwnProperty('childRule')) ?
      venue['generalInfo'].childRule : ""

    let zipcode = (venue.hasOwnProperty('postalCode')) ? venue['postalCode'] : ''
    let map_address = [street_address, city, state, zipcode]


    return {
      'name': name,
      'street_address': street_address + ', ' + city + ', ' + state,
      'phone_number': phone_number,
      'open_hours': open_hours,
      'general_rule': general_rule,
      'child_rule': child_rule,
      'map_address': map_address
    }
  }

  
}
