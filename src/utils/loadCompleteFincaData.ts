import apiConfig from "../apiConfig/apiConfig";

export const loadCompleteFincaData = async (idFinca: number) => {
  try {
    const [
      hato,
      forrajes,
      fuentesAgua,
      metodosRiego,
      actividades,
      infraestructura,
      tiposCerca,
      infraestructuras,
      otrosEquipos,
      registrosProductivos,
      accesos,
      canales,
    ] = await Promise.all([
      apiConfig.get(`/hatos/finca/${idFinca}`).then(r => r.data).catch(() => null),
      apiConfig.get(`/forraje/finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/fuentes-agua/by-finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/metodos-riego/finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/actividades-agropecuarias/by-finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/infraestructura-produccion/finca/${idFinca}`).then(r => r.data).catch(() => null),
      apiConfig.get(`/finca-tipo-cerca/by-finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/finca-infraestructuras/by-finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/finca-otro-equipo/finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/registros-productivos/finca/${idFinca}`).then(r => r.data).catch(() => null),
      apiConfig.get(`/accesos/finca/${idFinca}`).then(r => r.data).catch(() => []),
      apiConfig.get(`/canales-comercializacion/by-finca/${idFinca}`).then(r => r.data).catch(() => []),
    ]);

    return {
      hato,
      forrajes,
      fuentesAgua,
      metodosRiego,
      actividades,
      infraestructura,
      tiposCerca,
      infraestructuras,
      otrosEquipos,
      registrosProductivos,
      accesos,
      canales,
    };
  } catch (error) {
    console.error(`Error cargando data de finca ${idFinca}:`, error);
    return null;
  }
};