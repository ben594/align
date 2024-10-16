from backend.app.models.project import Project
from flask import jsonify, request


project_bp = Blueprint('leaderboard', __name__)

@project_bp.route('/leaderboard', methods=['GET'])
def get_top_labelers_projects(id):
    top_labelers = 
    top_projects = 
    project = Project.get(id)
    if project:
        return jsonify({
            'id': project.id,
            'name': project.name,
            'deadline': project.deadline
        }), 200
    return jsonify({'error': 'Project not found'}), 404

# 2 separate get requests??? or not