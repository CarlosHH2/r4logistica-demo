
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarNavGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({ 
  title, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sidebar-foreground px-3 py-2 text-sm"
      >
        <span className="font-medium uppercase tracking-wider text-xs">{title}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
      </button>
      <div className={cn("space-y-1 overflow-hidden transition-all", 
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        {children}
      </div>
    </div>
  );
};

export default SidebarNavGroup;
