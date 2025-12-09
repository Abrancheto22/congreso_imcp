export interface Ponente {
  id: string;
  nombre: string;
  titulo: string;
  descripcion: string | null;
  foto_url: string | null;
}

export interface Registro {
  id: string;
  nombre_completo: string;
  iglesia: string;
  genero: string | null;
  departamento: string;
  provincia: string | null;
  ciudad: string | null;
  edad: number | null;
  numero: string;
  estado: string;
  voucher_url: string[] | string | null;
  created_at: string;
}

export interface DatosGenerales {
  id: string;
  nombre_evento: string;
  tema: string | null;
  fecha_evento: string;
  lugar: string;
  slogan: string | null;
  fondo_portada: string | null;
  google_maps_link: string | null;
  iframe_mapa: string | null;
  galeria_imagenes: string[] | null;
}

export interface Pago {
  id: string;
  nombre: string;
  destinatario: string | null;
  numero: string | null;
  foto_url: string | null;
}