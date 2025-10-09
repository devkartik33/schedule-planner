import { useState } from "react";
import { columns } from "./columns";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import ScheduleModal from "./ScheduleModal";

export default function SchedulesPage() {
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSchedule = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-3">
      <DataTableWrapper
        entity="schedule"
        pageLabel="Schedules"
        columns={columns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="schedulesTableState"
        searchPlaceholder={"Search schedules..."}
        addButton={{
          label: "+ Create schedule",
          onClick: handleCreateSchedule,
        }}
        sortFields={[
          { label: "ID", value: "id" },
          { label: "Name", value: "name" },
        ]}
        filterSchema={[]}
        refetchTrigger={refetchTrigger}
      />

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
