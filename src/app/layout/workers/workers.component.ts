import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpCallService } from '../../service/http-call.service';
import { SharedService } from '../../service/shared.service';
import Swal from 'sweetalert2';
import { PagerService } from '../../service/pager.service';
import { AppSettings } from 'src/app/config/app.config';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import checkPermissions from "../../service/user-permission.service";

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {

  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;

  public workerForm: FormGroup;
  public workerSearchForm: FormGroup;
  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  pager2: any = {};
  // paged items
  pagedItems: any[];
  MypageNumber: number;
  MypageNumber2: number;
  submitAttempt: boolean = false;
  AgencyID: any;
  permissions: any;
  rolename: string;
  agencyWorkerList = []
  workerList = [];
  freelanceWorkerList = [];


  constructor(private formBuilder: FormBuilder, public sharedService: SharedService, public httpCallService: HttpCallService,
    private pagerService: PagerService, private router: Router, private toastr: ToastrService, private useManagementService: UserManagementService) { }

  ngOnInit(): void {
    const userdata = this.useManagementService.getCurrentUserData();
    this.AgencyID = userdata.agencyId;
    this.workerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      password: [''],
      mobileNo: ['', [Validators.required]],
      workerType: ['', Validators.required,],
      availability: ['', [Validators.required]],
      experience: ['', [Validators.required]],

    });
    this.workerSearchForm = this.formBuilder.group({
      searchName: ['', Validators.required]
    })
    this.getWorkerList(1);
  }

  getWorkerList(pageno) {


    const formValues = this.workerSearchForm.value;
    const searchName = formValues.searchName;
    const callurl = AppSettings.getworkerdetail + '?page=' + pageno + '&searchName=' + searchName + '&agencyId=' + parseInt(this.AgencyID);
    this.sharedService.showLoading();

    this.httpCallService.get(callurl).subscribe((data: any) => {

      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.workerList = data.data.resultList;
      this.getFreelanceWorkerByAgencyID(pageno);

      this.sharedService.hideLoading();

    }, (error: any) => {
      this.sharedService.hideLoading();
    });
  }


  getFreelanceWorkerByAgencyID(pageno) {

    this.sharedService.showLoading();
    const formValues = this.workerSearchForm.value;
    const searchName = formValues.searchName;
    const freelanceURL = AppSettings.getfreelanceworkerdetail + '?page=' + pageno + '&searchName=' + searchName + '&agencyId=' + parseInt(this.AgencyID);
    this.httpCallService.get(freelanceURL).subscribe((data: any) => {

      this.MypageNumber2 = data.data.paginationDetails.currentPage;
      this.pager2 = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber2);
      this.freelanceWorkerList = data.data.resultList;

      this.sharedService.hideLoading();

    }, (error: any) => {
      this.sharedService.hideLoading();
    });
  }


  AddWorker() {

    this.submitAttempt = true;

    if (this.workerForm.valid) {
      const data = {
        "firstName": this.workerForm.value.firstName,
        "agencyId": parseInt(this.AgencyID),
        "lastName": this.workerForm.value.lastName,
        "email": this.workerForm.value.email,
        "mobileNo": this.workerForm.value.mobileNo,
        "workerType": this.workerForm.value.workerType,
        "availability": this.workerForm.value.availability,
        "experience": this.workerForm.value.experience,
      }
      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.insertworkerdetails, data)
        .subscribe((data: any) => {
          this.sharedService.hideLoading();

          if (data.id == "-1" && data.message == "Please enter unique email address.") {
            this.toastr.error(data.message);
            return false;
          }

          this.htmlAddModal.hide();

          this.toastr.success("Worker Added Successfully");
          this.submitAttempt = false;
          this.workerForm.reset();
          this.htmlAddModal.hide();
          this.getWorkerList(1);
        }, (error: any) => {
          this.sharedService.hideLoading();
          this.toastr.error(error)
        });
    }
  }
  openModal() {
    this.submitAttempt = false;
    this.workerForm.reset();
  }

  deleteWorker(workerId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this worker?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deleteWorkerdetails + '?workerId=' + workerId, null).subscribe((data: any) => {
          this.sharedService.hideLoading();

          Swal.fire('Worker Deleted Successfully.');

          this.getWorkerList(1);

        }, (err: any) => {

        })
      }
    })

  }

}