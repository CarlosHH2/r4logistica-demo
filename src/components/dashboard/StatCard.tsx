
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  variant?: 'default' | 'outline';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  variant = 'default',
  className,
}) => {
  return (
    <div className={cn(
      "stats-card flex items-start",
      variant === 'outline' && 'border-2',
      className
    )}>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <span className={cn(
              "ml-2 text-sm",
              changeType === 'positive' && "text-green-600",
              changeType === 'negative' && "text-red-600",
              changeType === 'neutral' && "text-gray-500"
            )}>
              {change}
            </span>
          )}
        </div>
      </div>
      <div className={cn(
        "rounded-md p-2",
        variant === 'default' && "bg-primary/10 text-primary"
      )}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
};

export default StatCard;
