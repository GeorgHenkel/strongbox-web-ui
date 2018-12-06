import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {ListUsersComponent} from './pages/list-users/list-users.component';
import {ViewUserGuard} from './guards/view-user.guard';
import {ViewUserComponent} from './pages/view-user/view-user.component';
import {ManageUserComponent} from './pages/manage-user/manage-user.component';
import {UpdateUserGuard} from './guards/update-user.guard';
import {CreateUserGuard} from './guards/create-user.guard';

const routes: Routes = [
    {
        path: '',
        component: ListUsersComponent,
        canActivate: [AuthGuard, ViewUserGuard]
    },
    {
        path: 'create',
        component: ManageUserComponent,
        canActivate: [AuthGuard, CreateUserGuard]
    },
    {
        path: ':username/view',
        component: ViewUserComponent,
        canActivate: [AuthGuard, ViewUserGuard]
    },
    {
        path: ':username/edit',
        component: ManageUserComponent,
        canActivate: [AuthGuard, UpdateUserGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRouting {
}

