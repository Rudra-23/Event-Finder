import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DetailsService } from '../services/details.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  constructor(private httpClient: HttpClient, private detailsService: DetailsService) { }
  @Input() events_list: any = [];
  showTable: boolean = true
  showDetails: boolean = false

  url_head: string = 'http://localhost:8000'
  // url_head: string = 'https://my-angular-app8.wl.r.appspot.com/'

  details: any = {}
  venue_details: any = {}
  musicArtists: any = []

  getDetails(id: string) {
    let url = this.url_head + `/search/id?eventid=${id}`
    this.showTable = false
    this.showDetails = true
    this.details = {}

    this.httpClient.get<any>(url).subscribe(
      event => {
        console.log(event)

        this.details = this.detailsService.getDetails(event)
        let details_cleaned = this.details.MusicArtistTeam.map((item: any) => encodeURIComponent(item))
        let url = this.url_head + `/spotify?name=${JSON.stringify(details_cleaned)}`
  
        this.httpClient.get<any>(url).subscribe(
          musicArtists => {
            this.musicArtists = []
            this.musicArtists = musicArtists

            this.venue_details = {};
            let venue_name = encodeURIComponent(this.details.venue)
            let url = this.url_head + `/search/venue?venue=${venue_name}`
            
            this.httpClient.get<any>(url).subscribe(venue => {
              let venueDetails = this.detailsService.getVenueDetails(venue)

              let geocoding_API = ''

              let locationText = venueDetails.map_address.join(' ')
              locationText = encodeURIComponent(locationText)
              let location_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationText}&key=${geocoding_API}`
              
              this.httpClient.get<any>(location_url).subscribe(location_response => {
                
                let latitude = ''
                let longitude = ''
                if(location_response.hasOwnProperty('results') && location_response['results'].length != 0) {
                  latitude = location_response["results"][0]["geometry"]["location"]["lat"]
                  longitude = location_response["results"][0]["geometry"]["location"]["lng"]
                }
                venueDetails['latitude'] = latitude
                venueDetails['longitude'] = longitude

                this.venue_details = venueDetails
              })
            })
          }
        )
      }
    )
  }
}


