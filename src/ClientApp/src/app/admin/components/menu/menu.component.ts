import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Menu } from '../../../core/interfaces/Menu';
import { ShareNavigationDataService } from '../../../core/services/share-navigation-data.service';

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

  constructor(private shareDataService: ShareNavigationDataService) {
  }

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu() {
    this.reloadCurrentData();
    
    this.menuList$
      .subscribe(item => {
        if (item !== null) {
          this.dataSource.data = item as Menu[];
        }
      });
  }

  reloadCurrentData() {
    this.shareDataService.getAllData();
  }


  hasChild = (index: number, node: Menu) => !!node?.children && node?.children?.length > 0;


  getMenuItem(id: number) {
    this.shareDataService.getSingleItem(id);
  }
}


