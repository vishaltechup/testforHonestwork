import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedAgencyComponent } from './invited-agency.component';

describe('InvitedAgencyComponent', () => {
  let component: InvitedAgencyComponent;
  let fixture: ComponentFixture<InvitedAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitedAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
