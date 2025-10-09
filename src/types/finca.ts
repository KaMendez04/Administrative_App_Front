export interface Hato {
    idHato?: number | null;
    tipoExplotacion?: string | null;
    totalGanado?: number | null;
    razaPredominante?: string | null;
    animales?: Animal[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface Animal {
    idAnimal?: number | null;
    nombre?: string | null;
    edad?: number | null;
    cantidad?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface Forraje {
    idForraje?: number | null;
    tipoForraje?: string | null;
    variedad?: string | null;
    hectareas?: string | null;
    utilizacion?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface FuenteAgua {
    idFuenteAgua?: number | null;
    idFinca?: number | null;
    nombre?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface MetodoRiego {
    idMetodoRiego?: number | null;
    nombre?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface ActividadAgropecuaria {
    idActividad?: number | null;
    idFinca?: number | null;
    nombre?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface InfraestructuraProduccion {
    idInfraestructura?: number | null;
    numeroAparatos?: number | null;
    numeroBebederos?: number | null;
    numeroSaleros?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface TipoCerca {
    idTipoCerca?: number | null;
    viva?: boolean | null;
    electrica?: boolean | null;
    pMuerto?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface FincaTipoCerca {
    id?: number | null;
    idFinca?: number | null;
    idTipoCerca?: number | null;
    tipoCerca?: TipoCerca | null;
  }
  
  export interface Infraestructura {
    idInfraestructura?: number | null;
    nombre?: string | null;
    descripcion?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface FincaInfraestructura {
    id?: number | null;
    idFinca?: number | null;
    idInfraestructura?: number | null;
    infraestructura?: Infraestructura | null;
  }
  
  export interface FincaOtroEquipo {
    idFincaOtroEquipo?: number | null;
    nombreEquipo?: string | null;
    cantidad?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  
  export interface RegistrosProductivos {
    idRegistrosProductivos?: number | null;
    reproductivos?: boolean | null;
    costosProductivos?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }