import type { ApiGroup } from '../../types';
import { vaultcdnConfig } from './config';

const BASE = vaultcdnConfig.baseUrl;

export const vaultcdnApiGroups: ApiGroup[] = [
  {
    id: 'authentication',
    title: 'Authentication',
    description:
      'Sign in with Discord OAuth for browser sessions, or use Bearer tokens (JWT or cdn_… API keys) for programmatic access.',
    endpoints: [
      {
        id: 'auth-login',
        method: 'GET',
        path: '/api/auth/login',
        title: 'Login',
        description: 'Redirect the browser to Discord OAuth to begin sign-in.',
        auth: 'None',
        curl: `curl -L "${BASE}/api/auth/login"`,
        response: `HTTP/1.1 302 Found\nLocation: https://discord.com/api/oauth2/authorize?...`,
      },
      {
        id: 'auth-callback',
        method: 'GET',
        path: '/api/auth/callback',
        title: 'OAuth Callback',
        description: 'Discord OAuth callback handler. Sets the cdn_session cookie and redirects to the app.',
        auth: 'None',
        params: [
          { name: 'code', type: 'string', description: 'OAuth authorization code from Discord.', in: 'query', required: true },
          { name: 'state', type: 'string', description: 'CSRF state parameter.', in: 'query', required: true },
        ],
        curl: `# Handled by browser redirect after Discord login\nGET ${BASE}/api/auth/callback?code=...&state=...`,
        response: `HTTP/1.1 302 Found\nSet-Cookie: cdn_session=...; HttpOnly; Secure\nLocation: ${BASE}/gallery`,
      },
      {
        id: 'auth-me',
        method: 'GET',
        path: '/api/auth/me',
        title: 'Current User',
        description: 'Returns the current user and permission flags. Works without a session (returns null user).',
        auth: 'Session (optional)',
        curl: `curl "${BASE}/api/auth/me" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "user": {
    "id": "123456789012345678",
    "username": "phxuser",
    "avatar": "abc123",
    "isAdmin": false,
    "canUpload": true
  }
}`,
      },
      {
        id: 'auth-logout',
        method: 'GET',
        path: '/api/auth/logout',
        title: 'Logout',
        description: 'Destroy the session cookie and redirect to the landing page.',
        auth: 'Session',
        curl: `curl -L "${BASE}/api/auth/logout" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `HTTP/1.1 302 Found\nLocation: ${BASE}/`,
      },
      {
        id: 'auth-token',
        method: 'GET',
        path: '/api/auth/token',
        title: 'Create Access Token',
        description: 'Issue a short-lived Bearer JWT (1 hour) for programmatic uploads while logged in via browser.',
        auth: 'Session + upload access',
        curl: `curl "${BASE}/api/auth/token" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}`,
      },
    ],
  },
  {
    id: 'api-keys',
    title: 'API Keys',
    description: 'Create and revoke non-expiring API keys from Settings. Keys are hashed at rest and shown in full only once.',
    endpoints: [
      {
        id: 'api-keys-list',
        method: 'GET',
        path: '/api/auth/api-keys',
        title: 'List API Keys',
        description: 'List your API keys. Only the key prefix is returned — full keys are shown once at creation.',
        auth: 'Session + upload access',
        curl: `curl "${BASE}/api/auth/api-keys" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "keys": [
    {
      "id": "664a1b2c3d4e5f6a7b8c9d0e",
      "prefix": "cdn_a1b2",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}`,
      },
      {
        id: 'api-keys-create',
        method: 'POST',
        path: '/api/auth/api-keys',
        title: 'Create API Key',
        description: 'Create a new non-expiring API key. The full key (cdn_…) is returned only once.',
        auth: 'Session + upload access',
        curl: `curl -X POST "${BASE}/api/auth/api-keys" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "id": "664a1b2c3d4e5f6a7b8c9d0e",
  "key": "cdn_full_key_shown_once",
  "prefix": "cdn_a1b2",
  "createdAt": "2026-01-01T00:00:00.000Z"
}`,
      },
      {
        id: 'api-keys-delete',
        method: 'DELETE',
        path: '/api/auth/api-keys/{id}',
        title: 'Revoke API Key',
        description: 'Permanently revoke an API key by ID.',
        auth: 'Session + upload access',
        params: [
          { name: 'id', type: 'string', description: 'API key document ID.', in: 'path', required: true },
        ],
        curl: `curl -X DELETE "${BASE}/api/auth/api-keys/664a1b2c3d4e5f6a7b8c9d0e" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "success": true
}`,
      },
    ],
  },
  {
    id: 'files',
    title: 'Files',
    description: 'Upload, list, update, and delete files stored in your vault.',
    endpoints: [
      {
        id: 'files-upload',
        method: 'POST',
        path: '/api/upload',
        title: 'Upload File',
        description: 'Upload a file via multipart form data. Rate-limited to 20 uploads per minute per user.',
        auth: 'Bearer + upload access',
        params: [
          { name: 'Authorization', type: 'string', description: 'Bearer cdn_… API key or JWT.', in: 'header', required: true },
          { name: 'file', type: 'file', description: 'File to upload (multipart field name: file).', in: 'body', required: true },
          { name: 'folderId', type: 'string', description: 'Optional folder UUID to place the file in.', in: 'body' },
        ],
        curl: `curl -X POST "${BASE}/api/upload" \\\n  -H "Authorization: Bearer cdn_YOUR_API_KEY" \\\n  -F "file=@photo.png"`,
        response: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "/f/550e8400-e29b-41d4-a716-446655440000",
  "fullUrl": "${BASE}/f/550e8400-e29b-41d4-a716-446655440000",
  "originalName": "photo.png",
  "mimeType": "image/png",
  "uploadedAt": "2026-01-01T00:00:00.000Z"
}`,
      },
      {
        id: 'files-list',
        method: 'GET',
        path: '/api/files',
        title: 'List Files',
        description: 'List gallery files for the authenticated user.',
        auth: 'Session',
        params: [
          { name: 'folderId', type: 'string', description: 'Filter by folder UUID.', in: 'query' },
          { name: 'imagesOnly', type: 'boolean', description: 'Return only image files.', in: 'query' },
        ],
        curl: `curl "${BASE}/api/files?folderId=FOLDER_UUID" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "originalName": "photo.png",
      "mimeType": "image/png",
      "size": 102400,
      "folderId": null,
      "pinned": false,
      "uploadedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}`,
      },
      {
        id: 'files-patch',
        method: 'PATCH',
        path: '/api/files/{id}',
        title: 'Update File',
        description: 'Rename, move, or pin a file. Requires owner or admin.',
        auth: 'Session or Bearer; owner or admin',
        params: [
          { name: 'id', type: 'string', description: 'File UUID.', in: 'path', required: true },
          { name: 'originalName', type: 'string', description: 'New display name.', in: 'body' },
          { name: 'folderId', type: 'string | null', description: 'Move to folder (null for root).', in: 'body' },
          { name: 'pinned', type: 'boolean', description: 'Pin or unpin the file.', in: 'body' },
        ],
        curl: `curl -X PATCH "${BASE}/api/files/550e8400-e29b-41d4-a716-446655440000" \\\n  -H "Authorization: Bearer cdn_YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"originalName":"renamed.png"}'`,
        response: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "renamed.png",
  "pinned": false
}`,
      },
      {
        id: 'files-put',
        method: 'PUT',
        path: '/api/files/{id}',
        title: 'Replace File Content',
        description: 'Replace file content on disk (used by the in-browser image editor). Requires owner or admin.',
        auth: 'Session or Bearer; owner or admin',
        params: [
          { name: 'id', type: 'string', description: 'File UUID.', in: 'path', required: true },
          { name: 'file', type: 'file', description: 'New file content.', in: 'body', required: true },
        ],
        curl: `curl -X PUT "${BASE}/api/files/550e8400-e29b-41d4-a716-446655440000" \\\n  -H "Cookie: cdn_session=YOUR_SESSION" \\\n  -F "file=@edited.png"`,
        response: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "photo.png",
  "mimeType": "image/png"
}`,
      },
      {
        id: 'files-delete',
        method: 'DELETE',
        path: '/api/files/{id}',
        title: 'Delete File',
        description: 'Delete a file from disk and MongoDB. Requires owner or admin.',
        auth: 'Session or Bearer; owner or admin',
        params: [
          { name: 'id', type: 'string', description: 'File UUID.', in: 'path', required: true },
        ],
        curl: `curl -X DELETE "${BASE}/api/files/550e8400-e29b-41d4-a716-446655440000" \\\n  -H "Authorization: Bearer cdn_YOUR_API_KEY"`,
        response: `{
  "success": true
}`,
      },
    ],
  },
  {
    id: 'folders',
    title: 'Folders',
    description: 'Organize files into folders in the gallery.',
    endpoints: [
      {
        id: 'folders-list',
        method: 'GET',
        path: '/api/folders',
        title: 'List Folders',
        description: 'List folders for the authenticated user.',
        auth: 'Session',
        params: [
          { name: 'parentId', type: 'string', description: 'List children of this folder.', in: 'query' },
          { name: 'all', type: 'boolean', description: 'Return all folders (flat list).', in: 'query' },
          { name: 'breadcrumb', type: 'boolean', description: 'Include breadcrumb trail.', in: 'query' },
        ],
        curl: `curl "${BASE}/api/folders?parentId=PARENT_UUID" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "folders": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Screenshots",
      "parentId": null,
      "pinned": false
    }
  ]
}`,
      },
      {
        id: 'folders-create',
        method: 'POST',
        path: '/api/folders',
        title: 'Create Folder',
        description: 'Create a new folder in the gallery.',
        auth: 'Session + upload access',
        params: [
          { name: 'name', type: 'string', description: 'Folder name.', in: 'body', required: true },
          { name: 'parentId', type: 'string | null', description: 'Parent folder UUID (null for root).', in: 'body' },
        ],
        curl: `curl -X POST "${BASE}/api/folders" \\\n  -H "Cookie: cdn_session=YOUR_SESSION" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Screenshots"}'`,
        response: `{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Screenshots",
  "parentId": null
}`,
      },
      {
        id: 'folders-patch',
        method: 'PATCH',
        path: '/api/folders/{id}',
        title: 'Update Folder',
        description: 'Rename, move, pin, or set thumbnail on a folder. Requires owner.',
        auth: 'Session + upload access; owner',
        params: [
          { name: 'id', type: 'string', description: 'Folder UUID.', in: 'path', required: true },
          { name: 'name', type: 'string', description: 'New folder name.', in: 'body' },
          { name: 'parentId', type: 'string | null', description: 'Move to parent folder.', in: 'body' },
          { name: 'pinned', type: 'boolean', description: 'Pin or unpin folder.', in: 'body' },
          { name: 'thumbnailFileId', type: 'string', description: 'Image file ID for folder cover.', in: 'body' },
        ],
        curl: `curl -X PATCH "${BASE}/api/folders/660e8400-e29b-41d4-a716-446655440001" \\\n  -H "Cookie: cdn_session=YOUR_SESSION" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"New Name"}'`,
        response: `{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "New Name"
}`,
      },
      {
        id: 'folders-delete',
        method: 'DELETE',
        path: '/api/folders/{id}',
        title: 'Delete Folder',
        description: 'Delete a folder. Requires owner.',
        auth: 'Session + upload access; owner',
        params: [
          { name: 'id', type: 'string', description: 'Folder UUID.', in: 'path', required: true },
        ],
        curl: `curl -X DELETE "${BASE}/api/folders/660e8400-e29b-41d4-a716-446655440001" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "success": true
}`,
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Manage members, upload access, and storage quotas. Requires admin role.',
    endpoints: [
      {
        id: 'admin-overview',
        method: 'GET',
        path: '/api/admin/overview',
        title: 'Admin Overview',
        description: 'Returns all members, uploads, and usage statistics.',
        auth: 'Session + admin',
        curl: `curl "${BASE}/api/admin/overview" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "members": [
    {
      "discordId": "123456789012345678",
      "username": "phxuser",
      "hasAccess": true,
      "quotaBytes": 10737418240,
      "usedBytes": 1048576
    }
  ],
  "totalFiles": 42,
  "totalStorageBytes": 52428800
}`,
      },
      {
        id: 'admin-members-create',
        method: 'POST',
        path: '/api/admin/members',
        title: 'Add Member',
        description: 'Add a member by Discord user ID before they have signed in.',
        auth: 'Session + admin',
        params: [
          { name: 'discordId', type: 'string', description: 'Discord user snowflake ID.', in: 'body', required: true },
          { name: 'hasAccess', type: 'boolean', description: 'Grant upload access.', in: 'body' },
          { name: 'quota', type: 'number', description: 'Storage quota in bytes.', in: 'body' },
        ],
        curl: `curl -X POST "${BASE}/api/admin/members" \\\n  -H "Cookie: cdn_session=YOUR_SESSION" \\\n  -H "Content-Type: application/json" \\\n  -d '{"discordId":"123456789012345678","hasAccess":true}'`,
        response: `{
  "discordId": "123456789012345678",
  "hasAccess": true,
  "quotaBytes": 10737418240
}`,
      },
      {
        id: 'admin-members-patch',
        method: 'PATCH',
        path: '/api/admin/members/{id}',
        title: 'Update Member',
        description: 'Set upload access and storage quota for a member.',
        auth: 'Session + admin',
        params: [
          { name: 'id', type: 'string', description: 'Member document ID.', in: 'path', required: true },
          { name: 'hasAccess', type: 'boolean', description: 'Toggle upload access.', in: 'body' },
          { name: 'quota', type: 'number', description: 'Storage quota in bytes.', in: 'body' },
        ],
        curl: `curl -X PATCH "${BASE}/api/admin/members/MEMBER_ID" \\\n  -H "Cookie: cdn_session=YOUR_SESSION" \\\n  -H "Content-Type: application/json" \\\n  -d '{"hasAccess":true,"quota":53687091200}'`,
        response: `{
  "id": "MEMBER_ID",
  "hasAccess": true,
  "quotaBytes": 53687091200
}`,
      },
      {
        id: 'admin-members-delete',
        method: 'DELETE',
        path: '/api/admin/members/{id}',
        title: 'Remove Member',
        description: 'Remove a member. Blocked if uploads exist or member is env-locked.',
        auth: 'Session + admin',
        params: [
          { name: 'id', type: 'string', description: 'Member document ID.', in: 'path', required: true },
        ],
        curl: `curl -X DELETE "${BASE}/api/admin/members/MEMBER_ID" \\\n  -H "Cookie: cdn_session=YOUR_SESSION"`,
        response: `{
  "success": true
}`,
      },
    ],
  },
];

export const imagePreviewSection = {
  title: 'Image Previews',
  description:
    'Append query parameters to public image URLs for on-the-fly WebP previews via Sharp.',
  example: `${BASE}/f/{id}?w=480&q=80`,
  params: [
    { name: 'w', type: 'number', description: 'Max width in pixels (Sharp resize).', in: 'query' as const },
    { name: 'q', type: 'number', description: 'WebP quality from 1 to 100.', in: 'query' as const },
  ],
};
