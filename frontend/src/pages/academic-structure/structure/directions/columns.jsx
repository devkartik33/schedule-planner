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
      <Badge variant="outline">{row.original.faculty?.name ?? ""}</Badge>
    ),
  },
  {
    accessorKey: "forms",
    header: "Study Forms",
    cell: ({ row }) => {
      return row.original.forms?.map((form) => (
        <Badge variant="outline" className="mx-1">
          {form.form}
        </Badge>
      ));
    },
  },
  actionsColumn({ entity: "direction", useModal: true }),
];
