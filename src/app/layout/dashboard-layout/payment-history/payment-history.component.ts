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
import { PagerService } from 'src/app/service/pager.service';
import * as moment from 'moment';
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  //Modal Called Object
  @ViewChild('paymentHistoryModal') public paymentHistoryModal: ModalDirective;
  //formdeclaration
  public paymentHistoryForm: FormGroup;
  submitAttempt: boolean = false;
  pagedItems: any[];
  MypageNumber: number;
  pager: any = {};
  projectId: any;
  paymentList: any;
  userID: any
  agencyId: any;
  url: any;
  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    public pagerService: PagerService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    this.paymentHistoryForm = this.formBuilder.group({
      id: ['0'],
      amount: ['', Validators.required],
      description: ['', Validators.required],
      paymentDate: ['', Validators.required]
    });
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    await Promise.all([this.getPaymentHistory(1)]);

  }

  getPaymentHistory(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.GetAllPaymentHistory + '?projectId=' + this.projectId + '&agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {    
      this.MypageNumber = data.data.paginationDetails?.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails?.totalCount, this.MypageNumber);
      this.paymentList = data.data.resultList;
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddNewPaymentToProject() {

    this.submitAttempt = true;
    if (this.paymentHistoryForm.valid) {
      var data = {

        "agencyId": this.agencyId,
        "projectId": Number(this.projectId),
        "amount": this.paymentHistoryForm.value.amount,
        "description": this.paymentHistoryForm.value.description,
        "loginId": 0,
        "paymentDate": new Date(this.paymentHistoryForm.value.paymentDate)
      }
      this.sharedService.showLoading();
      if (this.paymentHistoryForm.value.id == 0 || this.paymentHistoryForm.value.id === null) {
        data['id'] = 0;
        this.url = AppSettings.AddPaymentHistory;
      }
      else {
        data['id'] = this.paymentHistoryForm.value.id;
        this.url = AppSettings.UpdatePaymentHistory;
      }
      this.httpCallService.post(this.url, data).subscribe((data: any) => {

        this.submitAttempt = false;
        this.paymentHistoryModal.hide();
        this.sharedService.hideLoading();
        this.toaster.success(data.message);
        this.paymentHistoryForm.reset();
        this.getPaymentHistory(1);
        
      },
        (error: any) => {
          this.sharedService.hideLoading();
        });
    }
  }

  DeletePayment(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this Payment?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.DeletePaymentHistory + '?id=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.getPaymentHistory(1);
          this.toaster.success('Payment History Deleted Successfully');
        }).catch((err) => {
        });
      }
    })
  }
  EditPayment(payment) {
    this.paymentHistoryForm.patchValue({
      id: payment?.id,
      description: payment?.description,
      amount: payment?.amount,
      paymentDate: moment(payment?.paymentDate).format('YYYY-MM-DD')
    });

    this.paymentHistoryModal.show();
  }
  getDate(date) {
    const momentdate = moment(date).format('DD-MM-YYYY');
    return momentdate;
  }
  openModal() {
    this.paymentHistoryForm.reset();
  }
}
