export interface Notification {
  id: string;
  title: string;
  description: string;
  color: string;
  image: 'good' | 'bad' | 'problem';
  timestamp: string;
  created_at: string;
}
