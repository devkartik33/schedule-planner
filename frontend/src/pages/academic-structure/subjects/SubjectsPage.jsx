import { useState } from "react";
import { columns } from "./columns";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import SubjectModal from "./SubjectModal";
import { useFilterComposer } from "@/components/datatable/toolbar/filters/useFilterComposer";
import { useFacultyFilter } from "@/components/datatable/toolbar/filters/FacultyFilter";
import { useDirectionFilter } from "@/components/datatable/toolbar/filters/DirectionFilter";
import { useAcademicYearFilter } from "@/components/datatable/toolbar/filters/AcademicYearFilter";
import { usePeriodFilter } from "@/components/datatable/toolbar/filters/PeriodFilter";
import { useSemesterFilter } from "@/components/datatable/toolbar/filters/SemesterFilter";

export default function SubjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleCreate = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
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

  // Композируем все фильтры с правильными зависимостями
  const { filterSchema, isLoading, hasError } = useFilterComposer([
    useFacultyFilter,
    useDirectionFilter,
    useAcademicYearFilter,
    usePeriodFilter,
    useSemesterFilter,
  ]);

  return (
    <div className="container mx-auto py-3">
      <DataTableWrapper
        entity="subject"
        pageLabel="Subjects"
        columns={columns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="subjectsTableState"
        searchPlaceholder="Search subjects..."
        addButton={{
          label: "+ Create subject",
          onClick: handleCreate,
        }}
        sortFields={[
          { label: "ID", value: "id" },
          { label: "Name", value: "name" },
        ]}
        filterSchema={filterSchema}
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        refetchTrigger={refetchTrigger}
      />

      <SubjectModal
        isOpen={isModalOpen}
        subject={editingSubject}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
