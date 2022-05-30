import { Component, OnInit } from '@angular/core';

export interface IItems {
  text: string;
  createdOn: string;
  color: string;
}


@Component({
  selector: 'app-last-items',
  templateUrl: './last-items.component.html',
  styleUrls: ['./last-items.component.css'],
})
export class LastItemsComponent implements OnInit {
  items: IItems[] = [
    { text: 'One', createdOn: '2022-05-29', color: 'lightblue' },
    { text: 'Two', createdOn: '2022-05-29', color: 'lightgreen' },
    { text: 'Three', createdOn: '2022-05-29', color: 'lightpink' },
    { text: 'Four', createdOn: '2022-05-29', color: '#DDBDF1' },
    { text: 'Five', createdOn: '2022-05-29', color: 'lightgreen' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
