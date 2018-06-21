import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';

import {UserCredentials} from '../../auth/auth.model';
import {LoginAction} from '../../auth/auth.actions';
import {SessionState} from '../../auth/session.state';
import {CloseLoginDialogAction} from '../../../../state/app.actions';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login.dialog.component.html',
    styleUrls: ['./login.dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
    @Select(SessionState.state)
    public pending$: Observable<string>;

    public form: FormGroup = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    public data = {
        sessionHasExpired: false,
        sessionIsInvalid: false
    };

    constructor(private store: Store,
                private dialogRef: MatDialogRef<LoginDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) data: any) {
        if (data !== null && data.sessionHasExpired) {
            this.data.sessionHasExpired = true;
        }

        if (data !== null && data.sessionIsInvalid) {
            this.data.sessionIsInvalid = data.sessionIsInvalid;
        }
    }

    login(): void {
        const credentials = new UserCredentials(
            this.form.get('username').value,
            this.form.get('password').value
        );
        this.data.sessionHasExpired = false;
        this.data.sessionIsInvalid = false;
        this.store.dispatch(new LoginAction(credentials));
    }

    hasError(field, error = 'required') {
        return this.form.get(field).hasError(error);
    }

    ngOnInit(): void {
        this.pending$.subscribe((state: string) => {
            if (state === 'authenticated') {
                this.dialogRef.close(null);
            } else if (state === 'invalid.credentials' || state === 'error') {
                const errors: ValidationErrors = {
                    'wrongCredentials': 'true'
                };
                this.form.setErrors(errors);
            }
        });

        this.dialogRef.afterClosed().subscribe(() => this.store.dispatch(new CloseLoginDialogAction()));
    }

}
