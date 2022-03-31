import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Menu } from '../../core/interfaces/Menu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  public menu: Menu[];
  isExpanded = false;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }


  ngOnInit(): void {
    this.http.get<Menu[]>(this.baseUrl + 'api/menu')
      .subscribe(result => {
        this.menu = result;
      }, error => console.error(error));
  }

}
