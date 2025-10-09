import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SortOrderSelector({
  sorting = [],
  setSorting,
  defaultField = "id", // новый пропс с дефолтным полем
}) {
  const currentField = sorting[0]?.id || defaultField;

  return (
    <Select
      value={sorting[0]?.desc ? "desc" : "asc"}
      onValueChange={(val) => {
        setSorting([{ id: currentField, desc: val === "desc" }]);
      }}
    >
      <SelectTrigger className="w-28 flex items-center justify-between font-medium">
        <SelectValue placeholder="Order" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Asc</SelectItem>
        <SelectItem value="desc">Desc</SelectItem>
      </SelectContent>
    </Select>
  );
}
