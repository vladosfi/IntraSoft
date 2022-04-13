import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../core/interfaces/Menu';

@Component({
  selector: 'app-sidenav-list-item1',
  templateUrl: './sidenav-list-item.component.html',
  styleUrls: ['./sidenav-list-item.component.css']
})
export class SidenavListItemComponent implements OnInit {
  @Input() items: Menu[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;


  constructor(
    public router: Router) { }

  ngOnInit() { }
}
