// columns.js

import { actionsColumn } from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "directions_count",
    header: "Directions count",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.directions_count ?? 0} directions
      </Badge>
    ),
  },
  actionsColumn({ entity: "faculty", useModal: true }),
];
