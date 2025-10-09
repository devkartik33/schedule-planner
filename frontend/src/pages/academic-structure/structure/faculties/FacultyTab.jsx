import React, { useState } from "react";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import { columns } from "./columns";
import FacultyModal from "./FacultyModal";

export const FacultyTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleCreate = () => {
    setEditingFaculty(null);
    setIsModalOpen(true);
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
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
        entity="faculty"
        columns={columns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="facultiesTableState"
        searchPlaceholder="Search faculties..."
        addButton={{
          label: "+ Create faculty",
          onClick: handleCreate,
        }}
        onEdit={handleEdit}
        sortFields={[{ label: "ID", value: "id" }]}
        filterSchema={[]}
        onRefresh={handleRefresh}
        refetchTrigger={refetchTrigger}
      />

      <FacultyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        faculty={editingFaculty}
        onSuccess={handleSuccess}
      />
    </>
  );
};
