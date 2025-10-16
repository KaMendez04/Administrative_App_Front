import NavbarEditionSection from "../../components/NavbarEditionSection";
import BackButton from "../../components/PagesEdition/BackButton";
import { HeaderBlock } from "../../components/PagesEdition/HeaderBlock";
import { EditableBenefits } from "../../components/PagesEdition/EditableBenefits";
import { EditableRequirements } from "../../components/PagesEdition/EditableRequirements";
import { useAssociatesEdition } from "../../hooks/EditionSection/AssociatesEdition";

export default function AssociatesEdition() {
  const {
    loading, saving, error, limits, reload,
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
  } = useAssociatesEdition();

  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B]">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection/>

        <div className="text-center mb-12 ">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Sobre Asociados</h1>
          <p className="text-base text-[#475C1D]">
            Edita cada bloque y guarda desde sus propios botones.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">Cargando…</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">
            Error: {error}
            <div className="mt-4">
              <button onClick={reload} className="px-4 py-2 rounded-md border">Reintentar</button>
            </div>
          </div>
        ) : (
          <>
            {/* Encabezado con botones locales */}
            <div className="mb-12 bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-8 shadow">
              <HeaderBlock
                title={headerTitle}
                desc={headerDescription}
                limits={{ title: limits.title, desc: limits.desc }}
                onTitle={setHeaderTitle}
                onDesc={setHeaderDescription}
                onCancel={resetHeader}
                onSave={saveHeader}
                canSave={canSaveHeader}
                saving={saving}
              />
            </div>

            {/* Beneficios con select + botones locales */}
            <div className="mb-12 bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-8 shadow">
              <EditableBenefits
                items={benefits}
                index={benefitIndex}
                setIndex={setBenefitIndex}
                limits={{ benefitTitle: limits.benefitTitle, benefitDesc: limits.benefitDesc }}
                onChange={updateBenefitText}
                onCancel={resetCurrentBenefit}
                onSave={saveCurrentBenefit}
                canSave={canSaveBenefit}
                saving={saving}
              />
            </div>

            {/* Requisitos con select, agregar/eliminar + botones locales */}
            <div className="mb-12 bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-8 shadow">
              <EditableRequirements
                items={requirements}
                index={requirementIndex}
                setIndex={setRequirementIndex}
                limits={{ requirement: limits.requirement }}
                onChange={updateRequirement}
                onAdd={addRequirement}
                onRemove={removeRequirement}
                onCancel={resetCurrentRequirement}
                onSave={saveRequirements}
                canSave={canSaveReq}
                saving={saving}
              />
            </div>

            <div className="flex justify-end mt-6">
              <BackButton label="Regresar" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
