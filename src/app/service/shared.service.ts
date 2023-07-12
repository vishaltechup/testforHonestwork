import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class SharedService {

	public notify = new BehaviorSubject<any>('');
  	notifyObservable$ = this.notify.asObservable();
	constructor(
		private http: HttpClient,
		private SpinnerService: NgxSpinnerService
	) { }

	isLoading = false;
	

	showLoading() {
		setTimeout(() => {
			this.isLoading = true;
			this.SpinnerService.show();
		}, 1);
	}

	hideLoading() {
		this.isLoading = false;
		this.SpinnerService.hide();
	}

	notifyOther(data: any) {
		if (data) {
			this.notify.next(data);
		}
	  }
}
