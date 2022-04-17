import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Menu } from '../../core/interfaces/Menu';
import { ShareNavigationDataService } from '../../core/services/share-navigation-data.service';

@Component({
  selector: 'app-angular-material-menu',
  templateUrl: './angular-material-menu.component.html',
  styleUrls: ['./angular-material-menu.component.css']
})
export class AngularMaterialMenuComponent implements OnInit {
  @Input("menu") menu: Menu[];
  menuList$ = this.shareDataService.menuList$;
  @Output() sidenavClose = new EventEmitter();

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  constructor(private shareDataService: ShareNavigationDataService,) { }


  ngOnInit(): void {
    //console.log(this.menu);
  }
}







  
