// columns.js

import { actionsColumn } from "@/components/datatable/commonColumns";

export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "surname", header: "Surname" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "user_type",
    header: "Type",
  },
  actionsColumn({ entity: "user", useModal: true }),
];
