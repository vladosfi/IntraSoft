import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { Menu } from '../../../core/interfaces/Menu';
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
export class MenuComponent implements OnInit{
  menuList$ = this.shareDataService.menuList$;
  treeControl = new NestedTreeControl<Menu>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Menu>();
  menuItem: Menu[];

  constructor(private shareDataService: ShareNavigationDataService) {
    //this.dataSource.data = TREE_DATA;
    //this.dataSource.data = this.menuList$;

    this.menuList$
      .subscribe(countries => {
        this.menuItem = countries as Menu[]
      });
  }

  ngOnInit(): void {
    this.dataSource.data = this.menuItem;
  }

  hasChild = (_: number, node: Menu) => !!node.children && node.children.length > 0;
}


