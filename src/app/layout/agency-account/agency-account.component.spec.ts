import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAccountComponent } from './agency-account.component';

describe('AgencyAccountComponent', () => {
  let component: AgencyAccountComponent;
  let fixture: ComponentFixture<AgencyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
