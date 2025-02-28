import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGeneralInfoComponent } from './set-general-info.component';

describe('SetGeneralInfoComponent', () => {
  let component: SetGeneralInfoComponent;
  let fixture: ComponentFixture<SetGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetGeneralInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
