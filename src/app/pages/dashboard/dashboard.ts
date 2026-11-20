import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MascotaService } from '../../core/services/mascota.service';
import { ConsultaService } from '../../core/services/consulta.service';
import { Mascota } from '../../core/models/mascota.model';
import { Cita, ConsultaMedica } from '../../core/models/consulta.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private consultaService = inject(ConsultaService);
  private router = inject(Router);

  mascotas: Mascota[] = [];
  citas: Cita[] = [];
  cargando = false;

  // Formulario Mascota
  nuevaMascota: Mascota = { nombre: '', especie: '', raza: '', edad: 0, peso: 0 };

  // Formulario Agendar Cita (Guardamos la mascota completa seleccionada para evitar líos de IDs)
  mascotaElegidaParaCita: any = null;
  nuevaCita: Cita = { mascota_id: 0, fecha: '', motivo: '', estado: 'pendiente' };

  // Control de Historial Clínico
  mascotaSeleccionada: Mascota | null = null;
  historialConsultas: ConsultaMedica[] = [];
  nuevaConsulta: ConsultaMedica = { mascota_id: 0, diagnostico: '', tratamiento: '', observaciones: '' };

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarCitas();
  }

  cargarMascotas(): void {
    this.cargando = true;
    this.mascotaService.getMascotas().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
        this.cargando = false;
      }
    });
  }

  cargarCitas(): void {
    this.consultaService.getCitas().subscribe({
      next: (data) => this.citas = data,
      error: (err) => console.error('Error al cargar citas:', err)
    });
  }

  agregarMascota(): void {
    if (!this.nuevaMascota.nombre || !this.nuevaMascota.especie) return;
    this.mascotaService.crearMascota(this.nuevaMascota).subscribe({
      next: (m) => {
        this.mascotas.push(m);
        this.nuevaMascota = { nombre: '', especie: '', raza: '', edad: 0, peso: 0 };
      }
    });
  }

  borrarMascota(id?: number): void {
    if (!id) return;
    this.mascotaService.eliminarMascota(id).subscribe({
      next: () => this.mascotas = this.mascotas.filter(m => m.id !== id)
    });
  }

  agendarCita(): void {
  if (!this.mascotaElegidaParaCita) {
    alert('Por favor selecciona una mascota.');
    return;
  }

  const idMascotaReal = Number(
    this.mascotaElegidaParaCita.id ?? 
    this.mascotaElegidaParaCita.id_mascota ?? 
    1
  );

  if (!this.nuevaCita.fecha || !this.nuevaCita.motivo) {
    alert('Por favor ingresa fecha y motivo.');
    return;
  }

  // Payload exacto según el esquema estricto que exige tu backend en FastAPI
  const citaAEnviar: any = {
    id_mascota: idMascotaReal,
    id_veterinaria: 1,
    id_profesional: 1,
    fecha_hora: this.nuevaCita.fecha,
    motivo: this.nuevaCita.motivo,
    estado: 'pendiente'
  };

  this.consultaService.crearCita(citaAEnviar).subscribe({
    next: (c) => {
      this.citas.push(c);
      this.nuevaCita = { mascota_id: 0, fecha: '', motivo: '', estado: 'pendiente' };
      this.mascotaElegidaParaCita = null;
      alert('¡Cita agendada con éxito!');
    },
    error: (err) => console.error('Error enviando cita a FastAPI:', err)
  });
}
  abrirHistorial(mascota: Mascota): void {
    this.mascotaSeleccionada = mascota;
    const id = mascota.id ?? (mascota as any).id_mascota;
    if (id) {
      this.nuevaConsulta.mascota_id = id;
      this.consultaService.getHistorialByMascota(id).subscribe({
        next: (h) => this.historialConsultas = h,
        error: (err) => console.error('Error al cargar historial:', err)
      });
    }
  }

  cerrarHistorial(): void {
    this.mascotaSeleccionada = null;
    this.historialConsultas = [];
  }

  guardarConsulta(): void {
    if (!this.nuevaConsulta.diagnostico || !this.nuevaConsulta.tratamiento) return;

    this.consultaService.crearConsulta(this.nuevaConsulta).subscribe({
      next: (c) => {
        this.historialConsultas.unshift(c);
        this.nuevaConsulta = {
          mascota_id: this.mascotaSeleccionada?.id || 0,
          diagnostico: '',
          tratamiento: '',
          observaciones: ''
        };
      },
      error: (err) => console.error('Error al registrar consulta:', err)
    });
  }

  getNombreMascota(mascotaId: number): string {
    const m = this.mascotas.find(item => (item.id === mascotaId || (item as any).id_mascota === mascotaId));
    return m ? m.nombre : `Mascota #${mascotaId}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}