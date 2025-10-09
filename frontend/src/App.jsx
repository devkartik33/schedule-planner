import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import { ReactQueryProvider } from "@/lib/ReactQuery";

import { Breadcrumbs } from "@/components/Breadcrumbs";

// Academic Structure
import { AcademicPage } from "./pages/academic-structure/academic";
import { StructurePage } from "./pages/academic-structure/structure";
import { SubjectsPage } from "./pages/academic-structure/subjects";

// People Management
import { UsersPage } from "@/pages/people-management/users";
import { GroupsPage } from "./pages/people-management/groups";

// Teaching Load
import { ContractsPage } from "./pages/teaching-load/contracts";
import {
  WorkloadsPage,
  EditWorkloadPage,
} from "./pages/teaching-load/workloads";

// Schedule and Resources
import {
  SchedulesPage,
  EditSchedulePage,
} from "./pages/schedule-and-resources/schedules";
import { RoomsPage } from "./pages/schedule-and-resources/rooms";

// Login and Error Pages
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import ForbiddenPage from "./pages/errors/ForbiddenPage";

import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { TokenWatcher } from "./components/TokenWatcher";

// Layout for all protected pages
function AppLayout() {
  return (
    <>
      <TokenWatcher />

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumbs />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

// Router setup
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<ForbiddenPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/academic-management" element={<AcademicPage />} />
        <Route path="/academic-structure" element={<StructurePage />} />
        <Route path="/subjects" element={<SubjectsPage />} />

        <Route index element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/groups" element={<GroupsPage />} />

        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/workloads" element={<WorkloadsPage />} />
        <Route path="/workloads/:id/edit" element={<EditWorkloadPage />} />

        <Route path="/schedules" element={<SchedulesPage />} />
        <Route
          path="/schedules/:scheduleId/edit"
          element={<EditSchedulePage />}
        />
        <Route path="/classrooms" element={<RoomsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

export default function App() {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <Toaster />
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </AuthProvider>
  );
}
