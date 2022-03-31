
import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { MenuService } from '../../navigation/menu.service';
import { ShareNavigationDataService } from '../../navigation/share-navigation-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  /*public menu: Menu[];*/
  menuList$ = this.shareDataService.menuList$;
  

  constructor(
    private menuService: MenuService,
    public shareDataService: ShareNavigationDataService) {
  }

  ngOnInit(): void {
    this.shareDataService.getData();
    //this.loadData(null);
  }

  //loadData(query: string = null) {
  //  this.menuService.getData<IMenu[]>()
  //    .subscribe(result => {
  //      this.menu = result;
  //    }, error => console.error(error));
  //}

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
