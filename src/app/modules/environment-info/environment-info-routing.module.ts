import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CoreRouterResolver} from '../core/core.router.resolver';
import {AuthGuard} from '../core/auth/auth.guard';
import {EnvironmentInfoComponent} from './pages/environment-info/environment-info.component';
import {ViewEnvironmentInfoGuard} from './guards/view-environment-info.guard';

const routes: Routes = [
    {
        path: '',
        component: EnvironmentInfoComponent,
        resolve: {crisis: CoreRouterResolver},
        canActivate: [AuthGuard, ViewEnvironmentInfoGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnvironmentInfoRoutingModule {
}
