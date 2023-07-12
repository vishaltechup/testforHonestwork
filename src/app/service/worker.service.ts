import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCallService } from '..//service/http-call.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(private httpService: HttpCallService) {
  }

  Getworkerdetail(pageNo){
    const  callurl='/Worker/getworkerdetail?Page='+pageNo;
    this.httpService.post(callurl,null).subscribe((res: any) => {    
    }, (err) => {
     
    });
  
  }

}
