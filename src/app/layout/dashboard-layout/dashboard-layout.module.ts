import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectTaskComponent } from './project-task/project-task.component';
import { ProjectWorkersComponent } from './project-workers/project-workers.component';
import { ProjectNotesComponent } from './project-notes/project-notes.component';
import { ProjectScopeComponent } from './project-scope/project-scope.component';
import { ProjectDeliverablesComponent } from './project-deliverables/project-deliverables.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { WorkerDetailsComponent } from '../worker-details/worker-details.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TabsComponent } from './tabs/tabs.component';
import { ProjectMilestoneComponent } from './project-milestone/project-milestone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CKEditorModule } from 'ng2-ckeditor';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { ClientComponent } from './client/client.component';
import { InvitedAgencyComponent } from 'src/app/layout/dashboard-layout/invited-agency/invited-agency.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};
export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'details/:id',
        data: {
          title: 'Project Details',
        },
        component: ProjectDetailsComponent
      },
      {
        path: 'tasks/:id',
        data: {
          title: 'Project Task'
        },
        component: ProjectTaskComponent
      },

      {
        path: 'worker/:id',
        data: {
          title: 'Project Workers'
        },
        component: ProjectWorkersComponent
      },
      {
        path: 'note/:id',
        data: {
          title: 'Project Notes'
        },
        component: ProjectNotesComponent
      },
      {
        path: 'scope/:id',
        data: {
          title: 'Project Scope'
        },
        component: ProjectScopeComponent
      },
      {
        path: 'deliverables/:id',
        data: {
          title: 'Project Deliverables'
        },
        component: ProjectDeliverablesComponent
      },
      {
        path: 'payment-history/:id',
        data: {
          title: 'Project History'
        },
        component: PaymentHistoryComponent
      },
      {
        path: 'agency/:id',
        data: {
          title: 'Agency'
        },
        component: InvitedAgencyComponent
      },
      {
        path: 'worker-details/:id',
        data: {
          title: 'Worker Details'
        },
        component: WorkerDetailsComponent
      },
      {
        path: 'Client/:id',
        data: {
          title: 'Client'
        },
        component: ClientComponent
      },
      {
        path: 'milestone/:id',
        data: {
          title: 'Project Milestone'
        },
        component: ProjectMilestoneComponent
      },

    ]
  }
]

@NgModule({
  declarations: [DashboardLayoutComponent, ProjectDetailsComponent,
    ProjectNotesComponent,
    ProjectTaskComponent,
    ProjectScopeComponent,
    ProjectWorkersComponent,
    StatisticsComponent,
    TabsComponent,
    ClientComponent,
    ProjectMilestoneComponent,
    PaymentHistoryComponent,
    ProjectDeliverablesComponent, ChatRoomComponent, InvitedAgencyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    CKEditorModule,
    FormsModule
  ]
})
export class DashboardLayoutModule { }
