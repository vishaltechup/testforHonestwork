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
import { viewClassName } from '@angular/compiler';
import { PagerService } from '../../../service/pager.service';
import checkPermissions from "../../../service/user-permission.service";
@Component({
  selector: 'app-project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['./project-notes.component.scss']
})
export class ProjectNotesComponent implements OnInit {

  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  @ViewChild('htmlAddNoteModal') public htmlAddNoteModal: ModalDirective;
  @ViewChild('htmlConvertTaskModal') public htmlConvertTaskModal: ModalDirective;
  @ViewChild('htmlDescriptionModal') public htmlDescriptionModal: ModalDirective;
  public ReplyNoteForm: FormGroup;
  public projectnote: FormGroup;
  public taskForm: FormGroup;

  submitAttempt: boolean = false;
  noteSubmitAttempt: boolean = false;
  taskSubmitAttempt: boolean = false;

  projectId: any;
  agencyId: any;
  userID: any;
  workerID: any;
  noteList = [];
  projectdatail: any;

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  MypageNumber: number;
  Statuslist: any;
  Taglist: any;
  Workerslist: any;
  Milestonelist: any;
  permissions: any;
  noteReplyList: [];
  projectNoteId: any;
  projectNotes: any;
  constructor(private route: ActivatedRoute,
    private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    public PagerService: PagerService) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.workerID = userdata.workerId;

    this.ReplyNoteForm = this.formBuilder.group({
      id: [''],
      reply: ['', Validators.required],
    });

    this.projectnote = this.formBuilder.group({
      note: ['', Validators.required],
    });

    this.taskForm = this.formBuilder.group({
      projectMileStoneId: ['', Validators.required],
      task: ['', Validators.required],
      estimatedHours: ['', Validators.required],
      tagId: ['', Validators.required],
      WorkerId: ['', Validators.required],
      projectNoteId: [0, Validators.required],
      taskDescription: ['', Validators.required]
    });

    this.permissions = checkPermissions(userdata.roleName);

    await Promise.all([this.getnoteList(1)]);

  }

  //For NoteList
  getnoteList(pageNo) {
    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.getNoteList + '?Page=' + pageNo + '&ProjectId=' + this.projectId, null).toPromise().then((res) => {

      //this.sharedService.hideLoading();

      this.MypageNumber = res.data.paginationDetails.currentPage;
      this.pager = this.PagerService.getPager(res.data.paginationDetails.totalCount, this.MypageNumber);
      this.noteList = res.data.resultList;

      this.getdrptagdetails();

    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  //for Confirm note details
  ConfirmNoteDetails(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Confirm this note  ?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.ConfirmNoteDetails + '?projectNoteId=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toaster.success("Notes Confirmed Successfully");
          this.getnoteList(1);
        }).catch((err) => {
          this.sharedService.hideLoading();
        });
      }
    })
  }

  //for leave reply()
  ReplayToNoteDetails() {

    this.submitAttempt = true;
    if (this.ReplyNoteForm.valid) {
      var ProjectNoteReply = {
        "projectNoteId": this.ReplyNoteForm.value.id,
        "reply": this.ReplyNoteForm.value.reply
      };
      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.ReplyToNoteDetails, ProjectNoteReply).toPromise().then((res) => {

        this.submitAttempt = false;

        this.ReplyNoteForm.patchValue({
          reply: "",
        });

        this.sharedService.hideLoading();
        // this.htmlAddModal.hide();
        this.toaster.success(res.message);

        this.GetNoteReply(this.projectNoteId);
      }).catch((err) => {
        this.sharedService.hideLoading();
      });
    }
  }

  OpenLeaveReplyPopup(id, note) {
    this.projectNotes = note.notes;
    console.log(note)
    this.ReplyNoteForm.patchValue({
      id: id,
    });
    this.projectNoteId = id;
    this.GetNoteReply(id);
    this.htmlDescriptionModal.show();
  }

  //Get not reply
  GetNoteReply(projectNoteId) {

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.getnotereply + '?projectNoteId=' + projectNoteId, null).toPromise().then((res) => {

      this.sharedService.hideLoading();
      this.noteReplyList = res.dataList;

    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  ////for add notes
  public addNote() {
    this.noteSubmitAttempt = true;

    if (this.projectnote.valid) {
      var noteDetail = {
        "projectId": this.projectId,
        "WorkerId": this.workerID,
        "note": this.projectnote.value.note
      };

      this.sharedService.showLoading();

      this.httpCallService.post(AppSettings.insertnotedetails, noteDetail).toPromise().then((res) => {
        this.sharedService.hideLoading();
        this.noteSubmitAttempt = false;
        this.projectnote.reset();
        this.htmlAddNoteModal.hide();
        this.toaster.success(res.message);
        this.getnoteList(1);
      }).catch((err) => {
      });
    }

  }

  getdrpstatusdetails() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrpstatusdetails + '?agencyId=' + this.agencyId).subscribe((data: any) => {
      // this.sharedService.hideLoading();
      this.Statuslist = data.dataList;
      this.getprojectworkerslist();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getdrptagdetails() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrptagdetails + '?agencyId=' + this.agencyId).subscribe((data: any) => {
      // this.sharedService.hideLoading();
      this.Taglist = data.dataList;
      this.getprojectmilestonelist();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getprojectmilestonelist() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectmilestonelist + '?projectId=' + this.projectId).subscribe((data: any) => {
      //this.sharedService.hideLoading();
      this.Milestonelist = data.dataList;
      this.getdrpstatusdetails();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getprojectworkerslist() {
    // this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectworkerslist + '?projectId=' + this.projectId).subscribe((data: any) => {
      this.sharedService.hideLoading();
      this.Workerslist = data.dataList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  ConvertTask(notes) {
    this.taskForm.patchValue({
      taskDescription: notes?.notes,
      projectNoteId: notes?.id,
    })

    this.htmlConvertTaskModal.show();
  }

  AddProjectTask() {
    this.taskSubmitAttempt = true;
    if (this.taskForm.valid) {

      const formValues = this.taskForm.value;

      var projectTask = {
        "id": 0,
        "projectId": this.projectId,
        "task": formValues.task,
        "estimatedHours": formValues.estimatedHours,
        "statusId": 1,
        "projectMileStoneId": formValues.projectMileStoneId,
        "loginId": this.userID,
        "tagId": formValues.tagId,
        "WorkerId": formValues.WorkerId,
        "taskDescription": formValues.taskDescription
      }

      var data = {
        projectTask: projectTask,
        projectNoteId: formValues.projectNoteId,
      }

      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.ConvetToTaskDetails, data).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.taskSubmitAttempt = false;
        this.taskForm.reset();
        this.htmlConvertTaskModal.hide();
        this.toaster.success("Task Submitted Successfully.");
        this.getnoteList(1);
      },
        (error: any) => {
          this.sharedService.hideLoading();
        });
    }
  }
}

