from backend.app.models.project import Project
from flask import jsonify, request, Blueprint


project_bp = Blueprint('projects', __name__)

@project_bp.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = Project.get(id)
    if project:
        return jsonify({
            'id': project.id,
            'name': project.name,
            'deadline': project.deadline
        }), 200
    return jsonify({'error': 'Project not found'}), 404

@project_bp.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    name = data.get('name')
    deadline = data.get('deadline')

    if not name:
        return jsonify({'error': 'No project name found'}), 400

    new_project = Project.create(name, deadline)

    if new_project:
        return jsonify({'message': 'Project created', 'project': new_project}), 201
    return jsonify({'error': 'Failed to create project'}), 500
