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
import { AspectRatio } from "./ui/aspect-ratio";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/">
          <img
            src="/dev-tool/junzu02.jpg"
            alt="..."
            className="rounded-lg object-cover dark:brightness-[0.2] dark:grayscale w-24"
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
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <NavLink
                    to="/json-01"
                    className={({ isActive }) =>
                      `block w-full transition-all duration-300 px-2 py-1 rounded-md ${
                        isActive ? "font-medium  underline" : ""
                      }`
                    }
                  >
                    Json format
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex justify-between items-end">
          suy sup tuoi 25
          <img
            src="/dev-tool/tubt.jpg"
            alt="Photo by Drew Beamer"
            className="h-16 w-16 rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
          />{" "}
        </div>
        <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
          <img
            src="/dev-tool/qr.png"
            alt="Photo by Drew Beamer"
            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AspectRatio>
        <div className="p-4 text-sm">
          <p className="font-medium ">
            <hr />
            badvibe4rever © 2025{" "}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
