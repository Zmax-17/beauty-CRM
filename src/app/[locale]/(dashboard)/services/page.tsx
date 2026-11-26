import { ServicesPage } from "@/components/services/ServicesPage";
import { getServices } from "@/lib/actions/services";

export default async function Page() {
  const services = await getServices();
  return <ServicesPage services={services} />;
}
