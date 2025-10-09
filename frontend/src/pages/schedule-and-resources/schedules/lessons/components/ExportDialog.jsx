import { useState, useEffect } from "react";
import { AlertTriangle, Download, FileText, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSchedulePageData } from "@/contexts/SchedulePageContext";
import { useScheduleExport } from "@/hooks/useScheduleExport";

export function ExportDialog({ children }) {
  const {
    schedule,
    hasIssues,
    hasConflicts,
    hasWorkloadIssues,
    totalConflicts,
    totalWarnings,
    scheduleGroups,
    isLoading,
  } = useSchedulePageData();

  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [filename, setFilename] = useState("");
  const [confirmExport, setConfirmExport] = useState(false);

  const { exportSchedule, isExporting } = useScheduleExport();

  // Инициализация при открытии диалога
  useEffect(() => {
    if (open && schedule) {
      // Сброс состояния подтверждения
      setConfirmExport(false);

      // Генерируем имя файла по умолчанию
      const defaultName = `schedule_${schedule.direction?.name}_${schedule.semester?.number}`;
      setFilename(defaultName.replace(/\\s+/g, "_"));

      // По умолчанию выбираем все группы
      setSelectedGroups(scheduleGroups.map((g) => g.id));
    }
  }, [open, schedule, scheduleGroups]);

  const handleGroupToggle = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAll = () => {
    setSelectedGroups(scheduleGroups.map((g) => g.id));
  };

  const handleClearAll = () => {
    setSelectedGroups([]);
  };

  const handleExport = async () => {
    // Если есть проблемы и пользователь еще не подтвердил
    if (hasIssues && !confirmExport) {
      setConfirmExport(true);
      return;
    }

    try {
      await exportSchedule({
        scheduleId: schedule.id,
        format: exportFormat,
        groupIds: selectedGroups.length > 0 ? selectedGroups : null,
        filename: filename.trim() || null,
      });
      setOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const selectedGroupsData = scheduleGroups.filter((g) =>
    selectedGroups.includes(g.id)
  );

  if (isLoading) {
    return (
      <Button disabled>
        <Download className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Schedule</DialogTitle>
          <DialogDescription>
            Export "{schedule?.name}" with customizable options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Предупреждение о проблемах */}
          {hasIssues && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">
                    This schedule has issues that may affect the export:
                  </div>
                  <ul className="text-sm space-y-1">
                    {hasConflicts && (
                      <li>• {totalConflicts} scheduling conflict(s)</li>
                    )}
                    {hasWorkloadIssues && (
                      <li>• {totalWarnings} professor workload issue(s)</li>
                    )}
                  </ul>
                  {!confirmExport && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmExport(true)}
                      >
                        Continue anyway
                      </Button>
                    </div>
                  )}
                  {confirmExport && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      ✓ Export confirmed despite issues
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Имя файла */}
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename without extension"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use auto-generated name
            </p>
          </div>

          {/* Выбор групп */}
          <div className="space-y-3">
            <Label>Groups to include</Label>
            {scheduleGroups.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground border rounded-lg">
                No groups found for this schedule
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {scheduleGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => handleGroupToggle(group.id)}
                      />
                      <Label
                        htmlFor={`group-${group.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {group.name}
                        {group.study_form && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({group.study_form.name})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Быстрые действия */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={selectedGroups.length === scheduleGroups.length}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={selectedGroups.length === 0}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    Selected: {selectedGroupsData.length} of{" "}
                    {scheduleGroups.length} group(s)
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Формат экспорта */}
          <div className="space-y-3">
            <Label>Export format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Excel (.xlsx)</span>
                    <span className="text-xs text-muted-foreground">
                      - Recommended for detailed schedules
                    </span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" disabled />
                <Label htmlFor="pdf" className="cursor-pointer opacity-50">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-red-600" />
                    <span>PDF (.pdf)</span>
                    <span className="text-xs text-muted-foreground">
                      - Coming soon
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Кнопки */}
          <div className="flex justify-between gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={
                isExporting ||
                selectedGroups.length === 0 ||
                (hasIssues && !confirmExport)
              }
            >
              {isExporting ? (
                "Exporting..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {hasIssues && !confirmExport
                    ? "Confirm & Export"
                    : `Export ${exportFormat.toUpperCase()}`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
