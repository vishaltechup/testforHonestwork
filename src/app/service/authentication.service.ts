import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
import { HttpHelper, HTTPRESPONSE } from '../common/http-header/http-header.class';
import { map } from 'rxjs/operators';
import { AppSettings } from '../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends HttpHelper {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {
        super();
    }

    // signup(data: { [key: string]: any }): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/auth/login`, data)
    //         .pipe(
    //             map((res: HTTPRESPONSE) => {
    //                 if (res.success) {
    //                     this.setUserData(res.result);
    //                 }
    //                 return res;
    //             })
    //         );
    // }

    singin(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users/login`, data)
            .pipe(
                map((res: HTTPRESPONSE) => {
                    if(res.data.user_type != "User"){
                        this.setUserData(res.data);
                    }
                    return res;
                })
            )
    }

    setUserData(data: any) {
    
        let userData = {
            id: data.id,
            userName: data.userName,
            token: data.token,
            email: data.email,
            user_type:data.user_type

        }

       
        localStorage.setItem(AppSettings.localStorage_keys.userData, JSON.stringify(userData));
    }
}
