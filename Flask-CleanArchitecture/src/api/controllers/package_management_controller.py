from flask import Blueprint, request, jsonify
from services.package_service import PackageService

bp = Blueprint('package_management', __name__, url_prefix='/api/admin/packages')
package_service = PackageService()

@bp.route('/', methods=['GET'])
def list_packages():
    """
    Get all packages
    ---
    get:
      summary: Get all learning packages
      tags:
        - Package Management
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive, deleted]
      responses:
        200:
          description: List of packages
    """
    status = request.args.get('status')
    packages = package_service.list_packages(status=status)
    return jsonify(packages), 200

@bp.route('/<int:package_id>', methods=['GET'])
def get_package(package_id):
    """Get package by ID"""
    package = package_service.get_package(package_id)
    if not package:
        return jsonify({'error': 'Package not found'}), 404
    return jsonify(package), 200

@bp.route('/', methods=['POST'])
def create_package():
    """Create new package"""
    data = request.get_json()
    package = package_service.create_package(data)
    return jsonify(package), 201

@bp.route('/<int:package_id>', methods=['PUT'])
def update_package(package_id):
    """Update package"""
    data = request.get_json()
    package = package_service.update_package(package_id, data)
    if not package:
        return jsonify({'error': 'Package not found'}), 404
    return jsonify(package), 200

@bp.route('/<int:package_id>', methods=['DELETE'])
def delete_package(package_id):
    """Delete package"""
    success = package_service.delete_package(package_id)
    if not success:
        return jsonify({'error': 'Package not found'}), 404
    return '', 204
