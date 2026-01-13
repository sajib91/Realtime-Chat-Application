# Real-Time Chat Application

A lightweight, real-time chat application built with **Node.js** and **Socket.io**. This application supports multiple concurrent users, dynamic group creation, and private 1-on-1 messaging.

## 🚀 Features

* **Real-Time Messaging:** Instant message delivery using WebSockets.
* **User Login:** Simple in-memory user identification (no database required for setup).
* **Group Chat (Rooms):** Users can create or join specific rooms (e.g., "General", "Sports").
* **Private Messaging:** Click on any online user in the sidebar to send a direct, private message.
* **System Notifications:** Automatic alerts when users join or leave a group.
* **Live User List:** see who is currently online in real-time.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Real-Time Engine:** Socket.io
* **Frontend:** HTML5, CSS3, Vanilla JavaScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher recommended)
* npm (Node Package Manager)

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Server**
    ```bash
    node server.js
    ```

4.  **Access the App**
    Open your browser and navigate to:
    `http://localhost:3000`

## 📖 Usage Guide

1.  **Login:** Enter a unique username on the landing screen.
2.  **Join a Group:**
    * Type a group name (e.g., "Room1") in the top input box.
    * Click **Join Group**.
    * You can now chat with anyone else who joins "Room1".
3.  **Private Chat:**
    * Look at the "Online Users" sidebar on the left.
    * Click on a username.
    * The "Target" indicator will update to **Private**.
    * Messages sent will only be visible to that user.
4.  **Leave Group:** Click the **Leave Group** button to stop receiving messages from that room.
