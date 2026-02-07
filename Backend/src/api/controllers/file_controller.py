"""
File Controller
API endpoints for file uploads (avatars, documents, etc.)
"""
import os
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename

file_bp = Blueprint('file', __name__, url_prefix='/api/files')

# Allowed extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def get_upload_folder():
    """Get or create upload folder path"""
    upload_folder = os.path.join(current_app.root_path, 'uploads', 'avatars')
    os.makedirs(upload_folder, exist_ok=True)
    return upload_folder

def allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_unique_filename(original_filename):
    """Generate unique filename with timestamp and UUID"""
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    return f"{timestamp}_{unique_id}.{ext}"


@file_bp.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    """
    Upload avatar image
    ---
    tags:
      - Files
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: Avatar image file (max 5MB, jpg/png/gif/webp)
      - name: user_id
        in: formData
        type: integer
        required: false
        description: User ID to associate avatar with
    responses:
      200:
        description: Avatar uploaded successfully
        schema:
          type: object
          properties:
            url:
              type: string
            filename:
              type: string
      400:
        description: Invalid file or no file provided
      413:
        description: File too large
    """
    # Check if file is present
    if 'file' not in request.files:
        return jsonify({'error': 'Không tìm thấy file'}), 400
    
    file = request.files['file']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({'error': 'Chưa chọn file'}), 400
    
    # Check file extension
    if not allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
        return jsonify({
            'error': f'Định dạng file không hợp lệ. Chỉ chấp nhận: {", ".join(ALLOWED_IMAGE_EXTENSIONS)}'
        }), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({
            'error': f'File quá lớn. Kích thước tối đa: {MAX_FILE_SIZE // (1024*1024)}MB'
        }), 413
    
    try:
        # Generate unique filename
        filename = generate_unique_filename(secure_filename(file.filename))
        
        # Save file
        upload_folder = get_upload_folder()
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Generate URL
        # Note: In production, this should return a CDN URL or proper static file URL
        base_url = request.host_url.rstrip('/')
        avatar_url = f"{base_url}/api/files/avatars/{filename}"
        
        return jsonify({
            'message': 'Upload thành công',
            'url': avatar_url,
            'filename': filename
        }), 200
        
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({'error': 'Lỗi khi upload file'}), 500


@file_bp.route('/avatars/<filename>', methods=['GET'])
def serve_avatar(filename):
    """
    Serve avatar image
    ---
    tags:
      - Files
    parameters:
      - name: filename
        in: path
        type: string
        required: true
    responses:
      200:
        description: Avatar image file
      404:
        description: File not found
    """
    upload_folder = get_upload_folder()
    
    # Security check - prevent directory traversal
    if '..' in filename or filename.startswith('/'):
        return jsonify({'error': 'Invalid filename'}), 400
    
    filepath = os.path.join(upload_folder, filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File không tồn tại'}), 404
    
    return send_from_directory(upload_folder, filename)


@file_bp.route('/avatars/<filename>', methods=['DELETE'])
def delete_avatar(filename):
    """
    Delete avatar image
    ---
    tags:
      - Files
    parameters:
      - name: filename
        in: path
        type: string
        required: true
    responses:
      200:
        description: Avatar deleted successfully
      404:
        description: File not found
    """
    upload_folder = get_upload_folder()
    
    # Security check
    if '..' in filename or filename.startswith('/'):
        return jsonify({'error': 'Invalid filename'}), 400
    
    filepath = os.path.join(upload_folder, filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File không tồn tại'}), 404
    
    try:
        os.remove(filepath)
        return jsonify({'message': 'Xóa file thành công'}), 200
    except Exception as e:
        print(f"Delete error: {e}")
        return jsonify({'error': 'Lỗi khi xóa file'}), 500
