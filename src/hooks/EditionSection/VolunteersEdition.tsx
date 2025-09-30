import { useCallback, useEffect, useMemo, useState } from "react";
import type { InfoPageVM, InfoPageUpdate } from "../../models/editionSection/InfoPageType";
import { fetchVolunteersPage, upsertVolunteersPage } from "../../services/EditionSection/volunteersPageService";

export function useVolunteersEdition() {
  const [server, setServer] = useState<InfoPageVM | null>(null);

  // estado editable
  const [headerTitle, setHeaderTitle] = useState("");
  const [headerDescription, setHeaderDescription] = useState("");
  const [benefits, setBenefits] = useState<Array<{ iconName: string; title: string; desc: string; order: number }>>([]);
  const [requirements, setRequirements] = useState<Array<{ text: string; order: number }>>([]);

  // selección
  const [benefitIndex, setBenefitIndex] = useState(0);
  const [requirementIndex, setRequirementIndex] = useState<number>(-1);

  // ui
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limits = { title: 75, desc: 250, benefitTitle: 60, benefitDesc: 160, requirement: 180 };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchVolunteersPage();
      setServer(d);
      setHeaderTitle(d.headerTitle);
      setHeaderDescription(d.headerDescription);
      setBenefits([...d.benefits].sort((a, b) => a.order - b.order));
      setRequirements([...d.requirements].sort((a, b) => a.order - b.order));
      setBenefitIndex(d.benefits.length ? 0 : -1);
      setRequirementIndex(d.requirements.length ? 0 : -1);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const buildPayload = useCallback((): InfoPageUpdate => ({
    headerTitle,
    headerDescription,
    benefits: benefits.map((b, i) => ({ iconName: b.iconName, title: b.title, desc: b.desc, order: i })),
    requirements: requirements.map((r, i) => ({ text: r.text, order: i })),
  }), [headerTitle, headerDescription, benefits, requirements]);

  const saveAll = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await upsertVolunteersPage(buildPayload());
      setServer(updated);
      setHeaderTitle(updated.headerTitle);
      setHeaderDescription(updated.headerDescription);
      setBenefits([...updated.benefits].sort((a, b) => a.order - b.order));
      setRequirements([...updated.requirements].sort((a, b) => a.order - b.order));
      return updated;
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar");
      throw e;
    } finally {
      setSaving(false);
    }
  }, [buildPayload]);

  // —— Acciones por bloque ——
  // Encabezado
  const resetHeader = () => {
    if (!server) return;
    setHeaderTitle(server.headerTitle);
    setHeaderDescription(server.headerDescription);
  };
  const saveHeader = () => saveAll();

  // Beneficios (solo texto)
  const updateBenefitText = (idx: number, patch: Partial<Pick<typeof benefits[number], "title" | "desc">>) => {
    setBenefits(prev => prev.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };
  const resetCurrentBenefit = () => {
    if (!server || benefitIndex < 0) return;
    const src = [...server.benefits].sort((a, b) => a.order - b.order);
    setBenefits(prev =>
      prev.map((b, i) => (i === benefitIndex ? { ...b, title: src[i]?.title ?? "", desc: src[i]?.desc ?? "" } : b))
    );
  };
  const saveCurrentBenefit = () => saveAll();

  // Requisitos
  const updateRequirement = (idx: number, text: string) => {
    setRequirements(prev => prev.map((r, i) => (i === idx ? { ...r, text } : r)));
  };

  const addRequirement = (text: string) => {
    setRequirements(prev => {
      const next = [...prev, { text, order: prev.length }];
      // seleccionar el recién agregado para poder guardarlo de inmediato
      setRequirementIndex(next.length - 1);
      return next;
    });
  };

  const removeRequirement = (idx: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, order: i })));
    setRequirementIndex(-1);
  };

  const resetCurrentRequirement = () => {
    if (!server || requirementIndex < 0) return;
    const src = [...server.requirements].sort((a, b) => a.order - b.order);
    setRequirements(prev =>
      prev.map((r, i) => (i === requirementIndex ? { ...r, text: src[i]?.text ?? "" } : r))
    );
  };

  const saveRequirements = () => saveAll();

  // Habilitaciones de botones
  const canSaveHeader = useMemo(
    () => headerTitle.trim().length > 0 && headerDescription.trim().length > 0,
    [headerTitle, headerDescription]
  );

  const canSaveBenefit = useMemo(() => {
    if (benefitIndex < 0) return false;
    const b = benefits[benefitIndex];
    return !!b && b.title.trim().length > 0 && b.desc.trim().length > 0;
  }, [benefits, benefitIndex]);

  // ahora valida SOLO el requisito seleccionado (evita que el botón quede deshabilitado)
  const canSaveReq = useMemo(() => {
    if (requirementIndex < 0) return false;
    const r = requirements[requirementIndex];
    return !!r && r.text.trim().length > 0;
  }, [requirements, requirementIndex]);

  return {
    loading, saving, error, limits, reload: load,

    // header
    headerTitle, headerDescription, setHeaderTitle, setHeaderDescription,
    resetHeader, saveHeader, canSaveHeader,

    // benefits
    benefits, benefitIndex, setBenefitIndex,
    updateBenefitText, resetCurrentBenefit, saveCurrentBenefit, canSaveBenefit,

    // requirements
    requirements, requirementIndex, setRequirementIndex,
    updateRequirement, addRequirement, removeRequirement,
    resetCurrentRequirement, saveRequirements, canSaveReq,
  };
}
