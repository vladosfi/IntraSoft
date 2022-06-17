import { Component, OnInit } from '@angular/core';
import { HomeItem ,HomeListItem } from 'src/app/core/interfaces/Home';
import { HomeService } from 'src/app/core/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeItems: HomeItem = {} as HomeItem;

  isoRouterLink1: string = 'iso-list';
  isoRouterLink2: string = 'orders';
  listTitle1: string = 'Last Iso Services';
  listTitle2: string = 'Last Orders';
  homeListItemsIsoServices: HomeListItem[] = []; 
  homeListItemsOrders: HomeListItem[] = []; 
  

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getIsoServices().subscribe(
      {
        next: (result) => {
          this.homeListItemsIsoServices = result.isoServices.map(is => (
            { 
              id: is.id, 
              title: is.number ,
              text: is.name,
              date: is.createdOn
            } as HomeListItem));

            this.homeListItemsOrders = result.orders.map(is => (
              { 
                id: is.id, 
                title: is.number ,
                text: is.about,
                date: is.date
              } as HomeListItem));
        }
      });
  }



  public executeSelectedChange = (event) => {
    console.log(event);
  }

}






