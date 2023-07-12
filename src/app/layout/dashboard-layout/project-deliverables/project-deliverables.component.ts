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
import checkPermissions from 'src/app/service/user-permission.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-project-deliverables',
  templateUrl: './project-deliverables.component.html',
  styleUrls: ['./project-deliverables.component.scss']
})
export class ProjectDeliverablesComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  @ViewChild('fileInput')
  myVar1: any;
  projectId: any;
  userID: any;
  workerId: any;
  permissions: any;
  deliverblesList: any;
  fileToUpload: File;
  url: string;
  submitAttempt: boolean = false;
  projectdatail: any;
  public deliverablesForm: FormGroup;

  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    this.deliverablesForm = this.formBuilder.group({
      dFilename: ['', Validators.required],
    });

    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.workerId = userdata.workerId;

    this.permissions = checkPermissions(userdata.roleName);

    await Promise.all([this.GetAllProjectDeliverables()]);

  }

  GetAllProjectDeliverables() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectdeliverables + '?projectId=' + this.projectId).toPromise().then((res) => {
      this.sharedService.hideLoading();
      res.dataList.map((data) => {
        data['dateTime'] = moment(data['dateTime']).format('yyyy-MM-DD HH:mm:ss');
      })
      this.deliverblesList = res.dataList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  Removedeliverblefile(deliverbleid) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this file?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.removeprojectdeliverables + '?deliverableId=' + deliverbleid, null).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toaster.success('Deliverable Removed Successfully');
          this.GetAllProjectDeliverables();

        }, (err: any) => {
          this.sharedService.showLoading();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  confirmdeliverblefile(deliverbleid) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to confirm this file?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.confirmprojectdeliverable + '?deliverableId=' + deliverbleid, null).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toaster.success('Deliverable Confirmed Successfully');
          this.GetAllProjectDeliverables();

        }, (err: any) => {
          this.sharedService.showLoading();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })

  }

  readUrl(event: any) {
    var Size = event.target.files.item(0);
    if (Size.size <= 20000000) {
      this.fileToUpload = event.target.files.item(0);
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
          this.url = (<FileReader>event.target).result.toString();
        }
        reader.readAsDataURL(event.target.files[0]);
      }
    }
    else {
      this.myVar1.nativeElement.value = '';
      this.toaster.error('Image size must be less than or equal to 20 MB.', 'Error');
    }
  }

  uploaddeliverblefile() {
    this.submitAttempt = true;

    if (this.deliverablesForm.valid) {
      if (this.fileToUpload != undefined) {
        this.sharedService.showLoading();
        const formValues = this.deliverablesForm.value;
        this.httpCallService.UploaddeliverableFile(AppSettings.Uploaddeliverablefile, this.fileToUpload, this.projectId, formValues.dFilename, this.workerId, this.userID).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.submitAttempt = false;
          this.deliverablesForm.reset();
          this.toaster.success("Deliverable Added Successfully.");
          this.htmlAddModal.hide();
          this.GetAllProjectDeliverables();
          this.myVar1.nativeElement.value = '';
        },
          (error: any) => {
            this.sharedService.hideLoading();
          });
      }
      else {
        this.toaster.error("Please Upload File.");
      }

    }

  }
  openModal() {
    this.submitAttempt = false;
    this.deliverablesForm.reset();
  }
}
