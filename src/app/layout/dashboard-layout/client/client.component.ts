import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  //Modal Called Object
  @ViewChild('htmlClientEmailModal') public htmlClientEmailModal: ModalDirective;
  //formdeclaration
  public ClientEmailForm: FormGroup;
  submitAttempt: boolean = false;

  projectId: any;
  ClientList: any;
 
  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {
    
    this.ClientEmailForm = this.formBuilder.group({
      email: ['', Validators.required],
    });

    await Promise.all([this.getclientdetails()]);

  }

  getclientdetails() {
    
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getclientbyproject + '?projectId=' + this.projectId).subscribe((data: any) => {
      this.sharedService.hideLoading();
      this.ClientList = data.dataList;
     
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddNewClientToProject() {
    
    this.submitAttempt = true;
    if (this.ClientEmailForm.valid) {
      var data = {
        "projectId": this.projectId,
        "inviteClient": this.ClientEmailForm.value.email
      }
      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.insertprojectclient, data).subscribe((data: any) => {
       
        this.submitAttempt = false;
        this.htmlClientEmailModal.hide();
        this.sharedService.hideLoading();
        this.toaster.success('Client Added Successfully');
        this.ClientEmailForm.reset();
        this.getclientdetails();
      },
        (error: any) => {
          this.submitAttempt = false;
          this.sharedService.hideLoading();
          this.toaster.success('Client Added Successfully');
          this.ClientEmailForm.reset();
          this.htmlClientEmailModal.hide();
          this.getclientdetails();
         // this.toaster.error(error)
        });
    }
  }

  DeleteClient(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this client?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deleteprojectclient + '?Id=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.getclientdetails();
          this.toaster.success('Client Deleted Successfully');
        }).catch((err) => {
        });
      }
    })
  }

}
