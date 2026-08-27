export interface Cliente {
  id: string;
  documento: string;
  nombre: string;
  celular: string;
  correo: string;
}

export interface ClienteFixture {
  cliente: Cliente;
  password: string;
  intentosFallidos: number;
  bloqueadoHasta: string | null;
}
