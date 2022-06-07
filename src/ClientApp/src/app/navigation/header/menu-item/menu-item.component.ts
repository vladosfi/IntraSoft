import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/core/services/file.service';
import { Menu } from '../../../core/interfaces/Menu';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: Menu[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;
  maxLenghtForTooltip = 30;
  pathToFile = 'api/documents';


  constructor(
    public router: Router,
    private fileService: FileService,
    ) {  }

  ngOnInit() {  }

  downloadFile(fileId: string){
    this.fileService.downloadFile(fileId, this.pathToFile);
  }



}
