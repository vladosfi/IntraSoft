import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeItem, HomeListItem } from 'src/app/core/interfaces/Home';
import { HomeService } from 'src/app/core/services/home.service';
import { HomeModalDialogComponent } from './modal/home-modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeItems: HomeItem = {} as HomeItem;
  content: string;
  title: string = 'РА'
  isoRouterLink1: string = 'iso-list';
  isoRouterLink2: string = 'orders';
  isoRouterLink3: string = 'state-newspaper';
  listTitle1: string = 'Last Iso Services';
  listTitle2: string = 'Last Orders';
  listTitle3: string = 'Last StateNewspapers';
  homeListItemsIsoServices: HomeListItem[] = [];
  homeListItemsOrders: HomeListItem[] = [];
  homeListItemsStateNewspapers: HomeListItem[] = [];


  constructor(
    private homeService: HomeService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.homeService.getHomeItems().subscribe(
      {
        next: (result) => {
          this.homeListItemsIsoServices = result.isoServices.map(is => (
            {
              id: is.id,
              title: is.number,
              text: is.name,
              date: is.createdOn
            } as HomeListItem));

          this.homeListItemsOrders = result.orders.map(is => (
            {
              id: is.id,
              title: is.number,
              text: is.about,
              date: is.date
            } as HomeListItem));

          this.homeListItemsStateNewspapers = result.stateNewspapers.map(is => (
            {
              id: is.id,
              title: is.title,
              text: is.content.length < 100 ? is.content : is.content.substring(0, 100),
              date: is.createdOn
            } as HomeListItem));

          this.content = result.content;
        }
      });
  }


  onAdd(){
    const dialogRef = this.dialog.open(HomeModalDialogComponent,
      {
        data: {
          title: 'Начало',
          content: this.content,
        },
        width: '70%'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }

  public executeSelectedChange = (event) => {
    console.log(event);
  }

}






