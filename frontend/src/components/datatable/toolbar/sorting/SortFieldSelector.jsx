import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SortFieldSelector({
  sorting = [],
  setSorting,
  options,
}) {
  const currentField = sorting[0]?.id || "";

  return (
    <Select
      value={currentField}
      onValueChange={(val) => {
        const desc = sorting[0]?.desc || false;
        setSorting([{ id: val, desc }]);
      }}
    >
      <SelectTrigger className="w-36 flex items-center justify-between font-medium">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((field) => (
          <SelectItem key={field.value} value={field.value}>
            {field.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
