import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import Arr01 from "./pages/arr-format";
import JsonFormatPage from "./pages/json-format";

function App() {
  return (
    // <ThemeProvider>
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
    // </ThemeProvider>
  );
}

export default App;
