import { actionsColumn } from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "professor",
    header: "Professor",
    cell: ({ row }) =>
      `${row.original.professor?.name} ${row.original.professor?.surname}`,
  },
  {
    accessorKey: "faculty",
    header: "Faculty",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.faculty?.name ?? ""}</Badge>
    ),
  },
  {
    header: "Direction and study form",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.direction?.code} - {row.original.study_form?.form}
      </Badge>
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
  { accessorKey: "assigned_hours", header: "Assigned Hours" },
  { accessorKey: "total_assignment_hours", header: "Total used hours" },
  { accessorKey: "remaining_hours", header: "Remaining hours" },
  actionsColumn({
    entity: "professor_workload",
    editUrlBase: "/workloads",
    useModal: false,
    displayName: "workload",
  }),
];
