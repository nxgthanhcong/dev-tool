import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import Arr01 from "./pages/arr-01";

function App() {
  return (
    // <ThemeProvider>
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <Routes>
          <Route path="/dev-tool/arr-01" element={<Arr01 />} />
        </Routes>
      </main>
    </SidebarProvider>
    // </ThemeProvider>
  );
}

export default App;
