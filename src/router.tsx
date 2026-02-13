import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { ProgressProvider } from "@/context/ProgressContext";
import { DashboardLayout } from "@/routes/DashboardLayout";
import { Home } from "@/routes/Home";
import { Duel } from "@/routes/Duel";
import { Collection } from "@/routes/Collection";
import { Curriculum } from "@/routes/Curriculum";
import { Draw } from "@/routes/Draw";
import { Phonetics } from "@/routes/Phonetics";
import { Lesson } from "@/routes/Lesson";

// Root Route (Context only? Or Outlet?)
// We use a root route to provide context if needed, but we wrap app in ProgressProvider outside
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Dashboard Route (Layout)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard",
  component: DashboardLayout,
});

// Main Routes (Undo Dashbaord Layout)
const indexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: Home,
});

const duelRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/duel",
  component: Duel,
});

const collectionRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/collection",
  component: Collection,
});

const curriculumRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/curriculum",
  component: Curriculum,
});

const drawRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/draw",
  component: Draw,
});

const phoneticsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/phonetics",
  component: Phonetics,
});

// Lesson Route (No Dashboard Layout)
const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lesson/$lessonId",
  component: Lesson,
});

// Route Tree
const routeTree = rootRoute.addChildren([
  dashboardRoute.addChildren([
    indexRoute,
    duelRoute,
    collectionRoute,
    curriculumRoute,
    drawRoute,
    phoneticsRoute,
  ]),
  lessonRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
