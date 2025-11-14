import NavbarEditionSection from "../../components/NavbarEditionSection";
import { HeaderBlock } from "../../components/PagesEdition/HeaderBlock";
import { EditableBenefits } from "../../components/PagesEdition/EditableBenefits";
import { EditableRequirements } from "../../components/PagesEdition/EditableRequirements";
import { useVolunteersEdition } from "../../hooks/EditionSection/VolunteersEdition";
import { ActionButtons } from "../../components/ActionButtons";
import { useNavigate } from "@tanstack/react-router";


export default function VolunteersEdition() {
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
  } = useVolunteersEdition();
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection/>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Sobre Voluntarios</h1>
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
            <div className="mb-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 shadow">
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

            <div className="mb-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 shadow">
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

            <div className="mb-12">
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

            <div className="flex justify-end mt-6">
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
