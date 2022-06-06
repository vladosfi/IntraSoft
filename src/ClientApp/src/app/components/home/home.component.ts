import { Component, OnInit } from '@angular/core';
import { HomeItem } from 'src/app/core/interfaces/Home';
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
  
  constructor(private homeService: HomeService) {  }

  ngOnInit(): void {
    // this.homeItems.orders = [];
    // this.homeItems.isoServices = [];

    this.homeService.getIsoServices().subscribe( i  => {      
      this.homeItems.orders = i.orders;
      this.homeItems.isoServices = i.isoServices;
      // console.log(this.homeItems.orders);
      // console.log(this.homeItems);
      //this.homeItems.homeOrders = i;
    });
   }



  public executeSelectedChange = (event) => {
    console.log(event);
  }

}






