import { MenuService } from '../menu.service';
import { ShareNavigationDataService } from '../share-navigation-data.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IMenu } from '../../_interfaces/menu';
import { map } from 'rxjs';


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  title: string;
  subMenus?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    title: 'Fruit',
    subMenus: [{ title: 'Apple' }, { title: 'Banana' }, { title: 'Fruit loops' }],
  },
  {
    title: 'Vegetables',
    subMenus: [
      {
        title: 'Green',
        subMenus: [{ title: 'Broccoli' }, { title: 'Brussels sprouts' }],
      },
      {
        title: 'Orange',
        subMenus: [{ title: 'Pumpkins' }, { title: 'Carrots' }],
      },
    ],
  },
];



@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  menuList$ = this.shareDataService.menuList$;

  treeControl = new NestedTreeControl<IMenu>(node => node.subMenus);
  dataSource = new MatTreeNestedDataSource<IMenu>();

  constructor(
    private menuService: MenuService,
    private shareDataService: ShareNavigationDataService
  ) {
    //this.dataSource.data = TREE_DATA;
    this.dataSource.data = this.menuList$;
  }

  hasChild = (_: number, node: IMenu) => !!node.subMenus && node.subMenus.length > 0;


  ngOnInit(): void {
  }


  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }


}
