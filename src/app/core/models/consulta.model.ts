export interface Cita {
  id?: number;
  mascota_id: number;
  fecha: string; // ISO String or YYYY-MM-DDTHH:mm
  motivo: string;
  estado?: 'pendiente' | 'completada' | 'cancelada';
}

export interface ConsultaMedica {
  id?: number;
  mascota_id: number;
  fecha?: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
}