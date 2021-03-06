import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IFileDocument } from 'src/app/core/interfaces/FileDocument';
import { FileService } from 'src/app/core/services/file.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent implements OnInit {
  fileInfoMessage = '';
  deleteButtonText: string;
  fileId: string;
  endPointPath = 'api/documents';
  @Input() sourcePath: string = null;
  @Input() MenuId: string = null;
  @Input() document: IFileDocument = null;
  @Output() changeRouterLinkEvent = new EventEmitter<string>();

  form = new FormGroup({
    file: new FormControl(''),
    fileSource: new FormControl('')
  });

  constructor(
    private fileService: FileService,
    private snackbar: NotificationService) { }

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

    this.fileService.deleteFile(this.fileId, this.endPointPath)
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

    let formData = new FormData();
    formData.append('file', file);
    formData.append('id', this.MenuId);
    formData.append('path', this.sourcePath);

    this.fileService.uploadFile(formData, this.endPointPath, true)
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
              this.changeRouterLinkEvent.emit(`document/${this.fileId}`);
            }
          },
          complete: () => {
            this.fileInfoMessage = 'Upload done: ID - ' + this.fileInfoMessage;
          }
        });
  }
}
