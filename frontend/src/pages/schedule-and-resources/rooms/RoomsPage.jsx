import { useState } from "react";
import { columns } from "./columns";
import DataTableWrapper from "@/components/datatable/DataTableWrapper";
import RoomModal from "./RoomModal";

export default function RoomsPage() {
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-3">
      <DataTableWrapper
        entity="room"
        pageLabel="Classrooms"
        columns={columns}
        defaultFilters={{ q: "" }}
        defaultSorting={[{ id: "id", desc: false }]}
        localStorageKey="roomsTableState"
        searchPlaceholder="Search classrooms..."
        addButton={{
          label: "+ Create classroom",
          onClick: handleCreateRoom,
        }}
        onEdit={handleEditRoom}
        sortFields={[
          { label: "ID", value: "id" },
          { label: "Number", value: "number" },
          { label: "Capacity", value: "capacity" },
        ]}
        filterSchema={[]}
        refetchTrigger={refetchTrigger}
      />

      <RoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        room={editingRoom}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
