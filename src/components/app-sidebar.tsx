import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, NavLink } from "react-router-dom";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/">
          <img
            src="/dev-tool/logo.jpg"
            alt="..."
            className="rounded-lg object-cover dark:brightness-[0.2] dark:grayscale w-16"
          />
          <div className="pl-2 font-bold">Cong provjp devtool</div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Features:</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <NavLink
                    to="/arr-01"
                    className={({ isActive }) =>
                      `block w-full transition-all duration-300 px-2 py-1 rounded-md ${
                        isActive ? "font-medium  underline" : ""
                      }`
                    }
                  >
                    Arr format
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-sm">badvibe4rever © 2025 </div>
      </SidebarFooter>
    </Sidebar>
  );
}
