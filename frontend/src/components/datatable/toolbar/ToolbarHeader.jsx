import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ToolbarHeader({
  searchPlaceholder,
  filters,
  onSearchChange,
  showSearch = true,
  addButton,
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      {showSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={filters.q || ""}
          onChange={(e) => onSearchChange({ ...filters, q: e.target.value })}
          className="max-w-sm"
        />
      )}
      {!showSearch && <div />}
      {addButton &&
        (addButton.to ? (
          <Button asChild>
            <Link to={addButton.to}>{addButton.label}</Link>
          </Button>
        ) : (
          <Button onClick={addButton.onClick}>{addButton.label}</Button>
        ))}
    </div>
  );
}
