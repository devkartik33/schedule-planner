import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, XIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import SortFieldSelector from "./sorting/SortFieldSelector";
import SortOrderSelector from "./sorting/SortOrderSelector";
import EntityFilter from "./filters/EntityFilter";
import MoreFiltersDrawer from "./MoreFiltersDrawer";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ToolbarControls({
  entity,
  filters,
  setFilters,
  sorting,
  setSorting,
  sortFields,
  filterSchema,
  showDrawer,
  setShowDrawer,
  onResetFilters,
  selectedIds = [],
  refetch,
  setSelectedIds,
  setRowSelection,
  addButton,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const deleteMany = useEntityMutation(entity, "delete_many");
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteMany.mutate(
      { ids: selectedIds },
      {
        onSuccess: () => {
          toast.success(`Deleted ${selectedIds.length} ${entity}(s)`);
          queryClient.invalidateQueries(["entityList", entity]);
          setSelectedIds?.([]);
          setRowSelection?.({});
          setOpenConfirm(false);
        },
        onError: (err) => {
          setOpenConfirm(false);
          toast.error(err.message || "Failed to delete");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Сортировка */}
      {sortFields && sortFields.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">Sorting</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <SortFieldSelector
              sorting={sorting}
              setSorting={setSorting}
              options={sortFields}
            />
            <SortOrderSelector
              sorting={sorting}
              setSorting={setSorting}
              defaultField="id"
            />
          </div>
        </div>
      )}

      {/* Фильтрация */}
      {filterSchema && filterSchema.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Filtering
          </h4>
          <div className="flex flex-wrap gap-4 items-center">
            <EntityFilter
              filters={filters}
              setFilters={setFilters}
              filterSchema={filterSchema}
            />
            <Button
              variant="ghost"
              className="text-red-500"
              onClick={onResetFilters}
            >
              <XIcon className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Действия */}
      <div className="flex gap-2 items-center justify-end">
        {selectedIds.length > 0 && (
          <Button variant="destructive" onClick={() => setOpenConfirm(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete selected
          </Button>
        )}

        {addButton &&
          (addButton.to ? (
            <Button asChild>
              <Link to={addButton.to}>{addButton.label}</Link>
            </Button>
          ) : (
            <Button onClick={addButton.onClick}>{addButton.label}</Button>
          ))}
      </div>

      <ConfirmDialog
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete selected ${entity}s?`}
      />
    </div>
  );
}
