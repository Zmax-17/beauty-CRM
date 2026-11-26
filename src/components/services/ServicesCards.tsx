import { services as servicesTable } from "@/db/schema";
import { ServiceCard } from "./ServiceCard";

type Service = typeof servicesTable.$inferSelect;

export function ServicesCards({
  services,
}: {
  services: Service[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
        />
      ))}
    </div>
  );
}
