import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/http-header/http-header.class';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpHelper {

  constructor(private http: HttpClient) {
    super();
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/weblogin`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Agency/insertagencydetails`, data);
  }
  signupWithVerificationCode(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ProjectAgencyInvite/signupwithverificationcode`, data);
  }
  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/ChangePassword`, data);

  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/User/`, this.getHttpOptions());
  }
  findUser(firstname: String): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/findUser/?firstname=${firstname}`, this.getHttpOptions());
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getHttpOptions());
  }

  updateUserRole(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/`, data, this.getHttpOptions());
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/forgetpassword?`, data);
  }

  forgotPasswordrequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/sendagencyinvitationcodeotp?`, data);
  }

  verifyCodeOTP(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/verifycodeotp`, data);
  }
  agencyDetailsByVerificationCode(code: any) {
    return this.http.post(`${this.apiUrl}/ProjectAgencyInvite/getagencydetailsbyverificationcode?Verificaitoncode=${code}`, null);
  }
}
