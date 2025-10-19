import type { Row } from "../../models/dashboard/barChartTypes";
import type { ChartData } from "../../models/dashboard/barChartTypes";

export function combineIncomeAndSpendData(
  incomeRows: Row[], 
  spendRows: Row[]
): ChartData[] {
  const departmentMap = new Map<string, { ingresos: number; egresos: number }>();
  
  // Agregar TODOS los ingresos
  incomeRows.forEach(row => {
    const deptName = row.department || row.name || "Sin Departamento";
    const amount = row.total || row.amount || 0;
    
    if (!departmentMap.has(deptName)) {
      departmentMap.set(deptName, { ingresos: 0, egresos: 0 });
    }
    
    departmentMap.get(deptName)!.ingresos += amount;
  });
  
  // Agregar TODOS los egresos
  spendRows.forEach(row => {
    const deptName = row.department || row.name || "Sin Departamento";
    const amount = row.total || row.amount || 0;
    
    if (!departmentMap.has(deptName)) {
      departmentMap.set(deptName, { ingresos: 0, egresos: 0 });
    }
    
    departmentMap.get(deptName)!.egresos += amount;
  });
  
  // Convertir a array y ordenar alfabéticamente
  return Array.from(departmentMap.entries())
    .map(([name, values]) => ({
      name,
      ingresos: values.ingresos,
      egresos: values.egresos
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

