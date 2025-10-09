import { actionsColumn } from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "students_count",
    header: "Students count",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.students_count || 0} students
      </Badge>
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

  actionsColumn({ entity: "group", useModal: true }),
];
