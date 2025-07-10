import { Usuario } from "src/app/servicios/auth/models/usuario.model";

export interface HorarioEstupido {
  id?: string;
  fechaCreacion?: string;
  horarioJson?: string;
  usuario?: Usuario;
  descripcion?: string;
}

export interface Horario {
  id: string; // UUID
  profesor: string; // Nombre completo del profesor
  aula: string; // Aula o laboratorio
  grupo: string; // Grupo o paralelo (ej. GR1CC, GR2SW)
  materia: string; // Nombre de la materia
  dia: string; // Día de la semana (Lunes, Martes, etc.)
  hora_inicio: string; // Hora de inicio (formato HH:mm:ss)
  hora_fin: string; // Hora de fin (formato HH:mm:ss)
  semestre: string; // Nombre del semestre (ej. 2024-A, 2025-B)
}
