import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AppSettings} from '../config/app.config';
import {AuthService, AuthState} from './auth.service';
import {HttpClient} from '@angular/common/http';
import { HttpHelper } from '../common/http-header/http-header.class';

export interface UserData {
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role:String,
  isActive: Boolean
}

export interface ForgotData {
  id: number,
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends HttpHelper {
  private userData: UserData;
  private forgotData:ForgotData;
  private userDataSubject = new Subject<UserData>();
  onUserDataChange = this.userDataSubject.asObservable();
  public currentUserData: any;
  public currentforgotData: any;

  constructor(private auth: AuthService,
              private http: HttpClient) {
    super();
    if (localStorage.getItem(AppSettings.localStorage_keys.userData)) {
      this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    }
    this.subscriptions();
  }

  subscriptions() {    
    this.auth.authState.subscribe((data: AuthState) => {
      if (data.is_logged_in) {
        this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
        this.userDataSubject.next(this.userData);
      }
    });
  }
  get getUserData(): UserData {
    return this.userData;
  }

  get isAdmin(): boolean {
    return this.userData.role == UserRole.Admin
  }

  get isUser(): boolean {
    return this.userData.role == UserRole.User
  }


  setUserData(data: any): void {
    this.userData = data;
    localStorage.setItem(AppSettings.localStorage_keys.userData, JSON.stringify(this.userData));
    this.userDataSubject.next(this.userData);
  }

  public getCurrentUserData() {
    this.currentUserData = localStorage.getItem(AppSettings.localStorage_keys.userData);
    return JSON.parse(this.currentUserData);
  }

  setForgotID(data: any): void {
    this.forgotData = data;
    localStorage.setItem(AppSettings.localStorage_keys.forgotData, JSON.stringify(this.forgotData));    
  }

  public getForgotID() {
    this.currentforgotData = localStorage.getItem(AppSettings.localStorage_keys.forgotData);
    return JSON.parse(this.currentforgotData);
  }
}
