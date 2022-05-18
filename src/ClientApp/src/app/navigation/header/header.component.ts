import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';
import { ShareNavigationDataService } from '../../core/services/share-navigation-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  menuList$ = this.shareDataService.menuList$;
  pathToFile = 'api/document';

  constructor(
    public shareDataService: ShareNavigationDataService,
    private fileService: FileService,
    ) {  }

  ngOnInit(): void {
    this.shareDataService.getAllData();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  downloadFile(fileId: string){
    this.fileService.downloadFile(fileId, this.pathToFile);
  }

}
