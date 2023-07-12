import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppSettings } from '../config/app.config';


export interface AuthState {
    is_logged_in: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authSubject = new Subject<AuthState>();
    authState = this.authSubject.asObservable();
    private applicationAuthState: AuthState;

    constructor() {
        this.applicationAuthState = {
            is_logged_in: AuthService.isAuthenticated()
        };
    }

    static isAuthenticated(): boolean {
        return !!localStorage.getItem(AppSettings.localStorage_keys.userData);

    }

    setAuthState(data: AuthState) {
        this.applicationAuthState = data;
        this.authSubject.next(data);
    }

    logout() {
        localStorage.removeItem(AppSettings.localStorage_keys.token);
        localStorage.clear();
       

        this.setAuthState({ is_logged_in: false });
    }

}
