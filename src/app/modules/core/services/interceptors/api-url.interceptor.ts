import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

import {environment} from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiURLInterceptor implements HttpInterceptor {

    readonly protocolMatcher = new RegExp(/^(http(s)?).*/i);

    constructor(@Inject(DOCUMENT) private document) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // If the requested URL has "http(s)" - it's external.
        if (environment.strongboxUrl != null && this.protocolMatcher.test(request.url) === false) {
            let protocol;

            if (this.protocolMatcher.test(environment.strongboxUrl)) {
                protocol = environment.strongboxUrl.match(this.protocolMatcher)[1];
            } else {
                protocol = document.location.protocol.match(this.protocolMatcher)[1];
            }

            const url = protocol + '://' + environment.strongboxUrl + '/' + request.url.replace(/^\//, '');
            request = request.clone({url: url, withCredentials: true});
        }

        // Some endpoints don't like it when you haven't specified the accept header.
        let headers = request.headers;
        if (!headers.has('Accept')) {
            headers = headers.set('Accept', 'application/json');
        }

        // X-Requested-With: {@see SB-974}
        if (!headers.has('X-Requested-With')) {
            headers = headers.set('X-Requested-With', 'XMLHttpRequest');
        }

        request = request.clone({headers: headers});

        return next.handle(request);
    }
}
