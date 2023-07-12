import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  passwordRegex = '';
  startRegex = '^';
  endRegex = 'A-Za-z\\d@$!%*?&';
  errorMsg = '';

  constructor() { }

  static signInUserCredValidator(control: any) {
    if (
      control.value &&
      (control.value.match(
        // tslint:disable-next-line:max-line-length
        /(^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$)/
      ) ||
        control.value.match(/^\+?[0-9]{10}$/))
    ) {
      return null;
    } else if (
      control.value === 0 ||
      control.value == null ||
      control.value === ''
    ) {
      return null;
    } else {
      return { invalidEmail: true };
    }
  }

 createPasswordRule() {
    const minimumLength = 6;
    const maximumLength = 15;
    this.errorMsg = 'Password must have atleast ';
    this.errorMsg = this.errorMsg + minimumLength + ' to ' + maximumLength + ' characters ';
    const letterRequired = true;
    const isUppleLowerRequired = true;
    const numericRequired = true;
    const specialCharRequired = true;
    if (letterRequired) {
      if (isUppleLowerRequired) {
        this.errorMsg = this.errorMsg + 'one Upper case one lower case ';
        this.passwordRegex = this.passwordRegex + '(?=.*[a-z])(?=.*[A-Z])';
      } else {
        this.errorMsg = this.errorMsg + 'one letter ';
        this.passwordRegex = this.passwordRegex + '(?=.*[a-zA-Z])';
      }
    }
    if (numericRequired) {
      this.errorMsg = this.errorMsg + 'one numeric ';
      this.passwordRegex = this.passwordRegex + '(?=.*\\d)';
    }
    if (specialCharRequired) {
      this.errorMsg = this.errorMsg + 'one special character ';
      this.endRegex = this.endRegex + '@$!%*?&';
      this.passwordRegex = this.passwordRegex + '(?=.*[@$!%*?&])';
    }
    const finalEnd = '[' + this.endRegex + ']' + '{' + minimumLength + ',' + maximumLength + '}$';
    const finalRegex = this.startRegex + this.passwordRegex + finalEnd;
    return [finalRegex, this.errorMsg];
  }

  static passwordValidator(control: any) {
    if (
      control.value && (control.value.length >= 6)
    ) {
      return null;
    } else {
      return { passwdRegexErr: true };
    }
  }
  static phoneNumberValidator(control: any) {
    if (control.value != null && String(control.value).match(/^[0-9]{10}$/)) {
      return null;
    } else if (control.value === 0 || control.value == null) {
      return null;
    } else {
      return { invalidMobile: true };
    }
  }
  static userCredValidator(control: any) {
    if (
      control.value &&
      (control.value.match(
        // tslint:disable-next-line:max-line-length
        /(^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$)/
      ) ||
        control.value.match(/^\+?[0-9]{10}$/))
    ) {
      return null;
    } else {
      return { invalidEmailorPhone: true };
    }
  }

  checkPasswordStregnth(password) {
    let strength = 0;
    if (password.length < 6) {
      return 'Too short';
    }
    if (password.length > 7) { strength += 1; }
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) { strength += 1; }
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) { strength += 1; }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) { strength += 1; }
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) { strength += 1; }
    if (strength < 2) {
      return 'Weak';
    } else if (strength === 2) {
      return 'Good';
    } else {
      return 'Strong';
    }
  }

}
