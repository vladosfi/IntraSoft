import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IMenu } from '../../_interfaces/menu';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class NavMenuItemComponent implements OnInit {
  @Input() items: IMenu[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;


  constructor(
    public router: Router ) {  }

  ngOnInit() {  }
}
