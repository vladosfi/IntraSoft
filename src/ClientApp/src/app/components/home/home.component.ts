import { Component, OnInit } from '@angular/core';
import { HomeItem } from 'src/app/core/interfaces/Home';
import { HomeService } from 'src/app/core/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeItems: HomeItem[] =[];
  isoRouterLink: string = 'iso-list';

  constructor(private homeService: HomeService) {  }

  ngOnInit(): void {
    this.homeService.getIsoServices().subscribe( i  => {
      this.homeItems = i;
    });
   }



  public executeSelectedChange = (event) => {
    console.log(event);
  }

}






