
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  status?: 'default' | 'success' | 'warning' | 'error';
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  title,
  description,
  time,
  status = 'default',
}) => {
  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={cn(
        "rounded-full p-2 flex-shrink-0",
        status === 'default' && "bg-primary/10 text-primary",
        status === 'success' && "bg-green-100 text-green-600",
        status === 'warning' && "bg-amber-100 text-amber-600",
        status === 'error' && "bg-red-100 text-red-600",
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
};

export default ActivityItem;
