import React, { useState } from "react";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import { columns } from "./columns";
import DirectionModal from "./DirectionModal";
import { useFilterComposer } from "@/components/datatable/toolbar/filters/useFilterComposer";
import { useFacultyFilter } from "@/components/datatable/toolbar/filters/FacultyFilter";
import { useStudyFormFilter } from "@/components/datatable/toolbar/filters/StudyFormFilter";

export const DirectionTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDirection, setEditingDirection] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { filterSchema, isLoading, hasError } = useFilterComposer([
    useFacultyFilter,
    useStudyFormFilter,
  ]);

  const handleCreate = () => {
    setEditingDirection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (direction) => {
    setEditingDirection(direction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDirection(null);
  };

  const handleSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
    handleModalClose();
  };

  const handleRefresh = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <>
      <DataTableWrapper
        entity="direction"
        columns={columns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="directionsTableState"
        searchPlaceholder="Search directions..."
        addButton={{
          label: "+ Create direction",
          onClick: handleCreate,
        }}
        onEdit={handleEdit}
        sortFields={[{ label: "ID", value: "id" }]}
        filterSchema={filterSchema}
        onRefresh={handleRefresh}
        refetchTrigger={refetchTrigger}
      />

      <DirectionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        direction={editingDirection}
        onSuccess={handleSuccess}
      />
    </>
  );
};
