import React, { useState } from "react";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import { semesterColumns } from "./columns";
import { SemesterModal } from "./SemesterModal";
import { useFilterComposer } from "@/components/datatable/toolbar/filters/useFilterComposer";
import { useAcademicYearFilter } from "@/components/datatable/toolbar/filters/AcademicYearFilter";
import { usePeriodFilter } from "@/components/datatable/toolbar/filters/PeriodFilter";

export const SemesterTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Композируем независимые фильтры для семестров
  const { filterSchema, isLoading, hasError } = useFilterComposer([
    useAcademicYearFilter, // независимый
    usePeriodFilter, // независимый (статические опции)
  ]);

  const handleCreate = () => {
    setEditingSemester(null);
    setIsModalOpen(true);
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSemester(null);
  };

  const handleSuccess = () => {
    // Триггерим обновление таблицы
    setRefetchTrigger((prev) => prev + 1);
    handleModalClose();
  };

  const handleRefresh = () => {
    // Функция для обновления таблицы
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <>
      <DataTableWrapper
        entity="semester"
        columns={semesterColumns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="semestersTableState"
        searchPlaceholder="Search semesters..."
        showSearch={false}
        addButton={{
          label: "+ Create semester",
          onClick: handleCreate,
        }}
        sortFields={[
          { label: "ID", value: "id" },
          { label: "Number", value: "number" },
          { label: "Start date", value: "start_date" },
          { label: "End date", value: "end_date" },
        ]}
        filterSchema={filterSchema}
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        refetchTrigger={refetchTrigger}
      />

      <SemesterModal
        isOpen={isModalOpen}
        semester={editingSemester}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};
