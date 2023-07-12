import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, map, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/config/app.config';
import { ENVIRONMENT } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpCallService {
	private ajaxTimeout = 60000;
	constructor(public httpClient: HttpClient) { }

	setHeaders(sendJWT = true) {
		let headers = new HttpHeaders();
		
		if (sendJWT) {
		  const sessionUserToken = `Bearer ${localStorage.getItem(AppSettings.localStorage_keys.token)}`;
			headers = headers.append('Authorization',sessionUserToken);
		 
		}
		return headers;
	  }

	  setMultipartHeaders(sendJWT = true) {
		let headers = new HttpHeaders();
		if (sendJWT) {
		  const sessionUserToken = `Bearer ${localStorage.getItem(AppSettings.localStorage_keys.token)}`;
			headers = headers.append('Authorization',sessionUserToken);
			headers = headers.append('Content-Type', 'multipart/form-data;')
		}
		return headers;
	  }

	get(endpoint, sendJWT = true) {
		return this.httpClient.get<any>(
		  `${ENVIRONMENT.API_ENDPOINT}${endpoint}`, {
			headers: this.setHeaders(sendJWT),
		});
	  }

	post(endpoint, data, sendJWT = true) {
		console.log(ENVIRONMENT.API_ENDPOINT)
		console.log(endpoint)
		return this.httpClient.post<any>(
		  `${ENVIRONMENT.API_ENDPOINT}${endpoint}`, data, {
		  headers: this.setHeaders(sendJWT),
		});
	  }
	  put(endpoint, data, sendJWT = true) {
		return this.httpClient.put<any>(
		  `${ENVIRONMENT.API_ENDPOINT}${endpoint}`, data, {
		  headers: this.setHeaders(sendJWT),
		});
	  }

	  uploadFile(endpoint, data, sendJWT = true) {
		return this.httpClient.post<any>(
		  `${ENVIRONMENT.API_ENDPOINT}${endpoint}`, data, {
		  headers: this.setMultipartHeaders(sendJWT),
		});
	  }

	  uploaddataFile(endpoint,uploadFile: File,Id) {

		const formData: FormData = new FormData();
		formData.append('fileKey', uploadFile, uploadFile.name);	
		formData.append('Id', Id);
		return this.httpClient.post(`${ENVIRONMENT.API_ENDPOINT}${endpoint}`, formData);
	  }

	  UploaddeliverableFile(endpoint,uploadFile: File,projectId,name,workerId,userId) {

		const formData: FormData = new FormData();
		formData.append('fileKey', uploadFile, uploadFile.name);	
		formData.append('projectId', projectId);
		formData.append('name', name);
		formData.append('workerId', workerId);
		formData.append('userId', userId);		
		return this.httpClient.post(`${ENVIRONMENT.API_ENDPOINT}${endpoint}`, formData);
	  }


	delete(endpoint, sendJWT = true) {
	return this.httpClient.delete<any>(
		`${ENVIRONMENT.API_ENDPOINT}${endpoint}`, {
		headers: this.setHeaders(sendJWT),
	});
	}

	postFormData(url: string, params: any = null, isHideLoader: boolean = false, isNotTimeout: boolean = false, t_headers: any = []): Observable<any> {
		if (!isHideLoader) {
			// this.loaderService.show();
		}

		let httpHeaders = new HttpHeaders();
		// httpHeaders = httpHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
		// httpHeaders = httpHeaders.append('frontend', 'true');
		const httpOption = {
			headers: httpHeaders
		};
		url = url;
		const httpClientReq = this.httpClient.post(url, params, httpOption);
		if (isNotTimeout) {
			httpClientReq.pipe(timeout(this.ajaxTimeout));
		}
		httpClientReq.pipe(map(result => {
			console.log('resultL:', result);
			return result;
		}));
		return httpClientReq;
	}

	postFile(url: string, params: any = null, isHideLoader: boolean = false, isNotTimeout: boolean = false, t_headers: any = []): Observable<any> {
		if (!isHideLoader) {
			// this.loaderService.show();
		}

		let httpHeaders = new HttpHeaders();
		//httpHeaders = httpHeaders.append('Content-Type', undefined);
		//httpHeaders = httpHeaders.append('frontend', 'true');
		const httpOption = {
			headers: httpHeaders
		};
		url = url;
		const httpClientReq = this.httpClient.post(url, params, httpOption);
		if (isNotTimeout) {
			httpClientReq.pipe(timeout(this.ajaxTimeout));
		}
		httpClientReq.pipe(map(result => {
			console.log('resultL:', result);
			return result;
		}));
		return httpClientReq;
	}

	postFileDownload(url: string, params: any = null, isHideLoader: boolean = false, isNotTimeout: boolean = false, t_headers: any = []): Observable<any> {
		if (!isHideLoader) {
			// this.loaderService.show();
		}

		let httpHeaders = new HttpHeaders();

		//httpHeaders = httpHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
		//httpHeaders = httpHeaders.append('Accept', 'application/pdf');
		//httpHeaders = httpHeaders.append('frontend', 'true');
		// httpHeaders = httpHeaders.append('responseType ', 'json');
		const httpOption = {
			headers: httpHeaders,
		};
		url = url;
		const httpClientReq = this.httpClient.post(url, params, {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
			}), responseType: 'blob'
		});
		if (isNotTimeout) {
			httpClientReq.pipe(timeout(this.ajaxTimeout));
		}
		httpClientReq.pipe(map(result => {
			console.log('resultL:', result);
			return result;
		}));
		return httpClientReq;
	}
}
