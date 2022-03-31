import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../core/interfaces/Menu';
@Component({
  selector: 'app-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.css']
})
export class SideMenuItemComponent implements OnInit {
  @Input() items: Menu[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;


  constructor(
    public router: Router ) {  }

  ngOnInit() {  }
}
