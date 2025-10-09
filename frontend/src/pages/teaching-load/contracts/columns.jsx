// columns.jsx for ContractsPage

import { actionsColumn } from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  { accessorKey: "id", header: "ID" },
  {
    header: "Professor",
    cell: ({ row }) =>
      `${row.original.professor?.name} ${row.original.professor?.surname}` ??
      "",
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
  {
    header: "Total contract hours",
    accessorKey: "total_hours",
  },
  {
    header: "Total used hours",
    accessorKey: "total_workload_hours",
  },
  {
    header: "Remaining hours",
    cell: ({ row }) => {
      const total = row.original.total_hours || 0;
      const used = row.original.total_workload_hours || 0;
      const remaining = total - used;
      return remaining >= 0 ? remaining : 0;
    },
  },

  actionsColumn({
    entity: "professor_contract",
    useModal: true,
    displayName: "contract",
  }),
];
