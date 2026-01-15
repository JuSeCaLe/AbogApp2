import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTypeList } from './process-types-list';

describe('ProcessTypeList', () => {
  let component: ProcessTypeList;
  let fixture: ComponentFixture<ProcessTypeList>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessTypeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
