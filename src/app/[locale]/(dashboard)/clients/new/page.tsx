import ClientForm from "@/components/clients/ClientForm";

export default async function NewClientPage() {
  return (
    <div className="mx-auto">
      <ClientForm mode="create" />
    </div>
  );
}
