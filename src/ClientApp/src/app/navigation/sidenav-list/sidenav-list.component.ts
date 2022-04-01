import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Menu } from '../../core/interfaces/Menu';
import { MenuService } from '../menu.service';
import { ShareNavigationDataService } from '../share-navigation-data.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  menuList$ = this.shareDataService.menuList$;
  finalMenu: any[] = [];
  menuLoaded: Boolean;
  menu: Menu[];


  constructor(
    private shareDataService: ShareNavigationDataService,
    private menuService: MenuService
  ) {

  }


  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }


  // angular-material-menu - start

  loadData(query: string = null) {
    this.menuService.getData<Menu[]>()
      .subscribe(result => {
        this.menu = result;
      }, error => console.error(error));
  }

  ngOnInit(): void {


    //this.loadData(null);
    //this.menuService.getData();

    this.menu = [
      {
        id: 1,
        text: "Item1",
        routerLink: undefined,
        icon: "home",
        parentId: undefined,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 2,
        text: "Item2",
        routerLink: undefined,
        icon: "sentiment_satisfied_alt",
        parentId: undefined,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 3,
        text: "Item3",
        routerLink: "/action3",
        icon: "sentiment_satisfied_alt",
        parentId: 1,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 4,
        text: "Item4",
        routerLink: "/action3",
        icon: "location_on",
        parentId: 1,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 5,
        text: "Item5",
        routerLink: undefined,
        icon: "location_on",
        parentId: 2,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 6,
        text: "Item6",
        routerLink: null,
        icon: "location_on",
        parentId: 5,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 7,
        text: "Item7",
        routerLink: undefined,
        icon: "location_on",
        parentId: 5,
        opacity: undefined,
        children: undefined,
      },
      {
        id: 8,
        text: "Item8",
        routerLink: undefined,
        icon: "location_on",
        parentId: 7,
        opacity: undefined,
        children: undefined,
      },
    ];
    this.renderMenu(this.menu);

    //this.shareDataService.getData();
    //this.menuList$
    //  .subscribe(menuItems => {
    //    this.menu = menuItems as Menu[]
    //    this.renderMenu(this.menu);
    //  });

  }

  renderMenu(menu: Menu[]) {
    while (menu.length > 0) {
      menu.forEach((menuItem) => {
        menuItem.children = [];

        if (!menuItem.parentId) {
          const index: number = menu.indexOf(menuItem);
          if (index !== -1) {
            menu.splice(index, 1);
          }
          menuItem.opacity = 0;
          this.finalMenu.push(menuItem);
        } else {
          const father = menuItem.parentId;

          this.serachFather(this.finalMenu, father, menuItem, menu);
        }
      });
    }
    this.menuLoaded = true;
  }

  serachFather(menuArray: Menu[], father, menuItem: Menu, menu) {
    menuArray.forEach((menuPainted) => {
      if (menuPainted.id === father) {
        menuItem.opacity = menuPainted.opacity + 1;
        menuPainted.children.push(menuItem);

        const index: number = menu.indexOf(menuItem);
        if (index !== -1) {
          menu.splice(index, 1);
        }
      } else {
        this.serachFather(menuPainted.children, father, menuItem, menu);
      }
    });
  }
  // angular-material-menu - end
}
