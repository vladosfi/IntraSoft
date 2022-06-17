import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from '../components/home/home.component';
import { MenuComponent } from '../admin/components/menu/menu.component';
import { ContactComponent } from '../components/contact/contact.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { IsoListComponent } from '../components/iso-list/iso-list.component';
import { OrdersComponent } from '../components/orders/orders.component';
import { EmailComponent } from '../components/email/email.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin/menu', component: MenuComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'iso-list', component: IsoListComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'email', component: EmailComponent },
  { path: '**', component: NotFoundComponent },
  //{ path: 'admin/menu/:id', component: SingleMenuItemComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
    FlexLayoutModule,
  ],
  declarations: []
})
export class RoutingModule { }
