import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Menu } from '../_interfaces/menu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  public navItems: Menu[];
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
        this.navItems = result;
      }, error => console.error(error));
  }

}
