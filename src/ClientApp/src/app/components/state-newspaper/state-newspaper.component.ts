import { Component, OnInit } from '@angular/core';
import { StateNewspaper } from 'src/app/core/interfaces/StateNewspaper';
import { StateNewspaperService } from 'src/app/core/services/state-newspaper.service';

@Component({
  selector: 'app-state-newspaper',
  templateUrl: './state-newspaper.component.html',
  styleUrls: ['./state-newspaper.component.css']
})
export class StateNewspaperComponent implements OnInit {
   stateNewspapers: StateNewspaper[] = [];

  constructor(private stateNewspaperService: StateNewspaperService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.stateNewspaperService.getData().subscribe(
      {
        next: (result) => {
          this.stateNewspapers = result as StateNewspaper[];
          console.log(this.stateNewspapers);
        }
      });
  }
}
