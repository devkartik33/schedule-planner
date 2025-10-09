import React, { useState, useEffect } from "react";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import { academicYearColumns } from "./columns";
import { AcademicYearModal } from "./AcademicYearModal";

export const AcademicYearTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Отслеживаем изменения refetchTrigger
  useEffect(() => {
    console.log(
      "🎯 AcademicYearTab: refetchTrigger changed to:",
      refetchTrigger
    );
  }, [refetchTrigger]);

  const handleCreate = () => {
    setEditingYear(null);
    setIsModalOpen(true);
  };

  const handleEdit = (year) => {
    console.log("📝 AcademicYearTab: Opening edit modal", year);
    setEditingYear(year);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("🚪 AcademicYearTab: Closing modal");
    setIsModalOpen(false);
    setEditingYear(null);
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
        entity="academic_year"
        columns={academicYearColumns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "start_date", desc: true }]}
        localStorageKey="academicYearsTableState"
        searchPlaceholder="Search academic years..."
        showSearch={false}
        addButton={{
          label: "+ Create academic year",
          onClick: handleCreate,
        }}
        sortFields={[
          { label: "ID", value: "id" },
          { label: "Name", value: "name" },
          { label: "Start date", value: "start_date" },
          { label: "End date", value: "end_date" },
        ]}
        filterSchema={[]}
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        refetchTrigger={refetchTrigger}
      />

      <AcademicYearModal
        isOpen={isModalOpen}
        academicYear={editingYear}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};
