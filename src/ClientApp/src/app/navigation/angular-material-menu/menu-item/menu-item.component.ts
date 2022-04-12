import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-item-am',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemAMComponent implements OnInit {

  @Input("menuitem") menuitem;
  style;
  styleLink;
  ngOnInit(): void {

    if (this.menuitem.children.length === 0) {
      this.styleLink = {
        "background-color": `rgb(155,155,155,${1 / 10})`,
      };
    }

    //this.style = {
    //  "background-color": `rgb(155,155,155,${this.menuitem.opacity / 10})`,
    //};
    //this.styleLink = {
    //  "background-color": `rgb(155,155,155,${this.menuitem.opacity + 1 / 10})`,
    //};
  }

}
