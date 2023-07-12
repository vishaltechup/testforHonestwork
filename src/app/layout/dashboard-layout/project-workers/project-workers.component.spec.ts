import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkersComponent } from './project-workers.component';

describe('ProjectWorkersComponent', () => {
  let component: ProjectWorkersComponent;
  let fixture: ComponentFixture<ProjectWorkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWorkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
