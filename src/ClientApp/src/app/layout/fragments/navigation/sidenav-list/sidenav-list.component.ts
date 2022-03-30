import { MenuService } from '../menu.service';
import { ShareNavigationDataService } from '../share-navigation-data.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Menu } from '../../../../core/interfaces/Menu';



/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  menuList$ = this.shareDataService.menuList$;
  menuItem: Menu[];

  constructor(
    private menuService: MenuService,
    private shareDataService: ShareNavigationDataService
  ) {
    
  }



  ngOnInit(): void {
  }


  public onSidenavClose = () => {
    this.sidenavClose.emit();

    this.menuList$
      .subscribe(countries => {
        this.menuItem = countries as Menu[]
      })

  }


}
