import { useState } from "react";
import { columns } from "./columns";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import { useFilterComposer } from "@/components/datatable/toolbar/filters/useFilterComposer";
import {
  useFacultyFilter,
  useDirectionFilter,
  useStudyFormFilter,
  useAcademicYearFilter,
  usePeriodFilter,
  useSemesterFilter,
} from "@/components/datatable/toolbar/filters";
import GroupModal from "./GroupModal";

export default function GroupsPage() {
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const { filterSchema, isLoading, hasError } = useFilterComposer([
    useFacultyFilter, // Независимый
    useDirectionFilter, // Зависит от Faculty
    useStudyFormFilter, // Независимый (статический)
    useAcademicYearFilter, // Независимый
    usePeriodFilter, // Зависит от Academic Year (статический)
    useSemesterFilter, // Зависит от Academic Year + Period
  ]);

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-3">
      <DataTableWrapper
        entity="group"
        pageLabel="Groups"
        columns={columns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="groupsTableState"
        searchPlaceholder="Search groups..."
        addButton={{
          label: "+ Create group",
          onClick: handleCreateGroup,
        }}
        onEdit={handleEditGroup}
        sortFields={[
          { label: "ID", value: "id" },
          { label: "Name", value: "name" },
        ]}
        filterSchema={filterSchema}
        refetchTrigger={refetchTrigger}
      />

      <GroupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        group={editingGroup}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
