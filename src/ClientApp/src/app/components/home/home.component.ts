import { Component, OnInit } from '@angular/core';
import { HomeItem ,HomeListItems } from 'src/app/core/interfaces/Home';
import { HomeService } from 'src/app/core/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeItems: HomeItem = {} as HomeItem;

  isoRouterLink: string = 'iso-list';
  lastIsoServices: string = 'Last Iso Services';
  lastOrders: string = 'Last Orders';
  homeListItemsIsoServices: HomeListItems[] ; 
  homeListItemsOrders: HomeListItems; 

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    // this.homeItems.orders = [];
    // this.homeItems.isoServices = [];


    this.homeService.getIsoServices().subscribe(
      {
        next: (result) => {
          this.homeItems.isoServices = result.isoServices;
          this.homeItems.orders = result.orders;

          // this.homeListItemsIsoServices = this.homeItems.isoServices.map( i => {
          //   id = i.id,
            
          // }) 
        }
      });
  }



  public executeSelectedChange = (event) => {
    console.log(event);
  }

}






