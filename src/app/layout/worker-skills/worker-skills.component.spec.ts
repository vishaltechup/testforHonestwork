import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerSkillsComponent } from './worker-skills.component';

describe('WorkerSkillsComponent', () => {
  let component: WorkerSkillsComponent;
  let fixture: ComponentFixture<WorkerSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
