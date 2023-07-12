import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeliverablesComponent } from './project-deliverables.component';

describe('ProjectDeliverablesComponent', () => {
  let component: ProjectDeliverablesComponent;
  let fixture: ComponentFixture<ProjectDeliverablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDeliverablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDeliverablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
