import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})

export class DetailsComponent implements OnChanges {
  constructor(private modalService: NgbModal, private httpClient: HttpClient ) { }

  @Input() details: any = {}; 
  @Input() venue_details: any = {};
  @Input() musicArtists: any = []

  open_hours:boolean = true
  general_rule:boolean = true
  child_rule:boolean = true

  facebook: string = ''
  twitter: string = ''

  closeResult: string = '';

  latitude: number = 0
  longitude: number = 0

  mapOptions:google.maps.MapOptions = {}
  marker:any = {}
 
  
  isFav: boolean = false;
  ngOnChanges(): void {
    if (localStorage.getItem(this.details.id) != null) {
      this.isFav = true
    }
    else {
      this.isFav = false
    }

    this.latitude = this.venue_details.latitude
    this.longitude = this.venue_details.longitude

    this.mapOptions= {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 14
    }
    
    this.marker = {
      position: this.mapOptions.center,
    }

    this.facebook = `https://www.facebook.com/sharer/sharer.php?u=${this.details.buyTicketAt}&quote=Check%20${this.details.title}%20at%20ticketmaster.`
    this.twitter = `https://twitter.com/intent/tweet?url=${this.details.buyTicketAt}&text=Check%20${this.details.title}%20at%20ticketmaster.`

  }


  saveToFav(): void {
    this.details.timeStamp = new Date().getTime()
    localStorage.setItem(this.details.id, JSON.stringify(this.details))
    this.isFav = true
    alert('Event Added to Favorites!')
  }

  RemoveFav(): void {
    if (localStorage.getItem(this.details.id) != null) {
      localStorage.removeItem(this.details.id)
      this.isFav = false
      alert('Removed from favorites!')
    }
  }

  // Credits: Code used from https://ng-bootstrap.github.io/#/components/modal/examples

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}


