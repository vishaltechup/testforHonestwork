import { Component, OnInit } from '@angular/core';
import { HttpCallService } from "../../service/http-call.service";
import { AppSettings } from "../../config/app.config";
import { SharedService } from "../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PagerService } from '../../service/pager.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  submitAttempt: boolean = false;
  perosnalTodoList = []
   // pager object
   pager: any = {};
   // paged items
   pagedItems: any[];
   MypageNumber: number;

  public todoForm: FormGroup;
  constructor(private formBuilder: FormBuilder, 
              public sharedService: SharedService,
              public SharedService: SharedService,
              public httpcallService: HttpCallService,
              private toastr: ToastrService, 
              private useManagementService: UserManagementService,
              public PagerService: PagerService,
              
  ) { }

 UserID:any;
  ngOnInit(): void {
    const userdata = this.useManagementService.getCurrentUserData();
    this.UserID = userdata.userId;
    this.todoForm = this.formBuilder.group({
      notes: ['', Validators.required]
    });
    this.getPersonalTodo(1);
  }

  insertpersonaltodo() {
    this.submitAttempt = true;
    if (this.todoForm.valid) {
      const userdata = this.useManagementService.getCurrentUserData();
      const workerId = userdata.workerId;

      const data = {
        "workerId": workerId,
        "notes": this.todoForm.value.notes,
        "completedStatus": false,
      }

      this.SharedService.showLoading();
      this.httpcallService.post(AppSettings.insertpersonaltodo, data).toPromise().then((res) => {
        this.toastr.success("Personal Note Added");
        this.todoForm.reset();
        this.submitAttempt = false;
        this.SharedService.hideLoading();
        this.getPersonalTodo(1);
      }).catch((err) => {
        this.SharedService.hideLoading();
      })
    }
 
  }

  getPersonalTodo(pageno) {
    this.SharedService.showLoading();
    this.httpcallService.get(AppSettings.getPersonalTodo + '?page=' + pageno + '&userId=' + parseInt(this.UserID)).subscribe((data: any) => {
      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.PagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.perosnalTodoList = (data.data.resultList);
     
      this.SharedService.hideLoading();
    }, (error: any) => {
      this.SharedService.hideLoading();
    });
  }

  updatemarkcomplete(Id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Completing this notes ?',
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpcallService.post(AppSettings.updatemarkcomplete + '?id=' + Id, null).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toastr.success("Note Completed Successfully");
          this.getPersonalTodo(1);

        }, (err: any) => {

        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }  

}
