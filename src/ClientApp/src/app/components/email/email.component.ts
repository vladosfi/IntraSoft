import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.prepairForm();
  }

  prepairForm() {
    this.emailForm = this.fb.group({
      recipients: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      filePath: new FormControl('', Validators.required),
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
    var fd = new FormData();
    this.file_list = [];
    for (let i = 0; i < this.file_store.length; i++) {
      fd.append("files", this.file_store[i], this.file_store[i].name);
      this.file_list.push(this.file_store[i].name);
    }

    
  }

  

}
