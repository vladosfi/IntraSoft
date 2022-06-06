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
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.routerLink);
  }

}
