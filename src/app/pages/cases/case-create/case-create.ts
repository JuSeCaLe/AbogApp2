import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CaseService } from '../../../services/case.service';
import { Case } from '../../../models/case.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-create',
  standalone: false,
  templateUrl: './case-create.html',
  styleUrls: ['./case-create.css']
})
export class CaseCreate implements OnInit {
  caseForm!: FormGroup;
  editingId: number | null = null;

  processTypes = ['Ordinario', 'Ejecutivo', 'Laboral'];
  courts = ['Juzgado 1', 'Juzgado 2'];
  processRoles = ['Demandante', 'Demandado', 'Avalista'];
  persons = ['Juan', 'Ana', 'Pedro'];

  constructor(private fb: FormBuilder,
              private caseService: CaseService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.buildForm();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editingId = +id;
      this.caseService.getCaseById(this.editingId).subscribe(c => {
        if (c) this.loadCase(c);
      });
    }
  }

  buildForm() {
    this.caseForm = this.fb.group({
      process: this.fb.group({
        radicado: ['', Validators.required],
        processType: [null, Validators.required],
        court: [null, Validators.required],
        city: ['', Validators.required]
      }),
      partiesInfo: this.fb.group({
        parties: this.fb.array([])
      }),
      financialInfo: this.fb.group({
        capital: [0],
        obligations: [''],
        fngFag: [false]
      }),
      measures: this.fb.group({
        embargo: [false],
        embargoDate: [''],
        remanentEmbargo: [false],
        remanentEntity: ['']
      }),
      stages: this.fb.group({
        paymentOrder: [false],
        personalNotification: [false]
      }),
      auction: this.fb.group({
        appraisalStatus: ['N/A'],
        auctionStatus: ['N/A']
      }),
      closure: this.fb.group({
        terminationDate: [''],
        terminationReason: ['']
      })
    });
  }

  get partiesArray(): FormArray {
    return this.caseForm.get('partiesInfo.parties') as FormArray;
  }

  addParty(p?: {person: string, processRole: string}) {
    this.partiesArray.push(
      this.fb.group({
        person: [p?.person || null, Validators.required],
        processRole: [p?.processRole || null, Validators.required]
      })
    );
  }

  removeParty(i: number) {
    this.partiesArray.removeAt(i);
  }

  loadCase(c: Case) {
    this.caseForm.get('process')?.patchValue(c.process);
    if (c.partiesInfo?.length) c.partiesInfo.forEach(p => this.addParty(p));
    this.caseForm.get('financialInfo')?.patchValue(c.financialInfo);
    this.caseForm.get('measures')?.patchValue(c.measures);
    this.caseForm.get('stages')?.patchValue(c.stages);
    this.caseForm.get('auction')?.patchValue(c.auction);
    this.caseForm.get('closure')?.patchValue(c.closure);
  }

  save() {
    if (this.caseForm.invalid) {
      this.caseForm.markAllAsTouched();
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    const formValue = this.caseForm.value;
    const caseToSave: Case = {
      id: this.editingId || 0,
      process: formValue.process,
      partiesInfo: formValue.partiesInfo.parties,
      financialInfo: formValue.financialInfo,
      measures: formValue.measures,
      stages: formValue.stages,
      auction: formValue.auction,
      closure: formValue.closure
    };

    const obs = this.editingId
      ? this.caseService.updateCase(caseToSave)
      : this.caseService.createCase(caseToSave);

    obs.subscribe(() => {
      // Redirige al listado de casos
      this.router.navigate(['/cases']);
    });
  }
}
