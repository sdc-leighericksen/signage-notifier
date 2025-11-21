import { useEffect, useState, useRef } from 'react';
import { Notification } from './types';
import { NotificationList } from './components/NotificationList';
import { NotificationPopup } from './components/NotificationPopup';
import { GIF_POOLS, API_BASE_URL, POLL_INTERVAL_MS } from './config';

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [popupNotification, setPopupNotification] = useState<Notification | null>(null);
  const [selectedGif, setSelectedGif] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const latestIdRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef(true);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications from:', API_BASE_URL);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        API_BASE_URL + '/functions/v1/notifications-latest',
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }

      const data = await response.json();
      console.log('Received notifications:', data);

      if (data.notifications && data.notifications.length > 0) {
        const newLatestId = data.notifications[0].id;

        if (!isInitialLoadRef.current && latestIdRef.current && newLatestId !== latestIdRef.current) {
          const notification = data.notifications[0];
          const gifPool = GIF_POOLS[notification.image] || GIF_POOLS.good;
          const randomGif = gifPool.length > 0
            ? gifPool[Math.floor(Math.random() * gifPool.length)]
            : '';

          setSelectedGif(randomGif);
          setPopupNotification(notification);
        }

        latestIdRef.current = newLatestId;
        setNotifications(data.notifications);

        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }

      setError(null);
      retryCountRef.current = 0;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);

      if (retryCountRef.current < maxRetries) {
        retryCountRef.current = retryCountRef.current + 1;
        console.log('Retrying... attempt', retryCountRef.current);
        setTimeout(fetchNotifications, 2000);
      } else {
        setError('Failed to load notifications. Please check your connection.');
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleClosePopup = () => {
    setPopupNotification(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#000000' }}>
      {isLoading ? (
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading notifications...</div>
          <div className="text-neutral-400 text-sm">Please wait</div>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <div className="text-neutral-400 text-sm">{error}</div>
        </div>
      ) : (
        <div className="w-full max-w-[528px] h-screen shadow-2xl overflow-y-auto" style={{ backgroundColor: '#000000' }}>
          <NotificationList notifications={notifications} />
        </div>
      )}

      {popupNotification && (
        <NotificationPopup
          notification={popupNotification}
          gifUrl={selectedGif}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export default App;
