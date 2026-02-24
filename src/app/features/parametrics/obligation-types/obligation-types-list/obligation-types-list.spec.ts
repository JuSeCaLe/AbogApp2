import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationTypeList } from './obligation-types-list';

describe('ObligationTypeList', () => {
  let component: ObligationTypeList;
  let fixture: ComponentFixture<ObligationTypeList>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligationTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligationTypeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
