import { useEffect, useState } from 'react';
import { Notification } from '../types';

interface NotificationPopupProps {
  notification: Notification;
  gifUrl: string;
  onClose: () => void;
}

export function NotificationPopup({ notification, gifUrl, onClose }: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setIsVisible(true), 10);

    const autoCloseTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 30000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [notification.id, onClose]);

  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(notification.color);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 transition-opacity duration-500"
      style={{
        backgroundColor: notification.color,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-center justify-center max-w-2xl w-full text-center">
        {gifUrl && (
          <div className="mb-8">
            <img
              src={gifUrl}
              alt="Notification animation"
              className="max-w-full max-h-64 rounded-lg shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
            />
          </div>
        )}

        <h1
          className="text-5xl font-bold mb-6"
          style={{
            color: textColor,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {notification.title}
        </h1>

        <p
          className="text-2xl leading-relaxed"
          style={{
            color: textColor,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {notification.description}
        </p>
      </div>
    </div>
  );
}
