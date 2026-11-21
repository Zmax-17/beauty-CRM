import { notFound } from "next/navigation";
import { getClientById } from "@/lib/actions/clients";
import ClientForm from "@/components/clients/ClientForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({
  params,
}: Props) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="mx-auto">
      <ClientForm
        mode="edit"
        client={client}
      />
    </div>
  );
}
