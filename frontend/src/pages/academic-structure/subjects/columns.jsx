import { actionsColumn } from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
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
    accessorKey: "academic_year",
    header: "Academic Year",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.academic_year?.name}</Badge>
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
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div
        className="w-5 h-5 rounded-sm"
        style={{ backgroundColor: row.original.color }}
      ></div>
    ),
  },
  actionsColumn({ entity: "subject", useModal: true }),
];
