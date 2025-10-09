import {
  selectColumn,
  actionsColumn,
} from "@/components/datatable/commonColumns";
import { Badge } from "@/components/ui/badge";

export const semesterColumns = [
  //   selectColumn,
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "academic_year",
    header: "Academic Year",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.academic_year?.name}</span>
        {row.original.academic_year?.is_current && (
          <Badge variant="secondary" className="text-xs">
            Current
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => (
      <Badge variant="outline">Semester {row.original.number}</Badge>
    ),
  },
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.period}</span>
    ),
  },
  { accessorKey: "start_date", header: "Start date" },
  { accessorKey: "end_date", header: "End date" },
  actionsColumn({ entity: "semester", useModal: true }),
];

// Экспортируем старые колонки для обратной совместимости
export const columns = semesterColumns;
