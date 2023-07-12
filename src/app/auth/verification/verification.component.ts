import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCallService } from '../../service/http-call.service';
import { AppSettings } from "../../config/app.config";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  VerficationCode: any;
  constructor(private route: ActivatedRoute, private toastr: ToastrService, public httpCallService: HttpCallService, private router: Router) {
    this.VerficationCode = this.route.snapshot.params.id || null;
  }

  ngOnInit(): void {
    this.checkVerfication();
  }

  checkVerfication() {

    const data = {
      "toEmail": "",
      "actionType": "AgencyVerification",
      "value": this.VerficationCode
    }  
    
    this.httpCallService.post(AppSettings.verifyOtp, data).subscribe((res: any) => {
      
      if (res.status == 1) {
        this.toastr.success("Agency Verified Successfully");

        setTimeout(() => {
          this.router.navigate(['/login']);          
        }, 5000);        

      }
      else {
        
        this.toastr.error(res.message);
      }
    }, (err) => {
      this.toastr.error(
        err.error.message)
    })
  }

}
