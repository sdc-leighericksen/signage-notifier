# Signage Notifier

A real-time notification display system for digital signage. The app shows the 6 most recent notifications, polling every 5 seconds, and displays full-screen animated popups when new notifications arrive.

---

## Architecture

- **Frontend**: React + Vite, served as static files via Nginx in Docker
- **Database**: Appwrite (`signage-notifier` database, `notifications` collection)
- **Webhook**: Appwrite Function (`notifications-webhook`) receives POST requests from external systems and writes to the database
- **Display URL**: `https://signage-notifier.stokecloud.dev`

---

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on the target machine
- Caddy running with a shared Docker network named `caddy`
- Access to the Appwrite instance at `https://appwrite.stokecloud.dev`

### 1. Clone the repository

```bash
git clone https://github.com/sdc-leighericksen/signage-notifier/
cd signage-notifier
```

### 2. Create the environment file

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_APPWRITE_ENDPOINT=https://appwrite.stokecloud.dev/v1
VITE_APPWRITE_PROJECT_ID=69c371dd001dd980ebd7
```

### 3. Create the Caddy Docker network (if it doesn't exist)

```bash
docker network create caddy
```

### 4. Build and start the container

```bash
docker compose up -d --build
```

This will:
- Build the React app with the Appwrite credentials baked in
- Serve it via Nginx on port 80 inside the container
- Expose it on the `caddy` Docker network as `signage-notifier`

### 5. Configure Caddy

Add this block to your Caddyfile (typically `/etc/caddy/Caddyfile`):

```
signage-notifier.stokecloud.dev {
    reverse_proxy signage-notifier:80
}
```

Then reload Caddy:

```bash
caddy reload --config /etc/caddy/Caddyfile
# or if running Caddy in Docker:
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

### 6. Verify

Open `https://signage-notifier.stokecloud.dev` in a browser. The app should load and display notifications.

---

### Updating the app

After pulling new changes, rebuild and restart the container:

```bash
git pull
docker compose up -d --build
```

---

## Webhook API

External systems send notifications by POSTing to the Appwrite Function endpoint.

### Endpoint

```
POST https://appwrite.stokecloud.dev/v1/functions/notifications-webhook/executions
```

### Headers

```
Content-Type: application/json
X-Appwrite-Project: 69c371dd001dd980ebd7
```

### Important: request format

Appwrite Functions require the notification data to be sent as a **JSON string** inside a `body` field — not as a plain JSON object. The outer wrapper is always the same; only the contents of `body` change.

```json
{
  "body": "{\"title\":\"Your title\",\"description\":\"Your message\",\"color\":\"#22c55e\",\"image\":\"good\"}",
  "async": false
}
```

> The `body` value is a **stringified JSON object** — note the escaped quotes. See the cURL, JavaScript, and Python examples below for how each language handles this automatically.

### Notification payload fields

#### Required

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Main heading for the notification |
| `description` | string | Message body |
| `color` | string | Hex color for the popup background (e.g. `#FF5733`) |

#### Optional

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `image` | string | `"good"` | GIF pool: `"good"`, `"bad"`, or `"problem"` |
| `timestamp` | string | Current time | ISO 8601 timestamp |

### Example: cURL

```bash
curl -X POST https://appwrite.stokecloud.dev/v1/functions/notifications-webhook/executions \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: 69c371dd001dd980ebd7" \
  -d '{
    "body": "{\"title\":\"Deployment Complete\",\"description\":\"v2.1.0 deployed successfully.\",\"color\":\"#22c55e\",\"image\":\"good\"}",
    "async": false
  }'
```

### Example: JavaScript/Node.js

```javascript
await fetch('https://appwrite.stokecloud.dev/v1/functions/notifications-webhook/executions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': '69c371dd001dd980ebd7',
  },
  body: JSON.stringify({
    body: JSON.stringify({
      title: 'Build Failed',
      description: 'CI pipeline failed on main branch.',
      color: '#ef4444',
      image: 'bad',
    }),
    async: false,
  }),
});
```

### Example: Python

```python
import requests
import json

payload = {
    "title": "High Memory Usage",
    "description": "Server memory at 85%. Investigation required.",
    "color": "#f59e0b",
    "image": "problem"
}

response = requests.post(
    'https://appwrite.stokecloud.dev/v1/functions/notifications-webhook/executions',
    headers={
        'Content-Type': 'application/json',
        'X-Appwrite-Project': '69c371dd001dd980ebd7',
    },
    json={"body": json.dumps(payload), "async": False}
)
print(response.json())
```

### Response

**Success (200)**
```json
{ "success": true }
```

**Missing fields (400)**
```json
{ "error": "Missing required fields: title, description, color" }
```

**Database error (500)**
```json
{ "error": "Database error", "details": "..." }
```

---

## Notification types and colors

| `image` value | Use for | Suggested colors |
|---------------|---------|-----------------|
| `good` | Success, completion | `#22c55e`, `#10b981` |
| `bad` | Errors, failures | `#ef4444`, `#dc2626` |
| `problem` | Warnings, alerts | `#f59e0b`, `#fb923c` |

---

## Customising GIFs

GIF pools are configured in `src/config.ts`. Each notification type randomly selects one GIF from its pool. Replace the URLs with any direct `.gif` links:

```typescript
export const GIF_POOLS = {
  good: [
    'https://media.giphy.com/media/your-gif/giphy.gif',
  ],
  bad: [ ... ],
  problem: [ ... ],
};
```

After editing, redeploy with `docker compose up -d --build`.

---

## Appwrite Database Structure

| Attribute | Type | Notes |
|-----------|------|-------|
| `$id` | string | Auto-generated document ID |
| `title` | string (512) | Required |
| `description` | string (2048) | Required |
| `colour` | string (7) | Required — hex color |
| `Image` | string (10) | Required — good/bad/problem |
| `timestamp` | datetime | Required — event time |
| `$createdAt` | datetime | Auto-managed |

---

## Troubleshooting

**App not loading**
- Check the container is running: `docker compose ps`
- Check logs: `docker compose logs signage-notifier`
- Verify the `caddy` network exists: `docker network ls`

**Notifications not appearing**
- Check the webhook response body — `status` should be `completed`
- Verify the Appwrite Function is active (Deployments tab shows Active)
- Check the Appwrite Function execution logs (Executions tab)
- Wait up to 5 seconds for the polling cycle

**Webhook errors**
- `Missing required attribute` — field name mismatch in collection, check Appwrite Attributes tab
- `general_unauthorized_scope` — remove the `X-Appwrite-Key` header, anonymous execution is used
