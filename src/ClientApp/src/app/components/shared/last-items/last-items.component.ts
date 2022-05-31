import { Component, Input, OnInit } from '@angular/core';
import { HomeItem } from 'src/app/core/interfaces/Home';

// export interface IItems {
//   name: string;
//   createdOn: string;
//   color: string;
// }


@Component({
  selector: 'app-last-items',
  templateUrl: './last-items.component.html',
  styleUrls: ['./last-items.component.css'],
})
export class LastItemsComponent implements OnInit {
  @Input() items: HomeItem[];
  @Input() routerLink: string;

  // items: IItems[] = [
  //   { name: 'One', createdOn: '2022-05-31 07:43:39.3276319', color: 'lightblue' },
  //   { name: 'Two', createdOn: '2022-05-29', color: 'lightgreen' },
  //   { name: 'Three', createdOn: '2022-05-29', color: 'lightpink' },
  //   { name: 'Four', createdOn: '2022-05-29', color: '#DDBDF1' },
  //   { name: 'Five', createdOn: '2022-05-29', color: 'lightgreen' },
  // ];

  constructor() { }

  ngOnInit(): void {
    console.log(this.routerLink);
  }

}
