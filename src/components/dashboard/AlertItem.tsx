
import React from 'react';
import { AlertCircle, CheckCircle2, Clock, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertStatus = 'pending' | 'active' | 'resolved';

interface AlertItemProps {
  title: string;
  message: string;
  time: string;
  status: AlertStatus;
}

const statusConfig: Record<AlertStatus, {
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}> = {
  pending: {
    icon: Clock,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
  },
  active: {
    icon: AlertCircle,
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
  },
  resolved: {
    icon: CheckCircle2,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
};

const AlertItem: React.FC<AlertItemProps> = ({
  title,
  message,
  time,
  status,
}) => {
  const { icon: Icon, bgColor, textColor } = statusConfig[status];

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={cn(
        "rounded-full p-2 flex-shrink-0",
        bgColor,
        textColor
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded",
            status === 'pending' && "bg-amber-100 text-amber-600",
            status === 'active' && "bg-red-100 text-red-600",
            status === 'resolved' && "bg-green-100 text-green-600",
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

export default AlertItem;
