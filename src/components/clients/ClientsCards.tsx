import { clients as clientsTable } from "@/db/schema";
import { ClientCard } from "./ClientCard";

type Client = typeof clientsTable.$inferSelect;

export function ClientsCards({
  clients,
}: {
  clients: Client[];
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-3">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
        />
      ))}
    </div>
  );
}
