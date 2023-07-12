import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCallService } from "../../service/http-call.service";
import { SharedService } from "../../service/shared.service";
import { AppSettings } from "../../config/app.config";
import { PagerService } from '../../service/pager.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
import checkPermissions from 'src/app/service/user-permission.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { from } from 'rxjs';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-project-techstack',
  templateUrl: './project-techstack.component.html',
  styleUrls: ['./project-techstack.component.scss']
})
export class ProjectTechstackComponent implements OnInit {
  //Modal Called Object
  @ViewChild('htmlModal') public htmlModal: ModalDirective;
  //formdeclaration
  public TechStack: FormGroup;
  submitAttempt: boolean = false;

  techstackList: any;

  pagedItems: any[];
  MypageNumber: number;
  pager: any = {};
  permissions: any;
  userID: any;
  agencyId: any;
  url: any;
  constructor(public sharedService: SharedService, public httpCallService: HttpCallService, private pagerService: PagerService, private router: Router,
    private toastr: ToastrService, private useManagementService: UserManagementService,
    private formBuilder: FormBuilder, public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    const userdata = this.useManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.permissions = checkPermissions(userdata.roleName);
    this.TechStack = this.formBuilder.group({
      name: ['', Validators.required],
      agencyId: ['0'],
      loginId: ['0'],
      id: ['0']

    });
    this.GetTechstackByAgency(1);
  }

  GetTechstackByAgency(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.gettechStackdetail + '?agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {
      this.sharedService.hideLoading();

      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.techstackList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddTaskStatus() {

    this.sharedService.showLoading();
    this.submitAttempt = true;
    if (this.TechStack.valid) {
      var data = {
        "agencyId": this.agencyId,
        "loginId": this.userID,
        "name": this.TechStack.value.name
      }
      if (this.TechStack.value.id == 0 || this.TechStack.value.id === null) {
        data['id'] = 0;
        this.url = AppSettings.inserttechStackdetails;
      }
      else {
        data['id'] = this.TechStack.value.id;
        this.url = AppSettings.updatetechStackdetails;
      }
      this.httpCallService.post(this.url, data).subscribe((data: any) => {

        this.submitAttempt = false;

        if (this.TechStack.value.id == 0 || this.TechStack.value.id === null) {
          this.toastr.success("Project Tech Stack Added Successfully.");
        }
        else if (this.TechStack.value.id > 0) {
          this.toastr.success("Project Tech Stack Updated Successfully.");
        }
        this.TechStack.patchValue({
          name: '',
          id: 0
        });
        this.htmlModal.hide();
        this.GetTechstackByAgency(1);
        //this.sharedService.hideLoading();
      },
        (error: any) => {

        });

    }
  }


  DeleteTechStack(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this Techstack?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.value) {

        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deletedtechStackdetails + '?techStackId=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toastr.success("Project Tech Stack Deleted Successfully.");
          this.GetTechstackByAgency(1);
        }).catch((err) => {
        });
      }
    })
  }

  //editmode skill
  editTechstack(tech) {

    this.TechStack.patchValue({
      agencyId: tech?.agencyId,
      name: tech?.name,
      loginId: tech?.loginId,
      id: tech?.id
    });
    this.htmlModal.show();
  }
  openModal() {
    this.TechStack.reset();
  }
}
