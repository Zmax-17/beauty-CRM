import { notFound } from "next/navigation";
import { getClientById } from "@/lib/actions/clients";
import { ClientDetail } from "@/components/clients/ClientDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({
  params,
}: Props) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return <ClientDetail client={client} />;
}
