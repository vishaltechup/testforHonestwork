import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import checkPermissions from 'src/app/service/user-permission.service';
import Swal from 'sweetalert2';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-project-scope',
  templateUrl: './project-scope.component.html',
  styleUrls: ['./project-scope.component.scss']
})
export class ProjectScopeComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  @ViewChild('fileInput')
  myVar1: any;
  projectId: any;
  userID: any;
  workerId: any;
  agencyId: any;
  permissions: any;

  TechstackList = [];
  selectedItems = [];
  dropdownSettings = {};
  ScopeDocumentList = [];
  scopeDocumentDetailList = [];

  fileToUpload: File;
  url: string;
  submitAttempt: boolean = false;
  projectdatail: any;
  Scopeedit: boolean = false;
  BuildQuoteedit: boolean = false;
  PartnerQuotededit: boolean = false;
  // totalAmountsReceivableedit: boolean = false;
  // totalAmountsOwededit: boolean = false;

  symbol: any;
  
  public projectscopeForm: FormGroup;
  public projectscopeFormDocument: FormGroup;
  public projectscope: FormGroup;

  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit(){
    
    this.symbol = '';
    
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.workerId = userdata.workerId;
    this.agencyId = userdata.agencyId;
    this.Scopeedit = false;
    this.BuildQuoteedit = false;
    this.PartnerQuotededit = false;
    // this.totalAmountsReceivableedit = false;
    // this.totalAmountsOwededit = false;

    this.projectscopeForm = this.formBuilder.group({
      //dFilename: ['', Validators.required],
      Techstack: ['', Validators.required],
    });

    this.projectscopeFormDocument = this.formBuilder.group({
      dFilename: ['', Validators.required],
    });

    this.projectscope = this.formBuilder.group({
      scopeDescription: [''],
      buildQuoteAmount: [''],
      partnerQuotedAmount: [''],
      // totalAmountsReceivable: [0],
      // totalAmountsOwed: [0],
    });

    this.permissions = checkPermissions(userdata.roleName);
    await Promise.all([this.getDropDownTechStack()]);
    
  }

  //Bind Stack Dropdown
  getDropDownTechStack() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrptechstacklist + '?AgencyId=' + this.agencyId).toPromise().then((res) => {
      // this.sharedService.hideLoading();
      this.TechstackList = res.dataList;
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.getprojectscopedocuments();

    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  //get project scope details
  getprojectscopedetails() {
    //this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.GetProjectScopeDetails + '?projectId=' + this.projectId, null).toPromise().then((res) => {
      // this.sharedService.hideLoading();

      this.projectscope.patchValue({
        scopeDescription: res.data.scopeDescription,
        buildQuoteAmount: res.data.buildQuoteAmount,
        partnerQuotedAmount: res.data.partnerQuotedAmount,
        // totalAmountsReceivable: res.data.totalAmountsReceivable,
        // totalAmountsOwed: res.data.totalAmountsOwed
      });

      this.GetProjectStack();

    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  //getprojectscopedocuments
  getprojectscopedocuments() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectscopedocuments + '?projectId=' + this.projectId).toPromise().then((res) => {
      // this.sharedService.hideLoading();
      this.scopeDocumentDetailList = res.dataList;
      this.getprojectscopedetails();

    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  //EditModeDropdown
  GetProjectStack() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrpprojecttechstacklist + '?projectId=' + this.projectId).toPromise().then((res) => {
      this.sharedService.hideLoading();
      this.selectedItems = res.dataList;

    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  ///download file
  downloadFile(url) {
    //const blob = new Blob([data], { type: 'text/csv' });
    //const url= window.URL.createObjectURL(blob);
    //   window.open(url);
    const link:any = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    // link.setAttribute('download','download');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  editprojectscopedetails() {
    this.Scopeedit = true;
  }

  editbuildQuoteAmount() {
    this.BuildQuoteedit = true;
  }

  editPartnerQuoted() {
    this.PartnerQuotededit = true;
  }

  // edittotalAmountsReceivable() {
  //   this.totalAmountsReceivableedit = true;
  // }

  // edittotalAmountsOwed() {
  //   this.totalAmountsOwededit = true;
  // }

  updateprojectscopedetails() {
    {
      this.sharedService.showLoading();
      var projectScopeDetails = {
        "projectID": this.projectId,
        "scopeDescription": this.projectscope.value.scopeDescription,
        "buildQuoteAmount": this.projectscope.value.buildQuoteAmount,
        "partnerQuotedAmount": this.projectscope.value.partnerQuotedAmount,
        // "totalAmountsReceivable": this.projectscope.value.totalAmountsReceivable,
        // "totalAmountsOwed": this.projectscope.value.totalAmountsOwed,
      };
      this.httpCallService.post(AppSettings.updateprojectscopedetails, projectScopeDetails).toPromise().then((res) => {
        this.sharedService.hideLoading();
        this.toaster.success(res.message);
        this.Scopeedit = false;
        this.BuildQuoteedit = false;
        this.PartnerQuotededit = false;
        // this.totalAmountsReceivableedit = false;
        // this.totalAmountsOwededit = false;
      }).catch((err) => {
        this.sharedService.hideLoading();
      });
    }
  }

  //INSERT TECHSTACK
  InsertUpdateTeckStack() {
    const formValues = this.projectscopeForm.value;
    if (this.selectedItems.length > 0) {
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (i == 0) {
          formValues.Techstack = this.selectedItems[i].id;
        }
        else {
          formValues.Techstack += "," + this.selectedItems[i].id;
        }
      }
    }

    else {
      this.toaster.error("Please assign at least one Tech Stack!!!");
      return false;
    }

    var projectTeckStack = {
      "projectId": this.projectId,
      "techStacks": formValues.Techstack
    }

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.insertprojecttexhstack, projectTeckStack).toPromise().then((res) => {
      this.sharedService.hideLoading();
      this.toaster.success(res.message);
      this.GetProjectStack();
    }).catch((err) => {

    });
  }
  
  onItemSelect(item: any) {
   
  }

  onSelectAll(items: any) {
   
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

  uploadscopeDocuemntfile() {

    this.submitAttempt = true;
    if (this.projectscopeFormDocument.valid) {

      if (this.fileToUpload != undefined) {
        this.sharedService.showLoading();
        const formValues = this.projectscopeFormDocument.value;
        this.httpCallService.UploaddeliverableFile(AppSettings.Uploadscopedocumentfile, this.fileToUpload, this.projectId, formValues.dFilename, this.workerId, this.userID).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.submitAttempt = false;
          this.projectscopeFormDocument.reset();
          this.toaster.success("File Uploaded Successfully.");
          this.getprojectscopedocuments();
          this.htmlAddModal.hide();
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

  //removescopedocument
  removeScopeDocumentFile(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this file?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deletescopedocuments + '?scopeDocumentId=' + id, null).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toaster.success("File Removed Successfully")
          this.getprojectscopedocuments();

        }, (err: any) => {

        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })


  }
  openModal(){
    this.submitAttempt = false;
    this.projectscopeFormDocument.reset();
  }
}
