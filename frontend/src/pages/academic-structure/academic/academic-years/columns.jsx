import {
  selectColumn,
  actionsColumn,
} from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const academicYearColumns = [
  //   selectColumn,
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
        {row.original.is_current && (
          <Badge variant="default" className="text-xs">
            Current
          </Badge>
        )}
      </div>
    ),
  },
  { accessorKey: "start_date", header: "Start Date" },
  { accessorKey: "end_date", header: "End Date" },
  {
    accessorKey: "semesters",
    header: "Semesters",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.semesters?.length || 0} semesters
      </Badge>
    ),
  },
  actionsColumn({
    entity: "academic_year",
    useModal: true,
    displayName: "academic year",
  }),
];
