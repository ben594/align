from backend.app.models.image import Image
from flask import jsonify, request, Blueprint


image_bp = Blueprint('images', __name__)

@image_bp.route('/images/<int:id>', methods=['GET'])
def get_image(id):
    project = Project.get(id)
    if project:
        return jsonify({
            'id': project.id,
            'name': project.name,
            'deadline': project.deadline
        }), 200
    return jsonify({'error': 'Project not found'}), 404

@image_bp.route('/images/<int:id>', methods=['GET'])
def get_images_by_project():
    pass

@image_bp.route('/images', methods=['POST'])
def upload_image():
    pass
