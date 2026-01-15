import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTypeForm } from './process-types-form';

describe('ProcessTypeForm', () => {
  let component: ProcessTypeForm;
  let fixture: ComponentFixture<ProcessTypeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessTypeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessTypeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
