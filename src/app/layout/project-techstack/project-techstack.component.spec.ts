import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTechstackComponent } from './project-techstack.component';

describe('ProjectTechstackComponent', () => {
  let component: ProjectTechstackComponent;
  let fixture: ComponentFixture<ProjectTechstackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTechstackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTechstackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
