import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayActivityComponent } from './today-activity.component';

describe('TodayActivityComponent', () => {
  let component: TodayActivityComponent;
  let fixture: ComponentFixture<TodayActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
