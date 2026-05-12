import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStageDialog } from './process-stage-dialog';

describe('ProcessStageDialog', () => {
  let component: ProcessStageDialog;
  let fixture: ComponentFixture<ProcessStageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessStageDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessStageDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
