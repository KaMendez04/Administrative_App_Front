
export type Category = {
  id: number;
  name: string;
  description?: string;
};


export type Projection = {
  id: number;
  year: number;
  total_amount: string; 
  state: string;        // OPEN | CLOSED 
};

export type BackendCategoryRow = {
  id: number;
  name: string;
  description?: string | null;
  category_amount?: string | null; 
};


export type ProjectionPerCategory = {
  id: number;        
  categoryId: number;
  year: number;
  amount: number;    
};

export type ProjectionRow = {
  category: Category;
  projection?: ProjectionPerCategory | null;
};

export type ProjectionSectionProps = {
  year?: number;
  title?: string;
};
