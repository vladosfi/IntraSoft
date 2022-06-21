import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileService } from 'src/app/core/services/file.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  title = "Изпращане на съобщение"
  emailForm: FormGroup;
  file_store: FileList;
  file_list: Array<string> = [];
  endPointPath = 'api/mail';
  fileInfoMessage: any = '';

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.prepairForm();
  }

  prepairForm() {
    this.emailForm = this.fb.group({
      recipients: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4};?)+$/)]),
      subject: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      filePath: new FormControl(''),
      file: new FormControl(''),
    });
    
  }

  onFileChange(l: FileList): void {
    this.file_store = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} файла)` : "";
      this.emailForm.get('filePath').patchValue(`${f.name}${count}`);
    } else {
      this.emailForm.get('filePath').patchValue('');
    }
  }

  onSend() {
    let formToSend = this.generateFormData();    

    this.fileService.uploadFile(formToSend, this.endPointPath, true)
      .subscribe(
        {
          next: (event) => {
            if (event.type == HttpEventType.UploadProgress) {
              //const percentDone = Math.round(100 * event.loaded / event.total);
              // this.fileInfoMessage = `Изпращане ${percentDone}%`;

            } else if (event instanceof HttpResponse) {
              // this.fileInfoMessage = 'Съобщението е изпратено!';
              // this.fileInfoMessage = event.body;
            }
          },
          error: (error) => {
            this.snackbar.error(`Грешка при изпращане`);
          }
          ,
          complete: () => {
            // this.fileInfoMessage = 'Upload done: ID - ' + this.fileInfoMessage;
            // this.snackbar.infoWitHide(`Съобщението беше изпратено`);
            this.fileInfoMessage = 'Съобщението e изпратено!';
            this.resetForm();
          }
        });
  }

  private resetForm(){
    this.emailForm.reset();
           
    Object.keys(this.emailForm.controls).forEach(key => {
      this.emailForm.controls[key].setErrors(null)
    });
  }

  private generateFormData(): FormData { 
    var formData = new FormData();

    this.file_list = [];
    if(this.file_store){
      for (let i = 0; i < this.file_store.length; i++) {
        formData.append("attachments", this.file_store[i], this.file_store[i].name);
        this.file_list.push(this.file_store[i].name);
      }
    }    
    
    formData.append('recipients', this.emailForm.controls['recipients'].value);
    formData.append('subject', this.emailForm.controls['subject'].value);
    formData.append('content', this.emailForm.controls['content'].value);

    return formData;
  }  

}
