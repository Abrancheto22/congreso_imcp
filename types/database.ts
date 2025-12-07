export interface Ponente {
  id: string;
  nombre: string;
  titulo: string;
  foto_url: string | null;
}

export interface Registro {
  id: string;
  nombre_completo: string;
  iglesia: string;
  departamento: string;
  edad: number | null;
  numero: string;
  created_at: string;
}

export interface DatosGenerales {
  id: string;
  nombre_evento: string;
  fecha_evento: string;
  lugar: string;
  slogan: string | null;
  fondo_portada: string | null;
  google_maps_link: string | null;
  iframe_mapa: string | null;
}

export interface Pago {
  id: string;
  nombre: string;
  destinatario: string | null;
  numero: string | null;
  foto_url: string | null;
}