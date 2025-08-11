import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import Arr01 from "./pages/arr-format";
import JsonFormatPage from "./pages/json-format";
import { ThemeProvider } from "./components/theme-provider";
import ModeToggle from "./components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <Routes>
            <Route path="/arr-01" element={<Arr01 />} />
            <Route path="/json-01" element={<JsonFormatPage />} />
          </Routes>
        </main>
      </SidebarProvider>
      <div className="fixed top-10 right-10">
        <ModeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
