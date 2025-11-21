import { Notification } from '../types';

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className="bg-neutral-800 rounded-lg p-4 relative overflow-hidden"
      style={{
        borderLeft: `10px solid ${notification.color}`,
      }}
    >
      <h3 className="text-xl font-bold text-white mb-2">
        {notification.title}
      </h3>
      <p className="text-neutral-300 text-base mb-2">
        {notification.description}
      </p>
      <p className="text-neutral-500 text-sm">
        {formatTimestamp(notification.created_at)}
      </p>
    </div>
  );
}
