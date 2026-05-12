import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseEdit } from './case-edit';

describe('CaseEdit', () => {
  let component: CaseEdit;
  let fixture: ComponentFixture<CaseEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
