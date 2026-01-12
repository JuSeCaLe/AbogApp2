import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Person {
  id: number;
  fullName: string;
  document: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  getPersons(): Observable<Person[]> {
    return of([
      { id: 1, fullName: 'Carlos Pérez', document: '12345678' },
      { id: 2, fullName: 'Banco Davivienda', document: '900123456' },
      { id: 3, fullName: 'María Rodríguez', document: '98765432' },
      { id: 4, fullName: 'Juan López', document: '11223344' }
    ]);
  }
}
