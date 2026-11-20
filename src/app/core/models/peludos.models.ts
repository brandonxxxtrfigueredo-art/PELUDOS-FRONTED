export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo_electronico: string;
  rol?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Mascota {
  id_mascota?: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  peso?: number;
  id_usuario?: number;
}