from flask import Blueprint, request, jsonify
from services.user_service import UserService

bp = Blueprint('user_management', __name__, url_prefix='/api/admin/users')
user_service = UserService()

@bp.route('/', methods=['GET'])
def list_users():
    """
    Get list of users with filtering
    ---
    get:
      summary: Get list of all users
      tags:
        - User Management
      parameters:
        - name: role
          in: query
          schema:
            type: string
            enum: [learner, mentor, admin]
        - name: status
          in: query
          schema:
            type: string  
            enum: [active, inactive, deleted]
        - name: search
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          schema:
            type: integer
            default: 20
      responses:
        200:
          description: List of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      type: object
                  total:
                    type: integer
                  page:
                    type: integer
                  per_page:
                    type: integer
                  total_pages:
                    type: integer
    """
    role = request.args.get('role')
    status = request.args.get('status')
    search = request.args.get('search')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    result = user_service.list_users(
        role=role,
        status=status,
        search=search,
        page=page,
        per_page=per_page
    )
    return jsonify(result), 200

@bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get user by ID
    ---
    get:
      summary: Get user details by ID
      tags:
        - User Management
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        200:
          description: User details
        404:
          description: User not found
    """
    user = user_service.get_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200

@bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Update user information
    ---
    put:
      summary: Update user by ID
      tags:
        - User Management
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                role:
                  type: string
                status:
                  type: string
                plan:
                  type: string
      responses:
        200:
          description: User updated successfully
        404:
          description: User not found
    """
    data = request.get_json()
    user = user_service.update_user(user_id, data)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200

@bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete user
    ---
    delete:
      summary: Delete user by ID
      tags:
        - User Management
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        204:
          description: User deleted successfully
        404:
          description: User not found
    """
    success = user_service.delete_user(user_id)
    if not success:
        return jsonify({'error': 'User not found'}), 404
    return '', 204

@bp.route('/stats', methods=['GET'])
def get_user_stats():
    """
    Get user statistics
    ---
    get:
      summary: Get user statistics
      tags:
        - User Management
      responses:
        200:
          description: User statistics
    """
    stats = user_service.get_user_stats()
    return jsonify(stats), 200


@bp.route('/<int:user_id>/enable', methods=['PUT'])
def enable_user(user_id):
    """
    Enable (activate) a user account
    ---
    put:
      summary: Enable a user account
      tags:
        - User Management
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        200:
          description: User enabled successfully
        404:
          description: User not found
    """
    user = user_service.enable_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'message': 'User enabled successfully', 'user': user}), 200


@bp.route('/<int:user_id>/disable', methods=['PUT'])
def disable_user(user_id):
    """
    Disable (deactivate) a user account
    ---
    put:
      summary: Disable a user account
      tags:
        - User Management
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        200:
          description: User disabled successfully
        404:
          description: User not found
    """
    user = user_service.disable_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'message': 'User disabled successfully', 'user': user}), 200
