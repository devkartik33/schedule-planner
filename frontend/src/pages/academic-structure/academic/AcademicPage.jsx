import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicYearTab } from "./academic-years/AcademicYearTab";
import { SemesterTab } from "./semesters/SemesterTab";

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState("academic-years");

  return (
    <div className="container mx-auto py-3">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Academic Management</h1>
        <p className="text-gray-600">Manage academic years and semesters</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-96 grid-cols-2">
          <TabsTrigger value="academic-years">Academic Years</TabsTrigger>
          <TabsTrigger value="semesters">Semesters</TabsTrigger>
        </TabsList>

        <TabsContent value="semesters" className="mt-2">
          <SemesterTab />
        </TabsContent>

        <TabsContent value="academic-years" className="mt-2">
          <AcademicYearTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
