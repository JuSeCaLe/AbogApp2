import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaintiffForm } from './plaintiff-form';

describe('PlaintiffForm', () => {
  let component: PlaintiffForm;
  let fixture: ComponentFixture<PlaintiffForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaintiffForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaintiffForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
