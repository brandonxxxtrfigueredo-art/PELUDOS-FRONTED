export interface Mascota {
  id?: number;
  id_mascota?: number; // Agregar en caso de que FastAPI use esta convención
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
}