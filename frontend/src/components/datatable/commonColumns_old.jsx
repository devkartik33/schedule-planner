// components/datatable/commonColumns.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { useAuth } from "@/hooks/useAuth";

import { useQueryClient } from "@tanstack/react-query";

export const selectColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

// Компонент для ячеек действий
function ActionsCell({ row, onEdit, onDelete, onRefresh, entity, editUrlBase, useModal, displayName }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const itemId = row.original.id;
  const { canEditUser, canDeleteUser, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const entityDisplayName = displayName || entity;

  // Логгирование для диагностики
  console.log('ActionsCell:', { 
    entity, 
    isAdmin: isAdmin(), 
    canEditUser: canEditUser(), 
    canDeleteUser: canDeleteUser() 
  });

  // Проверяем разрешения
  const canEdit = entity === "user" ? canEditUser() : true;
  const canDelete = entity === "user" ? canDeleteUser() : true;

  // Если нет разрешений на редактирование и удаление, не показываем колонку
  if (!canEdit && !canDelete) {
    return null;
  }      const deleteMutation = useEntityMutation(entity, "delete");

      const handleEdit = () => {
        if (useModal && onEdit) {
          onEdit(row.original);
        } else {
          navigate(`${editUrlBase}/${itemId}/edit`);
        }
      };

      const handleDelete = () => {
        console.log("🗑️ actionsColumn: Delete clicked", {
          useModal,
          hasOnDelete: !!onDelete,
        });
        if (useModal && onDelete) {
          onDelete(row.original);
          setOpen(false);
        } else {
          deleteMutation.mutate(
            { id: itemId },
            {
              onSuccess: () => {
                console.log(
                  "✅ actionsColumn: Delete success, calling invalidateQueries and onRefresh"
                );
                toast.success(`${entity} deleted`);
                setOpen(false);
                queryClient.invalidateQueries(["entity", entity]);
                // Вызываем дополнительное обновление если передано
                if (onRefresh) {
                  console.log(
                    "🔄 actionsColumn: Calling onRefresh after delete"
                  );
                  onRefresh();
                } else {
                  console.log("⚠️ actionsColumn: No onRefresh provided");
                }
              },
              onError: (err) => {
                console.error("❌ actionsColumn: Delete failed", err);
                toast.error(err.message);
              },
            }
          );
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {canEdit && (
                <>
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className={"cursor-pointer"}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {canDelete && <DropdownMenuSeparator />}
                </>
              )}
              {canDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  className={"cursor-pointer"}
                  onClick={() => setOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {canDelete && (
            <ConfirmDialog
              open={open}
              onConfirm={handleDelete}
              onCancel={() => setOpen(false)}
              message={`Are you sure you want to delete this ${entityDisplayName}?`}
            />
          )}
        </>
      );
    },
  };
}
