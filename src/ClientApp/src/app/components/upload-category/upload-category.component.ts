import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IFileDocument } from 'src/app/core/interfaces/FileDocument';
import { FileService } from 'src/app/core/services/file.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { IIsoFileCategory } from 'src/app/core/interfaces/IsoFileCategory';

@Component({
  selector: 'upload-category',
  templateUrl: './upload-category.component.html',
  styleUrls: ['./upload-category.component.css']
})
export class UploadCategoryComponent implements OnInit {
  fileInfoMessage = '';
  deleteButtonText: string;
  fileId: number;
  defaultLinkPath = 'uploads\\isofile';
  @Input() sourcePath: string = this.defaultLinkPath;
  @Input() MenuId: string = null;
  @Input() document: IFileDocument = null;
  @Input() isoFileCategories: IIsoFileCategory[];

  form = new FormGroup({
    file: new FormControl(''),
    fileSource: new FormControl('')
  });

  constructor(
    private fileService: FileService,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.deleteButtonText = this.document?.fileName;
    this.fileId = this.document?.id;
  }

  // At the file input element
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        fileSource: file
      });

      this.uploadFile(file);
    }
  }

  deleteFile() {
    if (this.fileId === null) return;

    this.fileService.deleteFile(this.fileId)
      .subscribe({
        next: () => {
          this.snackbar.success('File has been deleted');
          this.fileInfoMessage = '';
          this.fileId = null;
          this.form.controls['file'].setValue(null);
        },
        error: (error) => {
          this.snackbar.error('Failed to delete File!');
        }
      });
  }

  uploadFile(file: any) {

    if (file == undefined) {
      console.log("No file selected!");
      return;
    }

    if (this.MenuId == null) {
      console.log("No item ID!");
      return;
    }

    if (this.sourcePath == null) {
      console.log("No source path!");
      return;
    }

    let formData = new FormData();
    formData.append('file', file);
    formData.append('MenuId', this.MenuId);
    formData.append('path', this.defaultLinkPath);

    this.fileService.uploadFile(formData)
      .subscribe(
        {
          next: (event) => {
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.fileInfoMessage = `File is ${percentDone}% uploaded.`;

            } else if (event instanceof HttpResponse) {
              this.fileInfoMessage = 'File is completely uploaded!';
              this.fileInfoMessage = event.body;
              this.deleteButtonText = file.name;
              this.fileId = event.body;
              //this.changeRouterLinkEvent.emit(`document/${this.fileId}`);
            }
          },
          error: (error) => {
            this.snackbar.error(`Upload Error: ${JSON.stringify(error.error)}`);
          }
          ,
          complete: () => {
            this.fileInfoMessage = 'Upload done: ID - ' + this.fileInfoMessage;
          }
        });
  }
}
