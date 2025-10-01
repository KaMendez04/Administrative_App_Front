export function toArray<T>(x: unknown): T[] {
    if (Array.isArray(x)) return x as T[];
    if (x && typeof x === 'object') {
      // Soporta { items: [...] } y diccionarios {id: {...}}
      const maybeItems = (x as any).items;
      if (Array.isArray(maybeItems)) return maybeItems as T[];
      // Si es diccionario plano, lo convertimos a array
      const values = Object.values(x as Record<string, unknown>);
      // Heurística: si todos parecen objetos con id/name, lo tomamos
      if (values.length && values.every(v => v && typeof v === 'object')) {
        return values as T[];
      }
    }
    return [];
  }
  