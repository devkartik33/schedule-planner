import * as React from "react";
import {
  BookOpen,
  DoorOpen,
  School,
  GalleryVerticalEnd,
  User,
  CalendarDays,
  Users,
  Settings,
  Compass,
  FileText,
  Scale,
  GraduationCap,
  Building2,
  UserCheck,
  Calendar,
} from "lucide-react";

import { NavMain } from "@/components/NavMain";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/NavUser";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Academic Structure",
      icon: GraduationCap,
      items: [
        {
          title: "Academic",
          url: "/academic-management/",
          icon: Calendar,
        },
        {
          title: "Structure",
          url: "/academic-structure/",
          icon: School,
        },
        {
          title: "Subjects",
          url: "/subjects/",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "People Management",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/users/",
          icon: User,
        },
        {
          title: "Groups",
          url: "/groups/",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "Teaching Load",
      icon: Scale,
      items: [
        {
          title: "Contracts",
          url: "/contracts/",
          icon: FileText,
        },
        {
          title: "Workloads",
          url: "/workloads/",
          icon: Scale,
        },
      ],
    },
    {
      title: "Schedule & Resources",
      icon: CalendarDays,
      items: [
        {
          title: "Schedules",
          url: "/schedules/",
          icon: Calendar,
        },
        {
          title: "Classrooms",
          url: "/classrooms/",
          icon: Building2,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Silesian Academy</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
