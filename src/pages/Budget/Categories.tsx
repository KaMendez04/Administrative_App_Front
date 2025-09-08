import CategoryForm from "../../components/Budget/Categories/CategoryForm";


export default function RegisterCategory() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <CategoryForm
        onSuccess={(created) => {
          console.log("Partida registrada:", created);
          alert("Partida registrada con éxito ");
        }}
        onCancel={() => {
          // Por ejemplo, regresar a la página anterior (debo cambiarlo)
          window.history.back();
        }}
      />
    </div>
  );
}
