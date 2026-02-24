import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationTypeForm } from './obligation-types-form';

describe('ObligationTypeForm', () => {
  let component: ObligationTypeForm;
  let fixture: ComponentFixture<ObligationTypeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligationTypeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligationTypeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
