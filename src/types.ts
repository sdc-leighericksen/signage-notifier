export interface Notification {
  id: string;          // mapped from Appwrite $id
  title: string;
  description: string;
  color: string;
  image: 'good' | 'bad' | 'problem';
  timestamp: string;
  created_at: string;  // mapped from Appwrite $createdAt
}
