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
    //console.log(this.orderCategories[this.orderForm.get('orderCategoryId').value]);
    if (this.orderForm.status !== 'VALID') {
      for (const field in this.orderForm.controls) { // 'field' is a string
        this.orderForm.controls[field].markAllAsTouched();
      }
      return;
    }

    this.uploadOrder();
  }

  uploadOrder() {
    let newOrder = this.generateOrder();
    let formToSend = this.generateOrderFormData(newOrder);    

    this.fileService.uploadFile(formToSend, this.endPointPath, this.data.newRecord)
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

  private generateOrderFormData(order: Order): FormData {    
    let formData = new FormData();
    formData.append('id', order.id.toString());
    formData.append('number', order.number);
    formData.append('date', order.date);
    formData.append('about', order.about);
    formData.append('orderCategoryId', order.orderCategoryId.toString());
    formData.append('file', this.selectedFile);
    formData.append('filePath', order.filePath);

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    return formData;
  }

  private generateOrder(): Order {
    let date = this.generateDateWithoutOffset(this.orderForm.get('date').value);

    return {
      id: this.data.id || this.orderForm.get('id').value,
      number: this.orderForm.get('number').value,
      date: date,
      about: this.orderForm.get('about').value,
      orderCategoryId: this.orderForm.get('orderCategoryId').value,
      orderCategoryName: this.orderCategories[this.orderForm.get('orderCategoryId').value - 1].name,
      filePath: this.orderForm.get('filePath').value,
    } as Order;
  }

  private generateDateWithoutOffset(date){
    date = new Date(date);    
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  }
}
