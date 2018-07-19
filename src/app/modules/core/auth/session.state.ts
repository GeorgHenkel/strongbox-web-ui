import {HttpErrorResponse} from '@angular/common/http';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';

import {CredentialsExpiredAction, LoginAction, LogoutAction} from './auth.actions';
import {User, UserAuthority} from './auth.model';
import {AuthService} from './auth.service';
import {HideSideNavAction, OpenLoginDialogAction} from '../../../state/app.actions';

export interface SessionStateModel {
    user: User | null;
    token: string | null;
    state: 'authenticated' | 'guest' | 'invalid.credentials' | 'error' | 'pending';
    response?: HttpErrorResponse | string | any;
}

export const defaultSessionState: SessionStateModel = {
    user: null,
    token: null,
    state: 'guest',
    response: null
};

let initialState: SessionStateModel = defaultSessionState;
if (localStorage.getItem('session') !== '') {
    let session: SessionStateModel = defaultSessionState;

    try {
        const rawSession = JSON.parse(localStorage.getItem('session'));
        session = {
            user: new User(rawSession.user.username, rawSession.token, rawSession.user.authorities.map(val => new UserAuthority(val.name))),
            token: rawSession.token,
            state: rawSession.state
        };
    } catch (e) {
        console.warn('Invalid session found in localStorage.');
        session = defaultSessionState;
    }

    if (session !== null && session.token !== '') {
        initialState = session;
    }
}


@State<SessionStateModel>({
    name: 'session',
    defaults: initialState
})
export class SessionState {

    @Selector()
    static token(session: SessionStateModel) {
        return session.token;
    }

    @Selector()
    static user(session: SessionStateModel) {
        return session.user;
    }

    @Selector()
    static state(session: SessionStateModel) {
        return session.state;
    }

    @Selector()
    static isAuthenticated(session: SessionStateModel) {
        return session.user !== null && session.token !== null && session.state === 'authenticated';
    }

    @Selector()
    static authorities(session: SessionStateModel) {
        if (session.user) {
            return session.user.authorities;
        } else {
            return null;
        }
    }

    @Selector()
    static roles(session: SessionStateModel) {
        if (session.user) {
            return session.user.roles;
        } else {
            return null;
        }
    }

    constructor(private auth: AuthService, private store: Store) {
    }

    @Action(LoginAction)
    login(ctx: StateContext<SessionStateModel>, {payload}: LoginAction) {
        ctx.patchState({state: 'pending'});
        return this.auth.login(payload).pipe(
            tap((state: SessionStateModel) => {
                if (state.state === 'authenticated') {
                    localStorage.setItem('session', JSON.stringify(state));
                }
                ctx.setState(state);
            }),
            catchError((state: any, caught) => {
                ctx.patchState(defaultSessionState);
                console.log('Fatal authentication error!', state, caught);
                return of(null);
            })
        );
    }

    @Action(LogoutAction)
    logout(ctx: StateContext<SessionStateModel>) {
        if (ctx.getState().state === 'authenticated') {
            ctx.setState(defaultSessionState);
            localStorage.setItem('session', JSON.stringify(defaultSessionState));
            this.store.dispatch(new HideSideNavAction());
            this.store.dispatch(new Navigate(['/']));
        }
    }

    @Action(CredentialsExpiredAction)
    expired(ctx: StateContext<SessionStateModel>, {payload}: CredentialsExpiredAction) {
        this.store.dispatch([new LogoutAction(), new OpenLoginDialogAction(payload)]);
    }


}
