# 🚀 Fusion — Real-Time Collaborative Workspace

Fusion is a real-time collaborative document platform where teams can **write, chat, manage versions, and collaborate live** inside workspaces.

Built as a flagship full-stack project showcasing:
- Real-time systems
- Permissions architecture
- Version control
- Scalable backend design

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Refresh token flow (secure cookie-based)
- Protected routes & middleware

---

### 🏢 Workspaces
- Create and manage workspaces
- Invite members via shareable links
- Join workspace using invite token
- Role-based access system

---

### 👥 Members & Permissions
- Roles: Owner / Editor / Viewer
- Permission controls:
  - Edit documents
  - Invite members
  - Delete documents
  - Manage workspace users

---

### 📄 Documents
- Create documents inside workspaces
- Real-time collaborative editing
- Auto-save document content
- Delete documents

---

### 🕓 Version History
- Manual version snapshots
- View all previous versions
- Restore any previous version

---

### 💬 Real-Time Chat
- Workspace-level chat system
- Instant messaging using sockets
- Live collaboration environment

---

### ⚡ Real-Time Presence
- See active users in workspace
- See users inside a document
- Live cursor movement (if enabled in UI)

---

## 🧠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication

### Frontend (in progress / sprint phase)
- React
- Context / State Management
- Socket.IO Client

---

## 🧱 API Structure

### 🔐 Auth Routes
POST   /api/auth/register  
POST   /api/auth/login  
POST   /api/auth/refresh  
POST   /api/auth/logout  

---

### 🏢 Workspace Routes
POST   /api/workspace  
GET    /api/workspace  
GET    /api/workspace/:id  
POST   /api/workspace/:id/invite  
POST   /api/workspace/join/:token  

---

### 📄 Document Routes (Workspace Scoped)
POST   /api/workspace/:id/documents  
GET    /api/workspace/:id/documents  

---

### 📄 Document Routes (Direct)
GET     /api/documents/:docId  
DELETE  /api/documents/:docId  
PUT     /api/documents/:docId/content  
POST    /api/documents/:docId/version  
GET     /api/documents/:docId/versions  
POST    /api/documents/restore/:versionId  

---

## 🔌 Socket Events

### Workspace
- joinWorkspace  
- sendMessage  
- workspaceUsers (presence)  

### Document
- joinDocument  
- sendDelta  
- receiveDelta  
- cursorMove  
- documentUsers (presence)  

---

## 🧪 Current Status

Backend is **feature-complete and production-ready (core features)**.

Frontend is being actively improved, focusing on:
- Version history UI
- Chat interface
- Members & invite UX
- Permissions visibility
- Product polish

---

## 🎯 Project Goal

Fusion is designed to demonstrate:
- Real-time system design
- Collaborative editing architecture
- Backend scalability patterns
- Clean permission handling

---

## 🚀 Getting Started

### 1. Clone Repo
git clone https://github.com/your-username/fusion.git  
cd fusion  

### 2. Install Dependencies
npm install  

### 3. Setup Environment Variables

Create a `.env` file:

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
REFRESH_SECRET=your_refresh_secret  
CLIENT_URL=http://localhost:3000  

### 4. Run Server
npm run dev  

---

## 📸 Demo (To Be Added)

<img width="1907" height="970" alt="image" src="https://github.com/user-attachments/assets/4e07de19-a2a8-49f0-a702-88d84acfb848" />
---
<img width="1343" height="568" alt="image" src="https://github.com/user-attachments/assets/f7b7c3ce-ac5c-4fc5-8abc-29e990dd2589" />
---
<img width="1904" height="826" alt="image" src="https://github.com/user-attachments/assets/a5c8ca7b-b9c0-4dc7-9e7f-9c11c4953f4c" />

---

## 🛠 Future Improvements
- Rich text editor enhancements  
- Cursor indicators UI  
- Notifications system  
- Document sharing outside workspace  
- Mobile responsiveness  

---

## 🤝 Contributing
Currently a personal project, but suggestions and feedback are welcome.

---

## 📬 Contact
- LinkedIn: https://www.linkedin.com/in/ujjwaltayal/
- Email: ujjwaltayal40@gmail.com

---

## ⭐ Final Note
Fusion is not just about features — it's about **making real-time collaboration feel seamless**.
