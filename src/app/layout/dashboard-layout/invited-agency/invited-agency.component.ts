import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-invited-agency',
  templateUrl: './invited-agency.component.html',
  styleUrls: ['./invited-agency.component.scss']
})
export class InvitedAgencyComponent implements OnInit {
  projectId: any;
  agency: any;
  agencyInvite: FormGroup;
  submitAgency: boolean = false;
  agencyId: any;
  invitAgencyList: any;
  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  ngOnInit(): void {

    const userdata = this.UserManagementService.getCurrentUserData();
    this.agencyId = userdata.agencyId;
    this.agencyInvite = this.formBuilder.group({
      agency: ['', [Validators.required, Validators.email]],
      agencyName: ['', Validators.required]
    })
    this.getInvitedAgencyList();
  }
  submitAgencyInvite() {
    this.submitAgency = true;
    console.log(this.agencyInvite)
    if (this.agencyInvite.valid) {
      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.InviteAgency + '?AgencyName=' + this.agencyInvite.controls.agencyName.value + '&EmailId=' + this.agencyInvite.controls.agency.value + '&projectId=' + Number(this.projectId), null).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.submitAgency = false;
        this.agencyInvite.reset();
        this.toaster.success(data.message);
        this.getInvitedAgencyList();
        // this.GetWorkersActivityList();
      }, (err: any) => {
        this.sharedService.hideLoading();
      })
    }
  }
  getInvitedAgencyList() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.ListOfInviteAgency + '?agecnyId=' + this.agencyId + '&projectId=' + this.projectId).subscribe(res => {
      console.log(res);
      this.invitAgencyList = res.dataList;
      this.sharedService.hideLoading();
    })
  }
  DeleteAgency(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this agency?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.RemoveInviteAgency + '?id=' + id, null).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toaster.success(data.message);
          this.getInvitedAgencyList();

        }, (err: any) => {
          this.sharedService.showLoading();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
}
