import OperationForm from "@/components/forms/operation-form";

function Create() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="heading-primary text-center mb-8">
        Créer une nouvelle opération
      </h1>
      <div className="max-w-xl mx-auto card-modern p-8">
        <OperationForm />
      </div>
    </div>
  );
}

export default Create;