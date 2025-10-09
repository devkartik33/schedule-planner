import { useState } from "react";

import ToolbarHeader from "./ToolbarHeader";
import ToolbarControls from "./ToolbarControls";

export default function DataTableToolbar({
  filters,
  setFilters,
  sorting,
  setSorting,
  searchPlaceholder,
  showSearch = true,
  addButton,
  sortFields,
  filterSchema,
  selectedIds,
  setSelectedIds,
  setRowSelection,
  entity,
  pageLabel, // Добавляем pageLabel
  resetAll, // Используем resetAll из useServerTableQuery
}) {
  const [showDrawer, setShowDrawer] = useState(false);

  if (showSearch) {
    // Если поиск показан - используем старую структуру
    return (
      <div className="space-y-3">
        <ToolbarHeader
          filters={filters}
          onSearchChange={setFilters}
          searchPlaceholder={searchPlaceholder}
          showSearch={showSearch}
          addButton={addButton}
        />
        <ToolbarControls
          filters={filters}
          setFilters={setFilters}
          sorting={sorting}
          setSorting={setSorting}
          sortFields={sortFields}
          filterSchema={filterSchema}
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          onResetFilters={resetAll}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          setRowSelection={setRowSelection}
          entity={entity}
        />
      </div>
    );
  }

  // Если поиск скрыт - кнопка добавления на одной строке с контролами
  return (
    <div className="space-y-3">
      <ToolbarControls
        filters={filters}
        setFilters={setFilters}
        sorting={sorting}
        setSorting={setSorting}
        sortFields={sortFields}
        filterSchema={filterSchema}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        onResetFilters={resetAll}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setRowSelection={setRowSelection}
        entity={entity}
        addButton={addButton}
      />
    </div>
  );
}
