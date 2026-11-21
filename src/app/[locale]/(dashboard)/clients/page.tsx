import { ClientsPage } from "@/components/clients/ClientsPage";
import { getClients } from "@/lib/actions/clients";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const { q } = await searchParams;
  const clients = await getClients(q);

  return (
    <ClientsPage
      clients={clients}
      query={q ?? ""}
    />
  );
}
