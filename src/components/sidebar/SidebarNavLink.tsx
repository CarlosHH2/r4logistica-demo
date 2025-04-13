
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface SidebarNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  exactMatch?: boolean;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  exactMatch = false 
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        cn(
          "flex items-center text-sidebar-foreground gap-2 py-2 px-3 my-1 rounded-md transition-colors",
          "hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
          isActive && "active-nav-link"
        )
      }
      end={exactMatch}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarNavLink;
