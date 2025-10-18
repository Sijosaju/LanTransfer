from flask import Flask, render_template, request, send_from_directory, redirect, url_for
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import qrcode
import socket
import io
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 5000 * 1024 * 1024  # 500MB max

socketio = SocketIO(app, cors_allowed_origins="*")
uploaded_files = []

# Ensure uploads folder exists at startup
if not os.path.exists('uploads'):
    os.makedirs('uploads')

def get_local_ip():
    """Get the local IP address of the server"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def generate_qr_code():
    """Generate QR code for the server URL"""
    ip = get_local_ip()
    port = 5000
    url = f"http://{ip}:{port}"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64 for embedding in HTML
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str, url

@app.route('/')
def index():
    qr_code, server_url = generate_qr_code()
    return render_template('index.html', files=uploaded_files, qr_code=qr_code, server_url=server_url)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return redirect(url_for('index'))
        
        file = request.files['file']
        
        if file.filename == '':
            return redirect(url_for('index'))
        
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            # Ensure uploads directory exists
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            
            file.save(filepath)
            
            file_info = {
                'name': filename,
                'size': os.path.getsize(filepath),
                'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            uploaded_files.append(file_info)
            
            socketio.emit('file_uploaded', file_info)
            
            return redirect(url_for('index'))
    
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return f"Upload failed: {str(e)}", 500

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

@app.errorhandler(413)
def too_large(e):
    return "File is too large! Maximum size is 500MB", 413

@socketio.on('send_message')
def handle_message(data):
    emit('receive_message', {
        'user': data['user'],
        'message': data['message'],
        'time': datetime.now().strftime('%H:%M:%S')
    }, broadcast=True)

@socketio.on('connect')
def handle_connect():
    emit('user_connected', {'message': 'A user connected'}, broadcast=True)

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Display connection info
    local_ip = get_local_ip()
    print(f"\n{'='*50}")
    print(f"Server running on: http://{local_ip}:5000")
    print(f"Scan the QR code to connect from other devices!")
    print(f"{'='*50}\n")
    
    # 0.0.0.0 makes it accessible on any network interface
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
