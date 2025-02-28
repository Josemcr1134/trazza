import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetKycComponent } from './set-kyc.component';

describe('SetKycComponent', () => {
  let component: SetKycComponent;
  let fixture: ComponentFixture<SetKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetKycComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
