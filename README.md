# Notification Display System Documentation

## Overview

This is a real-time notification display system designed for digital signage. The application consists of two main components:

1. **Display Interface**: A mobile-optimized view (528px wide) that shows the 6 most recent notifications
2. **Full-Screen Popups**: Animated notifications that appear for 30 seconds when new items are received

The system automatically checks for new notifications every 5 seconds and displays them with customizable colors, messages, and animated GIFs.

## Architecture

The application uses:
- **Frontend**: React-based display interface with automatic polling
- **Backend**: Supabase database with two serverless edge functions
- **Real-time Updates**: Polling mechanism checks for new notifications every 5 seconds
- **Webhook Integration**: External systems can send notifications via HTTP POST

---

## Webhook API

### Endpoint URL

```
POST https://hdlnwowtoqgifqvjsqsq.supabase.co/functions/v1/notifications-webhook
```

### Request Format

Send a POST request with a JSON payload containing the following fields:

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | The main heading for the notification (non-empty) |
| `description` | string | Additional details or message body (non-empty) |
| `color` | string | Hex color code for the popup background (e.g., `#FF5733`) |

#### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `image` | string | `"good"` | GIF pool selector. Valid values: `"good"`, `"bad"`, `"problem"` |
| `timestamp` | string | Current time | ISO 8601 timestamp (e.g., `"2025-11-16T10:30:00Z"`) |

### Payload Examples

#### Success Notification
```json
{
  "title": "Deployment Complete",
  "description": "Version 2.1.0 has been deployed to production successfully.",
  "color": "#22c55e",
  "image": "good"
}
```

#### Error Notification
```json
{
  "title": "Build Failed",
  "description": "The CI pipeline encountered errors in the test suite.",
  "color": "#ef4444",
  "image": "bad"
}
```

#### Warning Notification
```json
{
  "title": "High Memory Usage",
  "description": "Server memory usage is at 85%. Investigation required.",
  "color": "#f59e0b",
  "image": "problem"
}
```

#### Custom Timestamp
```json
{
  "title": "Scheduled Maintenance",
  "description": "System maintenance completed ahead of schedule.",
  "color": "#3b82f6",
  "image": "good",
  "timestamp": "2025-11-16T08:00:00Z"
}
```

### Response Format

#### Success Response (200)
```json
{
  "success": true
}
```

#### Error Responses

**Missing Required Fields (400)**
```json
{
  "error": "Missing required fields: title, description, color"
}
```

**Invalid Field Values (400)**
```json
{
  "error": "Title, description, and color must be non-empty strings"
}
```

**Database Error (500)**
```json
{
  "error": "Database error",
  "details": "Error message details"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Notification created successfully |
| 400 | Invalid request (missing or invalid fields) |
| 405 | Method not allowed (must use POST) |
| 500 | Server error (database or internal issue) |

### Testing with cURL

```bash
curl -X POST https://hdlnwowtoqgifqvjsqsq.supabase.co/functions/v1/notifications-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "description": "This is a test message",
    "color": "#6366f1",
    "image": "good"
  }'
```

### Integration Examples

#### JavaScript/Node.js
```javascript
const response = await fetch('https://hdlnwowtoqgifqvjsqsq.supabase.co/functions/v1/notifications-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Sale',
    description: 'Order #12345 has been placed',
    color: '#10b981',
    image: 'good'
  })
});

const result = await response.json();
console.log(result);
```

#### Python
```python
import requests
import json

url = 'https://hdlnwowtoqgifqvjsqsq.supabase.co/functions/v1/notifications-webhook'
payload = {
    'title': 'Server Alert',
    'description': 'CPU usage exceeded threshold',
    'color': '#f59e0b',
    'image': 'problem'
}

response = requests.post(url, json=payload)
print(response.json())
```

---

## Display URL

Access the notification display interface at your deployed application URL. The interface is designed for:

- Digital signage displays
- Dashboard monitors
- Status boards
- Information kiosks

### Display Features

1. **Mobile-First Design**: Optimized for 528px width with vertical scrolling
2. **Dark Theme**: Black background for reduced eye strain and better contrast
3. **Auto-Refresh**: Polls for new notifications every 5 seconds
4. **Recent History**: Shows the 6 most recent notifications in chronological order
5. **Color-Coded**: Each notification has a colored left border matching the popup color

### Notification Card Design

Each notification card displays:
- **Title**: Bold, prominent heading
- **Description**: Detailed message content
- **Timestamp**: Formatted date and time (e.g., "Nov 16, 10:30 AM")
- **Color Bar**: 10px left border in the notification's custom color

### Full-Screen Popup Behavior

When a new notification arrives:
1. The entire screen fills with the notification's color
2. An animated GIF appears (randomly selected from the appropriate pool)
3. The title and description are displayed in large, readable text
4. Text color automatically adjusts for optimal contrast (black or white)
5. The popup fades in smoothly
6. After 30 seconds, the popup automatically fades out and closes

---

## Customizing GIFs

The system uses three pools of GIFs that correspond to different notification types. When a notification arrives, the app randomly selects one GIF from the appropriate pool.

### GIF Pool Configuration

GIF pools are configured in the file: `src/config.ts`

### Available Pools

| Pool Name | Purpose | Use Cases |
|-----------|---------|-----------|
| `good` | Positive events | Success, completion, achievements, celebrations |
| `bad` | Negative events | Errors, failures, critical issues |
| `problem` | Warnings | Alerts, warnings, issues requiring attention |

### Current Configuration

```typescript
export const GIF_POOLS = {
  good: [
    'https://media2.giphy.com/media/3ohze3kG5qO9DcTUbe/giphy.gif',
    'https://media2.giphy.com/media/vvbGMpbhZMcHSsD50w/giphy.gif',
    'https://media1.giphy.com/media/S9i8jJxTvAKVHVMvvW/giphy.gif',
  ],
  bad: [
    'https://media2.giphy.com/media/qryGWflHFCKv6/giphy.gif',
    'https://media0.giphy.com/media/KAQg0sejGV5F6/giphy.gif',
    'https://media4.giphy.com/media/vNNsw7IsdQfowDotga/giphy.gif',
  ],
  problem: [
    'https://media.giphy.com/media/xTiTnGeUsWOEwsGoG4/giphy.gif',
    'https://media4.giphy.com/media/yr7n0u3qzO9nG/giphy.gif',
    'https://media.giphy.com/media/dbtDDSvWErdf2/giphy.gif',
  ],
};
```

### How to Change GIFs

#### Step 1: Find Your GIF

Search for GIFs on popular platforms:
- [Giphy](https://giphy.com)
- [Tenor](https://tenor.com)
- Any direct GIF URL

#### Step 2: Get the Direct GIF URL

Make sure you have the direct link to the GIF file, ending in `.gif`

Example: `https://media.giphy.com/media/example123/giphy.gif`

#### Step 3: Edit the Configuration File

1. Open the file: `src/config.ts`
2. Find the pool you want to modify (`good`, `bad`, or `problem`)
3. Replace or add GIF URLs within the array

#### Step 4: Save and Rebuild

After making changes, the application will automatically use your new GIFs.

### Adding More GIFs to a Pool

You can add as many GIFs as you want to each pool. The system will randomly select one each time:

```typescript
export const GIF_POOLS = {
  good: [
    'https://media.giphy.com/media/gif1/giphy.gif',
    'https://media.giphy.com/media/gif2/giphy.gif',
    'https://media.giphy.com/media/gif3/giphy.gif',
    'https://media.giphy.com/media/gif4/giphy.gif',  // Added more options
    'https://media.giphy.com/media/gif5/giphy.gif',
  ],
  // ... other pools
};
```

### Removing GIFs from a Pool

Simply delete the line containing the GIF URL you want to remove:

```typescript
export const GIF_POOLS = {
  good: [
    'https://media.giphy.com/media/gif1/giphy.gif',
    // Removed second GIF
    'https://media.giphy.com/media/gif3/giphy.gif',
  ],
  // ... other pools
};
```

### Best Practices for GIF Selection

1. **Keep file sizes reasonable**: Large GIFs may load slowly
2. **Choose appropriate themes**: Match the GIF to the notification type
3. **Consider readability**: Text will overlay the GIF, so avoid overly busy animations
4. **Test different GIFs**: Preview how they look in the full-screen popup
5. **Maintain variety**: Multiple GIFs per pool keeps the display fresh

---

## Color Guidelines

### Hex Color Format

Colors must be in hex format: `#RRGGBB`

Examples:
- `#FF0000` - Red
- `#00FF00` - Green
- `#0000FF` - Blue
- `#FFFFFF` - White
- `#000000` - Black

### Invalid Color Handling

If an invalid color is provided, the system defaults to `#333333` (dark gray).

### Recommended Colors

#### Success/Positive
- `#22c55e` - Green
- `#10b981` - Emerald
- `#06b6d4` - Cyan

#### Error/Critical
- `#ef4444` - Red
- `#dc2626` - Dark Red
- `#f87171` - Light Red

#### Warning/Alert
- `#f59e0b` - Amber
- `#eab308` - Yellow
- `#fb923c` - Orange

#### Info/Neutral
- `#3b82f6` - Blue
- `#6366f1` - Indigo
- `#8b5cf6` - Purple

### Text Contrast

The system automatically calculates whether to use black or white text based on the background color's brightness, ensuring readability on any color.

---

## Troubleshooting

### Notifications Not Appearing

1. Check the webhook response for errors
2. Verify all required fields are provided
3. Ensure color is in valid hex format
4. Check that the display interface is running
5. Wait up to 5 seconds for the polling cycle to detect new notifications

### GIFs Not Loading

1. Verify the GIF URL is a direct link ending in `.gif`
2. Check that the URL is publicly accessible
3. Ensure the GIF hosting service allows hotlinking
4. Try accessing the GIF URL directly in a browser

### Popup Not Showing

1. Verify the `image` field is set to `"good"`, `"bad"`, or `"problem"`
2. Check browser console for JavaScript errors
3. Ensure notifications are being received (check the notification list)
4. Try refreshing the display interface

### Color Not Displaying Correctly

1. Verify color is in hex format with `#` prefix
2. Check that hex code uses valid characters (0-9, A-F)
3. Use 6-character hex codes (`#RRGGBB`)

---

## Technical Details

### Database Schema

The system stores notifications in a Supabase PostgreSQL database with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique identifier (auto-generated) |
| `title` | text | Notification title |
| `description` | text | Notification description |
| `color` | text | Hex color code |
| `image` | text | GIF pool selector (good/bad/problem) |
| `timestamp` | timestamptz | Event timestamp |
| `created_at` | timestamptz | Database creation time |

### API Endpoints

1. **Webhook Endpoint**: `POST /functions/v1/notifications-webhook`
   - Creates new notifications
   - Validates input
   - Stores in database

2. **Display Endpoint**: `GET /functions/v1/notifications-latest`
   - Retrieves the 6 most recent notifications
   - Sorted by creation time (newest first)
   - Used by the display interface for polling

### Polling Interval

The display interface polls for new notifications every 5 seconds. This can be adjusted in `src/config.ts`:

```typescript
export const POLL_INTERVAL_MS = 5000; // 5 seconds
```

---

## Support

For issues, questions, or feature requests, refer to the project repository or contact your system administrator.
