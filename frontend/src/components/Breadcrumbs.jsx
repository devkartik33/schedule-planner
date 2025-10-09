import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const location = useLocation();

  const pathMap = {
    dashboard: "Dashboard",
    users: "Users",
    new: "New",
    edit: "Edit",
    groups: "Groups",
    faculties: "Faculties",
    subjects: "Subjects",
    rooms: "Rooms",
    schedule: "Schedule",
    schedules: "Schedules",
    directions: "Directions",
    contracts: "Contracts",
    workloads: "Workloads",
    "academic-management": "Academic Management",
  };

  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !/^\d+$/.test(segment)); // пропускаем числовые ID

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    const label = pathMap[segment] || segment;

    return (
      <React.Fragment key={href}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={href}>{label}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
