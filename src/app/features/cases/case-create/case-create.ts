import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CaseService } from '../../../core/services/case.service';
import { CatalogService, CatalogItem } from '../../../core/services/catalog.service';
import { PersonService, Person } from '../../../core/services/person.service';
import { Case } from '../../../core/models/case.model';
import { CourtsService } from '../../../core/services/court.service';
import { ProcessTypeService } from '../../../core/services/process-type.service';
import { Court } from '../../../core/models/court.model';
import { ProcessType } from '../../../core/models/process-type.model';
import { PlaintiffsService } from '../../../core/services/plaintiff.service';
import { ObligationTypeService } from '../../../core/services/obligation-type.service';
import { Plaintiff } from '../../../core/models/plaintiff.model';
import { ObligationType } from '../../../core/models/obligation-type.model';

type ObligationItem = { obligationType: string; number: string };

@Component({
  selector: 'app-case-create',
  standalone: false,
  templateUrl: './case-create.html',
  styleUrls: ['./case-create.css']
})
export class CaseCreate implements OnInit {
  caseForm!: FormGroup;
  editingId: number | null = null;

  processTypes: ProcessType[] = [];
  courts: Court[] = [];
  processRoles: CatalogItem[] = [];

  // ya lo tenías, lo dejo por si en otras pantallas lo usan
  persons: Person[] = [];

  // NUEVO: demandantes (bancos) y tipos de obligación (parametrizados)
  plaintiffs: Plaintiff[] = [];
  obligationTypes: ObligationType[] = [];

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private catalogService: CatalogService,
    private courtService: CourtsService,
    private processTypeService: ProcessTypeService,
    private plaintiffTypeService: PlaintiffsService,
    private obligationTypeService: ObligationTypeService,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildForm();

    // Catálogos existentes
    this.processTypeService.getProcessTypes().subscribe(r => this.processTypes = r);
    this.courtService.getCourts().subscribe(r => this.courts = r);
    this.catalogService.getProcessRoles().subscribe(r => this.processRoles = r);

    // Personas existentes (lo dejamos, aunque el MVP no lo requiere)
    this.personService.getPersons().subscribe(r => this.persons = r);

    // Catálogos nuevos (deben existir en CatalogService; si no, te digo abajo cómo agregarlos)
    this.plaintiffTypeService.getPlaintiffs().subscribe(r => this.plaintiffs = r);
    this.obligationTypeService.getObligationTypes().subscribe(r => this.obligationTypes = r);

    // Default: al menos 1 obligación
    if (this.obligationsItemsArray.length === 0) this.addObligationItem();

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
        city: ['', Validators.required],
        filedAt: [null, Validators.required],
        observations: ['']
      }),

      // MVP: demandante/demandado (sin romper partiesInfo existente)
      partiesInfo: this.fb.group({
        plaintiffId: [null, Validators.required],
        defendantName: ['', [Validators.required, Validators.minLength(3)]],
        defendantDocument: ['', [Validators.required, Validators.minLength(5)]],
        parties: this.fb.array([])
      }),

      financialInfo: this.fb.group({
        capital: [0, [Validators.required, Validators.min(0)]],
        obligations: [''],
        obligationsItems: this.fb.array([]),
        fngFag: [false]
      }),

      // se quedan (no estorban y el servicio de alertas usa estas fechas)
      measures: this.fb.group({
        embargo: [false],
        embargoDate: [null],
        remanentEmbargo: [false],
        remanentEntity: ['']
      }),
      stages: this.fb.group({
        paymentOrder: [false],
        personalNotification: [false],
        firstInstanceDate: [null],
        secondInstanceDate: [null]
      }),
      auction: this.fb.group({
        appraisalStatus: ['N/A'],
        auctionStatus: ['N/A'],
        auctionDate: [null],
        awardDate: [null]
      }),
      closure: this.fb.group({
        terminationDate: [''],
        terminationReason: [''],
        deliveryDate: ['']
      })
    });
  }

  // ---------- Parties (compatibilidad) ----------
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

  // ---------- Obligaciones MVP ----------
  get obligationsItemsArray(): FormArray {
    return this.caseForm.get('financialInfo.obligationsItems') as FormArray;
  }

  addObligationItem(o?: Partial<ObligationItem>) {
    this.obligationsItemsArray.push(
      this.fb.group({
        obligationType: [o?.obligationType ?? null, Validators.required],
        number: [o?.number ?? '', [Validators.required, Validators.minLength(2)]]
      })
    );
  }

  removeObligationItem(i: number) {
    if (this.obligationsItemsArray.length <= 1) return;
    this.obligationsItemsArray.removeAt(i);
  }

  // ---------- Load ----------
  loadCase(c: Case) {
    // process (incluye filedAt/observations si existen; no rompe si no)
    this.caseForm.get('process')?.patchValue(c.process as any);

    // ✅ convertir filedAt a Date para el datepicker
    const filedAt = (c.process as any)?.filedAt;
    this.caseForm.get('process.filedAt')?.setValue(this.toDate(filedAt));

    this.caseForm.get('measures.embargoDate')?.setValue(this.toDate((c.measures as any)?.embargoDate));
    // this.caseForm.get('stages.firstInstanceDate')?.setValue(this.toDate((c.stages as any)?.firstInstanceDate));
    // this.caseForm.get('stages.secondInstanceDate')?.setValue(this.toDate((c.stages as any)?.secondInstanceDate));
    // this.caseForm.get('auction.auctionDate')?.setValue(this.toDate((c.auction as any)?.auctionDate));
    // this.caseForm.get('auction.awardDate')?.setValue(this.toDate((c.auction as any)?.awardDate));
    // this.caseForm.get('closure.deliveryDate')?.setValue(this.toDate((c.closure as any)?.deliveryDate));
    // this.caseForm.get('closure.terminationDate')?.setValue(this.toDate((c.closure as any)?.terminationDate));

    // partiesInfo (si ya guardaste con este MVP)
    const pi: any = c.partiesInfo as any;
    if (pi && typeof pi === 'object' && pi.plaintiffId) {
      this.caseForm.get('partiesInfo')?.patchValue({
        plaintiffId: pi.plaintiffId,
        defendantName: pi.defendantName,
        defendantDocument: pi.defendantDocument
      });
    }

    // si tu modelo anterior usaba partiesInfo como array, lo dejamos también
    if (Array.isArray(c.partiesInfo) && c.partiesInfo.length) {
      // No llenamos partiesArray automáticamente para MVP, pero si quieres, lo puedes hacer:
      // c.partiesInfo.forEach(p => this.addParty(p));
    }

    // financial
    this.caseForm.get('financialInfo')?.patchValue(c.financialInfo as any);

    // obligaciones: si vienes de string, no podemos reconstruir items; si ya hay items, sí
    const fin: any = c.financialInfo as any;
    this.obligationsItemsArray.clear();
    if (fin?.obligationsItems?.length) {
      fin.obligationsItems.forEach((o: ObligationItem) => this.addObligationItem(o));
    } else {
      this.addObligationItem();
    }

    this.caseForm.get('measures')?.patchValue(c.measures as any);
    this.caseForm.get('stages')?.patchValue(c.stages as any);
    this.caseForm.get('auction')?.patchValue(c.auction as any);
    this.caseForm.get('closure')?.patchValue(c.closure as any);
  }

  // ---------- Save ----------
  save() {
    if (this.caseForm.invalid) {
      this.caseForm.markAllAsTouched();
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    const v = this.caseForm.getRawValue();

    // Construye obligations string compatible + mantiene items para editar
    const obligationsItems: ObligationItem[] = (v.financialInfo.obligationsItems ?? []).map((x: any) => ({
      obligationType: String(x.obligationType),
      number: String(x.number).trim()
    }));

    const obligationsText = obligationsItems
      .map(o => {
        const typeName = this.obligationTypes.find(t => t.id === o.obligationType)?.name ?? o.obligationType;
        return `${typeName}: ${o.number}`;
      })
      .join(' | ');

    // Construye partiesInfo compatible sin cambiar tu modelo base:
    // guardamos también una forma "objeto" para el MVP, sin romper si Case acepta any.
    const partiesInfoMvp = {
      plaintiffId: v.partiesInfo.plaintiffId,
      defendantName: String(v.partiesInfo.defendantName).trim(),
      defendantDocument: String(v.partiesInfo.defendantDocument).trim()
    };

    // además construimos array básico por si luego lo necesitas
    const partiesInfoArray = [
      { processRole: 'DEMANDANTE', person: String(v.partiesInfo.plaintiffId) },
      { processRole: 'DEMANDADO', person: `${partiesInfoMvp.defendantName} | ${partiesInfoMvp.defendantDocument}` }
    ];

    const filedAtStr = this.toYmd(v.process.filedAt);
    // // si cambiaste otras fechas:
    // const embargoDateStr = this.toYmd(v.measures.embargoDate);
    // const firstInstanceDateStr = this.toYmd(v.stages.firstInstanceDate);
    // const secondInstanceDateStr = this.toYmd(v.stages.secondInstanceDate);
    // const auctionDateStr = this.toYmd(v.auction.auctionDate);
    // const awardDateStr = this.toYmd(v.auction.awardDate);
    // const deliveryDateStr = this.toYmd(v.closure.deliveryDate);
    // const terminationDateStr = this.toYmd(v.closure.terminationDate);

    const caseToSave: Case = {
      id: this.editingId || 0,

      // process incluye filedAt/observations sin romper el resto
      process: {
        ...v.process,
        filedAt: filedAtStr
      } as any,

      // measures: { ...v.measures, embargoDate: embargoDateStr } as any,
      // stages: { ...v.stages, firstInstanceDate: firstInstanceDateStr, secondInstanceDate: secondInstanceDateStr } as any,
      // auction: { ...v.auction, auctionDate: auctionDateStr, awardDate: awardDateStr } as any,
      // closure: { ...v.closure, deliveryDate: deliveryDateStr, terminationDate: terminationDateStr } as any,

      // guardamos ambas formas; la que compile dependerá de tu Case model.
      // Si tu Case model define partiesInfo como array, usa partiesInfoArray.
      // Si lo define como any u objeto, puedes usar partiesInfoMvp.
      partiesInfo: (partiesInfoArray as any),

      financialInfo: {
        ...v.financialInfo,
        obligations: obligationsText,
        obligationsItems // guardamos items para poder editar
      } as any,

      measures: v.measures as any,
      stages: v.stages as any,
      auction: v.auction as any,
      closure: v.closure as any
    };

    const obs = this.editingId
      ? this.caseService.updateCase(caseToSave)
      : this.caseService.createCase(caseToSave);

    obs.subscribe(() => {
      this.router.navigate(['/cases']);
    });
  }

  cancel() {
    this.router.navigate(['/cases']);
  }

  private toDate(value: any): Date | null {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private toYmd(value: any): string {
    const d = this.toDate(value);
    if (!d) return '';
    // YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
