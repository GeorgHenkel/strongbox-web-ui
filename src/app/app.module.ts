import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {CoreModule} from './modules/core/core.module';
import {AppRoutingModule} from './app.routing.module';
import {FormHelperModule} from './shared/form/form-helper.module';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        CoreModule,
        FormHelperModule,

        // Order is important - this needs to be last!
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
