import { actionsColumn } from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "faculty",
    header: "Faculty",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.faculty?.name}</Badge>
    ),
  },
  {
    accessorKey: "direction",
    header: "Direction",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.direction?.code}</Badge>
    ),
  },
  {
    header: "Academic Year",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.academic_year?.name ?? ""}</Badge>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => (
      <Badge variant="outline">
        Semester {row.original.semester?.number} -{" "}
        {row.original.semester?.period}
      </Badge>
    ),
  },
  actionsColumn({
    entity: "schedule",
    editUrlBase: "/schedules",
    useModal: false,
  }),
];
