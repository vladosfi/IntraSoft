import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { map } from 'rxjs';
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
  dataSource = new MatTreeNestedDataSource<Menu>();
  treeControl = new NestedTreeControl<Menu>(node => node.children);
  menuItem: Menu[];

  constructor(private shareDataService: ShareNavigationDataService) {
  }

  ngOnInit(): void {
    //this.dataSource.data = this.menuItem;
    //this.dataSource.data = TREE_DATA;
    //this.dataSource.data = this.menuList$;

    this.menuList$
      .subscribe(items => {
        this.dataSource.data = items as Menu[]
      });


  }

  hasChild = (index: number, node: Menu) => !!node?.children && node?.children?.length > 0;
}

