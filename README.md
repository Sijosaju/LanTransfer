# 🌐 LanTransfer

**LanTransfer** is a lightweight, offline-capable web application for **seamless file sharing and real-time communication** across devices on a **Local Area Network (LAN)**.  
Built with **Flask** and **Socket.IO**, it enables users to **share files and chat** without needing internet connectivity — ideal for classrooms, offices, or any closed network environment.

---

## 🚀 Features

### 📂 File Transfer System
- Upload and download files up to **500MB**.
- Supports **drag-and-drop** or traditional file selection.
- Real-time file list updates across all connected clients.
- Secure file handling using Flask’s `Werkzeug` utilities.

### 📱 QR Code Connection
- Automatically generates a **QR code** displaying the server’s local IP and port.
- Instantly connect mobile or desktop devices by scanning the QR — no typing needed.

### 💬 Real-Time Group Chat
- Built with **Socket.IO** for instant communication.
- Displays **user join/leave notifications** and **message timestamps**.
- Enhances collaboration within the local network.

### 📴 Offline-First Architecture
- Works **completely offline** — all JS libraries, icons, and assets are served locally.
- No external CDN dependencies, ensuring smooth performance in isolated networks.

---

## 🧠 Technical Stack

**Backend**
- [Flask](https://flask.palletsprojects.com): Web framework for routing and file serving.  
- [Flask-SocketIO](https://flask-socketio.readthedocs.io): Enables real-time communication.  
- [Werkzeug](https://werkzeug.palletsprojects.com): Provides secure file handling.  
- [QRCode](https://marcoagner.github.io/Flask-QRcode/): Generates QR codes for quick connections.  

**Frontend**
- **HTML5** – Semantic structure for the interface.  
- **CSS3** – Glassmorphism design with gradients and smooth animations.  
- **JavaScript** – Event-driven logic and real-time Socket.IO integration.  
- **Socket.IO Client** – For bidirectional communication with the Flask server.  

---

## ⚙️ Key Implementations

### 🔍 Network Discovery
Uses Python’s `socket` module to automatically detect the **local IP address** for hosting.

### ⚡ Real-Time Sync
`emit()` events in Socket.IO instantly broadcast **file uploads, user joins, and chat messages** to all connected clients.

### 👤 User Session Management
- Username persistence using **browser cookies**.  
- Modal interface prompts users to enter their name when connecting.

### 🔒 Secure File Handling
- Uses `secure_filename()` to sanitize uploaded filenames.  
- Limits file size to **500MB**.  
- Prevents directory traversal attacks.

---

## 📁 Project Structure

```

LanTransfer/
├── app.py                  # Flask app and Socket.IO setup
├── templates/
│   └── index.html          # Main interface
├── static/
│   ├── css/
│   │   ├── style.css       # Custom styles
│   │   └── fontawesome.min.css
│   └── js/
│       ├── script.js       # Client-side logic
│       └── socket.io.min.js
└── uploads/                # Uploaded files directory

````

---

## 🧰 Installation & Setup

### 🔹 Prerequisites
- Python 3.8+
- pip (Python package installer)

### 🔹 Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LanTransfer.git
   cd LanTransfer
````

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask app**

   ```bash
   python app.py
   ```

4. **Access the app**

   * Open your browser and go to `http://<your_local_IP>:5000`
   * Or scan the **QR code** displayed in the terminal.

---

## 💡 Use Cases

| Environment                 | Use Case                                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| 🎓 Educational Institutions | Teachers can share study materials and assignments without internet access. |
| 🏢 Office Networks          | Teams can exchange files securely within LAN without cloud dependency.      |
| 🎪 Event Venues             | Attendees can share documents and communicate even in offline areas.        |
| 💻 Development Teams        | Quick code and resource sharing during local testing or hackathons.         |

---

## 🔐 Security Notes

* Runs on trusted LAN environments.
* Files sanitized and size-restricted.
* Uses Flask `SECRET_KEY` for secure session management.
* Authentication can be added if needed for enhanced security.

---

## 🧩 Future Enhancements

* 🔍 File search and categorization
* 🔐 User authentication
* 🗑️ File deletion and management
* 📜 Upload history tracking
* 📤 Multiple simultaneous uploads

---

## 🧾 References

* [Flask-SocketIO Documentation](https://flask-socketio.readthedocs.io)
* [Flask QRCode](https://marcoagner.github.io/Flask-QRcode/)
* [Generate QR Code using Python](https://www.geeksforgeeks.org/python/generate-qr-code-using-qrcode-in-python/)
* [Miguel Grinberg’s Flask-SocketIO Examples](https://github.com/miguelgrinberg/Flask-SocketIO)

---

## 👨‍💻 Author

**Sijo Saju**
📧 [[your-email@example.com](mailto:your-email@example.com)]
💼 [LinkedIn Profile or Portfolio link]
🌍 Developed as part of a local network communication project.

---

## 📜 License

This project is licensed under the **MIT License** – you’re free to use, modify, and distribute it with attribution.

---

### ⭐ If you found this project useful, give it a star on GitHub!

```

---

Would you like me to generate a small `requirements.txt` file (for Flask, Flask-SocketIO, etc.) to include in your repo too?
```
