
export interface BenefitVM {
    iconName: string;   // nombre del ícono en lucide-react (ej: "Users")
    title: string;
    desc: string;
    order: number;      // orden en el que aparece
  }

  export interface RequirementVM {
    text: string;
    order: number;
  }

  export interface InfoPageVM {
    id: string;                     // id generado por el backend
    headerTitle: string;            // título del encabezado
    headerDescription: string;      // descripción del encabezado
    benefits: BenefitVM[];          // lista de beneficios
    requirements: RequirementVM[];  // lista de requisitos
  }
  

  export interface InfoPageUpdate {
    headerTitle: string;
    headerDescription: string;
    benefits: Array<{
      iconName: string;
      title: string;
      desc: string;
      order?: number;
    }>;
    requirements: Array<{
      text: string;
      order?: number;
    }>;
  }
  