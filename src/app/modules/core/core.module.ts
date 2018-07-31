import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule} from 'ngx-toastr';

import {MaterialModule} from '../../shared/material.module';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {RepositorySearchResultsComponent} from './pages/search/repository-search-results.component';
import {environment} from '../../../environments/environment';
import {ApiURLInterceptor} from './services/interceptors/api-url.interceptor';
import {CodeSnippet} from './pipes/code-snippet.pipe';
import {RepositorySearchService} from './pages/search/repository-search.service';
import {CoreRouterResolver} from './core.router.resolver';
import {SessionState} from './auth/state/session.state';
import {AuthService} from './auth/auth.service';
import {LoginDialogComponent} from './dialogs/login/login.dialog.component';
import {AppState} from '../../state/app.state';
import {TokenInterceptor} from './services/interceptors/token.interceptor';
import {AuthGuard} from './auth/auth.guard';
import {ProfileComponent} from './pages/profile/profile.component';
import {ProfileService} from './pages/profile/profile.service';
import {ProfileFormState} from './pages/profile/state/profile.form.state';
import {ErrorInterceptor} from './services/interceptors/error.interceptor';
import {ConfirmDialogComponent} from './dialogs/confirm/confirm.dialog.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        // User Interface (layout, material, etc)
        FlexLayoutModule,
        MaterialModule,
        ToastrModule.forRoot({
            autoDismiss: true,
            disableTimeOut: false,
            progressBar: true,
            preventDuplicates: true,
            progressAnimation: 'decreasing',
            timeOut: 5000,
            extendedTimeOut: 2000,
            positionClass: 'toast-bottom-right'
        }),

        // State management
        NgxsModule.forRoot([
            AppState,
            SessionState,
            ProfileFormState
        ]),
        NgxsRouterPluginModule.forRoot(),
        NgxsFormPluginModule.forRoot(),

        (environment.production === false ? NgxsReduxDevtoolsPluginModule.forRoot() : []),
        (environment.production === false ? NgxsLoggerPluginModule.forRoot() : []),

        // Fancy progress loader.
        NgProgressModule.forRoot({
            color: '#2684bd',
            spinner: false,
            thick: true,
            debounceTime: 100
        }),
        NgProgressHttpModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MaterialModule,
        FlexLayoutModule,

        NgxsModule,
        NgxsRouterPluginModule,

        NgProgressModule,
        NgProgressHttpModule,

        LoginDialogComponent,
        ConfirmDialogComponent
    ],
    declarations: [
        CodeSnippet,
        HomepageComponent,
        LoginDialogComponent,
        ConfirmDialogComponent,
        RepositorySearchResultsComponent,
        PageNotFoundComponent,
        ProfileComponent
    ],
    entryComponents: [
        LoginDialogComponent,
        ConfirmDialogComponent
    ],
    providers: [
        /* Intercept and rewrite requests to point to localhost:48080 when in development */
        (environment.strongboxUrl === null ? [] : {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiURLInterceptor,
            multi: true
        }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        CoreRouterResolver,
        AuthService,
        AuthGuard,
        ProfileService,
        RepositorySearchService
    ]
})
export class CoreModule {
}
