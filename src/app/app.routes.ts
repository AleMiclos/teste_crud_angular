import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NewItemComponent } from './pages/new-item/new-item.component';
import { ListComponent } from './pages/list/list.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: 'new-item',
    component: NewItemComponent,
  },

  {
    path: 'list',
    component: ListComponent,
  },
];
