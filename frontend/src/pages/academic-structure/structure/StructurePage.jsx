import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacultyTab } from "./faculties/FacultyTab";
import { DirectionTab } from "./directions/DirectionTab";

export default function DepartmentsPage() {
  const [activeTab, setActiveTab] = useState("faculties");

  return (
    <div className="container mx-auto py-3">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Departments Management</h1>
        <p className="text-gray-600">Manage faculties and directions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-96 grid-cols-2">
          <TabsTrigger value="faculties">Faculties</TabsTrigger>
          <TabsTrigger value="directions">Directions</TabsTrigger>
        </TabsList>

        <TabsContent value="faculties" className="mt-2">
          <FacultyTab />
        </TabsContent>

        <TabsContent value="directions" className="mt-2">
          <DirectionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
