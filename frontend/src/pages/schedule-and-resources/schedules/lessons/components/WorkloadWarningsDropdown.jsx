import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSchedulePageData } from "@/contexts/SchedulePageContext";

export function WorkloadWarningsDropdown({ onNavigateToLessons }) {
  const {
    workloadWarnings,
    totalWarnings,
    hasWorkloadIssues,
    workloadLoading,
  } = useSchedulePageData();

  if (workloadLoading) {
    return (
      <Button variant="outline" disabled>
        <Clock className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!hasWorkloadIssues) {
    return (
      <Button variant="outline" className="text-green-600">
        <Clock className="h-4 w-4 mr-2" />
        Hours OK
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-amber-600">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Hours Issues
          <Badge variant="destructive" className="ml-2">
            {totalWarnings}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Workload Warnings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {workloadWarnings.map((warning) => (
          <DropdownMenuItem
            key={warning.subject_assignment_id}
            className="cursor-pointer p-3"
            onClick={() =>
              onNavigateToLessons && onNavigateToLessons(warning.lessons)
            }
          >
            <div className="space-y-1 w-full">
              <div className="font-medium text-amber-600 flex items-center justify-between">
                <span>Assignment Exceeded</span>
                <Badge variant="outline" className="text-xs">
                  +{warning.excess_hours.toFixed(1)}h
                </Badge>
              </div>

              <div className="text-sm space-y-1">
                <div className="font-medium text-foreground">
                  {warning.professor_name}
                </div>
                <div className="text-muted-foreground">
                  {warning.subject_name}
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Scheduled:</span>
                  <span className="font-medium">
                    {warning.scheduled_hours}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Allowed:</span>
                  <span className="font-medium">{warning.allowed_hours}h</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Excess:</span>
                  <span className="font-medium">
                    +{warning.excess_hours.toFixed(1)}h
                  </span>
                </div>
              </div>

              {warning.lessons && (
                <div className="text-xs text-muted-foreground">
                  {warning.lessons.length} lesson
                  {warning.lessons.length !== 1 ? "s" : ""} affected
                </div>
              )}
            </div>
          </DropdownMenuItem>
        ))}

        {totalWarnings > 3 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-xs text-center text-muted-foreground">
              Showing {Math.min(3, totalWarnings)} of {totalWarnings} warnings
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
