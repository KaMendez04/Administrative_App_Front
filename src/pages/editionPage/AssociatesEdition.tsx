import NavbarEditionSection from "../../components/NavbarEditionSection";
import { HeaderBlock } from "../../components/PagesEdition/HeaderBlock";
import { EditableBenefits } from "../../components/PagesEdition/EditableBenefits";
import { EditableRequirements } from "../../components/PagesEdition/EditableRequirements";
import { useAssociatesEdition } from "../../hooks/EditionSection/AssociatesEdition";
import { ActionButtons } from "../../components/ActionButtons";
import { useNavigate } from "@tanstack/react-router";

export default function AssociatesEdition() {
  const {
  loading, 
  savingHeader,       
  savingBenefits,     
  savingRequirements, 
  error, 
  limits, 
  reload,
    // header
    headerTitle, headerDescription, setHeaderTitle, setHeaderDescription,
    resetHeader, saveHeader, canSaveHeader,
    // benefits
    benefits, benefitIndex, setBenefitIndex,
    updateBenefitText, resetCurrentBenefit, saveCurrentBenefit, canSaveBenefit,
    // requirements
    requirements, requirementIndex, setRequirementIndex,
    updateRequirement, addRequirement,
    resetCurrentRequirement, saveRequirements, canSaveReq,
  } = useAssociatesEdition();
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection/>

        <div className="text-center mb-6 ">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Sobre Asociados</h1>
          <p className="text-base text-[#475C1D]">
            Edita cada bloque de información relevante para quienes desean ser asociados.
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
            <div className="mb-6 bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-4 shadow">
              <HeaderBlock
                title={headerTitle}
                desc={headerDescription}
                limits={{ title: limits.title, desc: limits.desc }}
                onTitle={setHeaderTitle}
                onDesc={setHeaderDescription}
                onCancel={resetHeader}
                onSave={saveHeader}
                canSave={canSaveHeader}
                saving={savingHeader}
              />
            </div>

            {/* Beneficios con select + botones locales */}
            <div className="mb-6 bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-4 shadow">
              <EditableBenefits
                items={benefits}
                index={benefitIndex}
                setIndex={setBenefitIndex}
                limits={{ benefitTitle: limits.benefitTitle, benefitDesc: limits.benefitDesc }}
                onChange={updateBenefitText}
                onCancel={resetCurrentBenefit}
                onSave={saveCurrentBenefit}
                canSave={canSaveBenefit}
                saving={savingBenefits}
              />
            </div>

            {/* Requisitos con select, agregar/eliminar + botones locales */}
            <div className="mb-6 bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-4 shadow">
              <EditableRequirements
                items={requirements}
                index={requirementIndex}
                setIndex={setRequirementIndex}
                limits={{ requirement: limits.requirement }}
                onChange={updateRequirement}
                onAdd={addRequirement}
                onCancel={resetCurrentRequirement}
                onSave={saveRequirements}
                canSave={canSaveReq}
                saving={savingRequirements}
              />
            </div>

            <div className="flex justify-end mt-6 ">
            <ActionButtons
                onBack={() => navigate({ to: "/Principal" })}
                showBack={true}
                backText="Regresar"
                showText={true}
              />            
              </div>
          </>
        )}
      </div>
    </div>
  );
}
