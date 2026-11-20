import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, ConsultaMedica } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private http = inject(HttpClient);
  private apiUrlCitas = 'http://localhost:8000/citas/';
  private apiUrlConsultas = 'http://localhost:8000/consultas/';

  // Endpoints Citas
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrlCitas);
  }

  crearCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrlCitas, cita);
  }

  // Endpoints Historial Clínico
  getHistorialByMascota(mascotaId: number): Observable<ConsultaMedica[]> {
    return this.http.get<ConsultaMedica[]>(`${this.apiUrlConsultas}mascota/${mascotaId}/`);
  }

  crearConsulta(consulta: ConsultaMedica): Observable<ConsultaMedica> {
    return this.http.post<ConsultaMedica>(this.apiUrlConsultas, consulta);
  }
}