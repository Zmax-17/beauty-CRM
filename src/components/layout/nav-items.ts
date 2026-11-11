import {
  LayoutDashboard,
  Users,
  Eye,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  titleKey: string; // key for next-intl
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    titleKey: "nav.home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    titleKey: "nav.clients",
    href: "/clients",
    icon: Users,
  },
  {
    titleKey: "nav.services",
    href: "/services",
    icon: Eye,
  },
  {
    titleKey: "nav.appointments",
    href: "/appointments",
    icon: CalendarDays,
  },
];
