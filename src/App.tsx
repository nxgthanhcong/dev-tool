import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Route, Routes } from "react-router-dom";
import Arr01 from "./pages/arr-01";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    // <ThemeProvider>
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <Routes>
          <Route path="/arr-01" element={<Arr01 />} />
        </Routes>
      </main>
    </SidebarProvider>
    // </ThemeProvider>
  );
}

export default App;
