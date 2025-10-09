import { Drawer } from "@/components/ui/drawer";

export default function MoreFiltersDrawer({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose}>
      <div className="p-4 text-sm text-muted-foreground">
        More filters coming soon...
      </div>
    </Drawer>
  );
}
