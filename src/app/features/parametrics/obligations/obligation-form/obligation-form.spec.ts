import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationForm } from './obligation-form';

describe('ObligationForm', () => {
  let component: ObligationForm;
  let fixture: ComponentFixture<ObligationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
