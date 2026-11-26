import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/actions/services";
import ServiceForm from "@/components/services/ServiceForm";
import DeleteServiceSection from "@/components/services/DeleteServiceSection";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({
  params,
}: Props) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <ServiceForm
        mode="edit"
        service={service}
      />

      <DeleteServiceSection
        serviceId={service.id}
        serviceName={service.name}
      />
    </div>
  );
}
