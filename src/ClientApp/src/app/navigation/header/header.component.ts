import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShareNavigationDataService } from '../share-navigation-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  menuList$ = this.shareDataService.menuList$;

  constructor(
    public shareDataService: ShareNavigationDataService) {
  }

  ngOnInit(): void {
    this.shareDataService.getAllData();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
