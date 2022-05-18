import { Component, Input, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-menu-item-am',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemAMComponent implements OnInit {

  @Input("menuitem") menuitem;
  style;
  styleLink;
  pathToFile = 'api/document';

  constructor(private fileService: FileService,
  ) { }

  ngOnInit(): void {

    if (this.menuitem.children.length === 0) {
      this.styleLink = {
        //"background-color": `rgb(155,155,155,${0 / 10})`,
      };
    }

    this.style = {
      //"background-color": `rgb(155,155,155,${0 / 10})`,
    };
    this.styleLink = {
      "background-color": `rgb(155,155,155,${2 / 10})`,
    };
  }

  downloadFile(fileId: string) {
    this.fileService.downloadFile(fileId, this.pathToFile);
  }
}
