import {Component, Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Department } from 'src/app/core/interfaces/Department';
import { DepartmentService } from 'src/app/core/services/department.service';

export interface DialogData {
  title: string;
  serviceNumber: string;
  serviceName: string;
  department: string;  
}


@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit{
  addServiceForm: FormGroup;
  departments: Department[];
 

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private departmentService: DepartmentService,
  ) { }


  ngOnInit(): void {
      this.departmentService.getData().subscribe(
      {
        next: (result) => {
          this.departments = result as Department[] ;
          this.departments = this.departments.slice(1);
        }
      });  

      this.addServiceForm = new FormGroup({
        number: new FormControl(this.data.serviceNumber, Validators.required),
        name: new FormControl(this.data.serviceName, Validators.required),
        department: new FormControl('', Validators.required),
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
