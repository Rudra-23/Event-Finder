import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../services/table.service';
import { UrlService } from '../services/url.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  constructor(private httpClient: HttpClient,
    private tableService: TableService,
    private urlService: UrlService) { }


  // Credits: Code snippet used from https://www.freakyjolly.com/mat-autocomplete-with-http-api-remote-search-results/
  ngOnInit(): void {
    this.searchKeywords.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.httpClient.get(this.url_head +`suggest?keyword=${encodeURIComponent(this.keyword)}`)
        .pipe(
          finalize(() => {
            this.isLoading = false
          })
        )
      )
    )
      .subscribe((data: any) => {
        this.keywords_arr = []
        if (this.keyword !== "") {
          for (let ele of data['_embedded']['attractions']) {
            this.keywords_arr.push(ele.name)
          }
        }
      })
  }

  showMessage: boolean = false
  showTable: boolean = false
  table_data: any = []

  url_head: string = 'http://localhost:8000/'
  // url_head: string = 'https://my-angular-app8.wl.r.appspot.com/'
  final_url: string = ""

  keyword: string = "";
  distance: number = 10
  category: string = "Default"
  locationText: string = ""
  location: boolean = false
  latitude: number = 0
  longitude: number = 0
  keywords_arr: any = [];
  searchKeywords = new FormControl();
  isLoading: boolean = false


  // Function to get the values
  getValues(): void {
    if (this.location == true) {
      let ipinfo_API = ''
      let ipinfo_url = `https://ipinfo.io/?token=${ipinfo_API}`

      let data = fetch(ipinfo_url)
      data.then(data => data.json())
        .then(location_response => {
          this.latitude = location_response['loc'].split(',')[0]
          this.longitude = location_response['loc'].split(',')[1]

          this.final_url = this.urlService.getEventsUrl(this.url_head, this.keyword, this.category,
            this.distance, this.latitude, this.longitude)
          this.getEvents(this.final_url)
        })
    }
    else {
      let geocoding_API = ''
      let locationtext = encodeURIComponent(this.locationText)
      let location_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationtext}&key=${geocoding_API}`
      let data = fetch(location_url)
      data.then(data => data.json())
        .then(location_response => {
          if (location_response.results.length == 0) {
            this.showMessage = true
            this.showTable = false
          }
          else {
            this.latitude = location_response["results"][0]["geometry"]["location"]["lat"]
            this.longitude = location_response["results"][0]["geometry"]["location"]["lng"]

            this.final_url = this.urlService.getEventsUrl(this.url_head, this.keyword, this.category,
              this.distance, this.latitude, this.longitude)
            this.getEvents(this.final_url)
          }
        })
    }
  }

  getEvents(url: string): void {
    this.showTable = false
    this.showMessage = false
    this.httpClient.get<any>(url).subscribe(
      res => {
        if (res['page']['totalElements'] == 0) {
          this.showMessage = true
        }
        else {
          this.showTable = true
          let table_unsorted = this.tableService.createTable(res)
          table_unsorted.sort((a: any, b: any) => {
            if ((a.Date + a.Time) > (b.Date + b.Time))
              return 1
            else if ((a.Date + a.Time) < (b.Date + b.Time))
              return -1
            else
              return 0
          })
          this.table_data = table_unsorted
        }
      }
    )
  }

  // To toggle the location input
  disable(): void {
    let location = document.getElementById('location') as HTMLInputElement

    let locationText = document.getElementById('locationText') as HTMLInputElement
    if (location.checked == true) {
      locationText.disabled = true;
      this.locationText = ""
    }
    else {
      locationText.disabled = false;
    }
  }

  // To reset the values
  resetValues(e: any): void {
    e.preventDefault();

    let locationText = document.getElementById('locationText') as HTMLInputElement
    locationText.disabled = false;

    this.keyword = ""
    this.category = "Default"
    this.location = false
    this.locationText = ""
    this.distance = 10

    this.showMessage = false
    this.showTable = false
  }
}
