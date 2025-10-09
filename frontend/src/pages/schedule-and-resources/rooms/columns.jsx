import { actionsColumn } from "@/components/datatable/commonColumns";

export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "number", header: "Number" },
  { accessorKey: "capacity", header: "Capacity" },
  actionsColumn({ entity: "room", useModal: true }),
];
