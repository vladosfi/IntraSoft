import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from '../components/home/home.component';
import { MenuComponent } from '../admin/components/menu/menu.component';
import { SingleMenuItemComponent } from '../admin/components/single-menu-item/single-menu-item.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin/menu', component: MenuComponent },
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
