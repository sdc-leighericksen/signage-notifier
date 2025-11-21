import { Notification } from '../types';
import { NotificationCard } from './NotificationCard';

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      {notifications.length === 0 ? (
        <div className="text-neutral-400 text-center py-12">
          <p className="text-lg">No notifications yet</p>
          <p className="text-sm mt-2">Notifications will appear here when received</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
}
