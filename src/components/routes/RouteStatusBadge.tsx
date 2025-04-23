
import { Badge } from '@/components/ui/badge';

type StatusType = 'pending' | 'active' | 'completed';

interface RouteStatusBadgeProps {
  status: StatusType;
}

export const RouteStatusBadge = ({ status }: RouteStatusBadgeProps) => {
  const statusMap: Record<StatusType, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
    pending: { label: 'Pendiente', variant: 'secondary' },
    active: { label: 'En Progreso', variant: 'default' },
    completed: { label: 'Completada', variant: 'outline' },
  };

  const statusInfo = statusMap[status];

  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  );
};
