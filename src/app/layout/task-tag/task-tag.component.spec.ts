import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTagComponent } from './task-tag.component';

describe('TaskTagComponent', () => {
  let component: TaskTagComponent;
  let fixture: ComponentFixture<TaskTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
