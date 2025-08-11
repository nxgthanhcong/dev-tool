import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import SwitchButton from "./components/kokonutui/switch-button";
import { ThemeProvider } from "./components/theme-provider";
import Arr01 from "./pages/arr-format";
import JsonFormatPage from "./pages/json-format";
import XmlFormatPage from "./pages/xml-format";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <Routes>
            <Route path="/arr-01" element={<Arr01 />} />
            <Route path="/json-01" element={<JsonFormatPage />} />
            <Route path="/xml-01" element={<XmlFormatPage />} />
          </Routes>
        </main>
      </SidebarProvider>
      <div className="fixed top-10 right-32">
        <SwitchButton />
      </div>
    </ThemeProvider>
  );
}

export default App;
