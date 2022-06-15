import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order, OrderCategory } from 'src/app/core/interfaces/Order';
import { FileService } from 'src/app/core/services/file.service';
import { OrderCategoryService } from 'src/app/core/services/orderCategory.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css']
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;
  title = 'Добавяне на заповед';
  orderCategories: OrderCategory[] = [];
  selectedFile: any;
  fileInfoMessage: any = '';
  endPointPath = 'api/orders';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderCategoryService: OrderCategoryService,
    private snackbar: SnackbarService,
    private fileService: FileService,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
  ) {
    this.title = this.data.title;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.orderCategoryService.getData().subscribe(
      {
        next: (result) => {
          this.orderCategories = result;
          this.prepairForm();
        }
      });
  }

  prepairForm() {
    this.orderForm = this.fb.group({
      id: new FormControl(this.data.id || ''),
      number: new FormControl(this.data.number || '', Validators.required),
      about: new FormControl(this.data.about || '', Validators.required),
      date: new FormControl(this.data.date || '', Validators.required),
      categories: new FormControl(this.orderCategories, Validators.required),
      orderCategoryId: new FormControl({ value: this.data.orderCategoryId || '', disabled: false }),
      orderCategoryName: new FormControl({ value: this.data.orderCategoryName || '', disabled: false }),
      filePath: new FormControl(this.data.filePath?.split('\\').pop().split('/').pop() || '', Validators.required),
      file: new FormControl(this.data.file || ''),
    });
  }

  // At the file input element
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.orderForm.get('filePath').patchValue(event.target.files[0].name);
    }
  }




  onSaveClick(event: any) {

    if (this.orderForm.status !== 'VALID') {
      for (const field in this.orderForm.controls) { // 'field' is a string
        this.orderForm.controls[field].markAllAsTouched();
      }
      return;
    }

    this.uploadOrder();

  }

  uploadOrder() {
    let newOrder = this.generateOrderFormData();
    

    this.fileService.uploadFile(newOrder, this.endPointPath, this.data.newRecord)
      .subscribe(
        {
          next: (event) => {
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.fileInfoMessage = `Файлът е ${percentDone}% качен.`;

            } else if (event instanceof HttpResponse) {
              this.fileInfoMessage = 'Файлът е качен!';
              this.fileInfoMessage = event.body;
              this.closeDialog(event.body);
            }
          },
          error: (error) => {
            this.snackbar.error(`Грешка при качване: ${JSON.stringify(error.message)}`);
          }
          ,
          complete: () => {
            this.fileInfoMessage = 'Upload done: ID - ' + this.fileInfoMessage;
          }
        });
  }

  private closeDialog(newOrder) {
    if (newOrder) {
      this.dialogRef.close(newOrder);
    }
    else {
      this.dialogRef.close(this.generateOrder());
    }
  }

  private generateOrderFormData(): FormData {
    let dateWithoutOffset =  new Date(this.orderForm.get('date').value.getTime() - (this.orderForm.get('date').value.getTimezoneOffset() * 60000)).toISOString();

    let formData = new FormData();
    formData.append('id', this.orderForm.get('id').value);
    formData.append('number', this.orderForm.get('number').value);
    formData.append('date', dateWithoutOffset);
    formData.append('about', this.orderForm.get('about').value);
    formData.append('orderCategoryId', this.orderForm.get('orderCategoryId').value.toString());
    formData.append('file', this.selectedFile);
    formData.append('filePath', this.orderForm.get('filePath').value);

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    return formData;
  }

  private generateOrder(): Order {
    let dateWithoutOffset =  new Date(this.orderForm.get('date').value.getTime() - (this.orderForm.get('date').value.getTimezoneOffset() * 60000)).toISOString();

    return {
      id: this.data.id,
      number: this.orderForm.get('number').value,
      date: dateWithoutOffset,
      about: this.orderForm.get('about').value,
      orderCategoryId: this.orderForm.get('orderCategoryId').value,
      orderCategoryName: this.orderCategories[this.orderForm.get('orderCategoryId').value].name,
      filePath: this.orderForm.get('filePath').value,
    } as Order;
  }
}
