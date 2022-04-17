import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from '../../core/interfaces/Contact';
import { ContactService } from '../../core/services/contact.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  displayedColumns: string[] = ['id', 'fullname', 'phone', 'email'];
  contacts: Contact[] = [];
  dataSource = new MatTableDataSource(this.contacts);

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getData().subscribe(result => {
      this.contacts = result as Contact[];
      this.dataSource = new MatTableDataSource(this.contacts);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
