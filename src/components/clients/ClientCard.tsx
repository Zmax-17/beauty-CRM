import { Link } from "@/i18n/navigation";
import {
  ChevronRight,
  Phone,
  UserRound,
} from "lucide-react";
import type { clients } from "@/db/schema";

type Client = typeof clients.$inferSelect;

export function ClientCard({ client }: { client: Client }) {
  return (
    <Link
      href={`/clients/${client.id}`}
      className="group flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-olive/40 active:bg-secondary/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-olive">
            <UserRound className="size-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate font-medium text-card-foreground">
              {client.name}
            </h3>

            <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="size-3.5 shrink-0" />
              <span className="truncate">
                {client.phone || "—"}
              </span>
            </div>
          </div>
        </div>

        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-olive" />
      </div>

      {client.notes?.trim() && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="line-clamp-2 wrap-break-words text-xs leading-relaxed text-muted-foreground">
            {client.notes}
          </p>
        </div>
      )}
    </Link>
  );
}
