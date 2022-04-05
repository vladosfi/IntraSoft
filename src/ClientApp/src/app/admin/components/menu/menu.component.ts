import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { map } from 'rxjs';
import { Menu } from '../../../core/interfaces/Menu';
import { MenuService } from '../../../navigation/menu.service';
import { ShareNavigationDataService } from '../../../navigation/share-navigation-data.service';


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuList$ = this.shareDataService.menuList$;
  dataSource = new MatTreeNestedDataSource<Menu>();
  treeControl = new NestedTreeControl<Menu>(node => node.children);
  menuItem: Menu[];


  constructor(private shareDataService: ShareNavigationDataService,
    private menuService: MenuService) {
  }

  ngOnInit(): void {
    //this.dataSource.data = this.menuItem;
    //this.dataSource.data = TREE_DATA;
    //this.dataSource.data = this.menuList$;

    this.menuList$
      .subscribe(item => {
        if (item !== null) {

          var flatedMenu = this.createFlatArrayUsingMap(item);
          this.dataSource.data = item as Menu[];
        }
        //console.log("item: " + JSON.stringify(item));
      });

  }

  createFlatArrayUsingMap(item) {
    var flatedMenusItems: Menu[] = [];

    for (var i = 0; i < item.length; i++) {

      let recursiveFn = (mnuItem) => {

        if (mnuItem.id && mnuItem.text) {
          const { children, parentId, ...rest } = mnuItem;
          //console.log(rest);
          flatedMenusItems.push(rest);
        }

        mnuItem.children.map(recursiveFn)
      }

      recursiveFn(item[i]);
    }

    return flatedMenusItems;
  }

  hasChild = (index: number, node: Menu) => !!node?.children && node?.children?.length > 0;


  getMenuItem(id: number) {
    this.shareDataService.getSingleItem(id);
  }
}


