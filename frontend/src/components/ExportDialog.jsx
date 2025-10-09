import { useState, useEffect } from "react";
import { AlertTriangle, Download, FileText, X } from "lucide-react";
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
    hasConflicts,
    totalConflicts,
    hasWorkloadIssues,
    totalWarnings,
    groupsInvolved,
    isLoading,
  } = useSchedulePageData();

  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [filename, setFilename] = useState("");
  const [confirmExport, setConfirmExport] = useState(false);

  const { exportSchedule, isExporting } = useScheduleExport();

  // Инициализация выбранных групп и имени файла
  useEffect(() => {
    if (groupsInvolved.length > 0 && selectedGroups.length === 0) {
      setSelectedGroups(groupsInvolved.map((g) => g.id));
    }
  }, [groupsInvolved]);

  useEffect(() => {
    if (schedule && !filename) {
      const defaultName = `schedule_${schedule.direction?.name}_${schedule.semester?.number}`;
      setFilename(defaultName.replace(/[^a-zA-Z0-9_-]/g, "_"));
    }
  }, [schedule]);

  const handleGroupToggle = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAll = () => {
    setSelectedGroups(groupsInvolved.map((g) => g.id));
  };

  const handleClearAll = () => {
    setSelectedGroups([]);
  };

  const hasIssues = hasConflicts || hasWorkloadIssues;
  const totalIssues = totalConflicts + totalWarnings;

  const handleExport = async () => {
    if (hasIssues && !confirmExport) {
      setConfirmExport(true);
      return;
    }

    try {
      await exportSchedule({
        scheduleId: schedule.id,
        format: exportFormat,
        groupIds:
          selectedGroups.length === groupsInvolved.length
            ? null
            : selectedGroups,
        filename: filename.trim() || undefined,
      });
      setOpen(false);
      setConfirmExport(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const selectedGroupsData = groupsInvolved.filter((g) =>
    selectedGroups.includes(g.id)
  );

  if (isLoading) {
    return (
      <Button disabled className="gap-2">
        <Download className="h-4 w-4" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Schedule
          </DialogTitle>
          <DialogDescription>
            Export "{schedule?.name}" with customizable options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Предупреждение о проблемах */}
          {hasIssues && !confirmExport && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    This schedule has {totalIssues} issue(s):
                  </p>
                  <ul className="text-sm space-y-1">
                    {hasConflicts && (
                      <li>• {totalConflicts} scheduling conflict(s)</li>
                    )}
                    {hasWorkloadIssues && (
                      <li>• {totalWarnings} professor workload warning(s)</li>
                    )}
                  </ul>
                  <p className="text-sm">
                    Are you sure you want to export this schedule?
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {hasIssues && confirmExport && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Proceeding with export despite {totalIssues} issue(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmExport(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
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
          </div>

          {/* Выбор групп */}
          <div className="space-y-3">
            <Label>Groups to include</Label>

            {groupsInvolved.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 border rounded-md">
                No groups found in this schedule
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 max-h-32 overflow-y-auto border rounded-md p-3">
                  {groupsInvolved.map((group) => (
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
                    disabled={selectedGroups.length === groupsInvolved.length}
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

                <p className="text-sm text-muted-foreground">
                  Selected: {selectedGroupsData.length} of{" "}
                  {groupsInvolved.length} group(s)
                </p>
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
                  <FileText className="inline mr-2 h-4 w-4" />
                  Excel (.xlsx)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="cursor-pointer">
                  <Download className="inline mr-2 h-4 w-4" />
                  PDF (.pdf)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Кнопки */}
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setConfirmExport(false);
              }}
            >
              Cancel
            </Button>

            {hasIssues && !confirmExport ? (
              <Button
                onClick={() => setConfirmExport(true)}
                variant="destructive"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Continue Anyway
              </Button>
            ) : (
              <Button
                onClick={handleExport}
                disabled={
                  isExporting || selectedGroups.length === 0 || !filename.trim()
                }
              >
                {isExporting ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
