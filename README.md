# Align
An online platform for image labeling.

Team members: Caroline Zhang, Jamie Tan, Rally Lin, Ben Li, Maxwell Lin 

Team name: Align (Open Project)

Github link: https://github.com/ben594/align 

### Milestone 2 Update
Since the last milestone, we planned the different components/functionalities of our project and set up our code repository. We also designed a Figma wireframe outlining the possible actions you can take in the app.

### Milestone 3 Update
Video demo link: https://drive.google.com/file/d/1ebVQ1A6dVAgmH_OxDSz7WW8lEjIXnRNI/view?usp=sharing

Since the last milestone, each team member successfully implemented backend API endpoints for executing a query, as well as the corresponding frontend widgets for displaying results and interacting with those backend API endpoints. We implemented the following pages:

- Project page:
  - Frontend: [frontend/src/views/Project/ProjectDisplayPage.tsx](https://github.com/ben594/align/blob/main/frontend/src/views/Project/ProjectDisplayPage.tsx)
  - Backend: [backend/app/controllers/project_controller.py](https://github.com/ben594/align/blob/main/backend/app/controllers/project_controller.py)
- Dashboard page:
  - Frontend: [frontend/src/views/Home/Dashboard.tsx](https://github.com/ben594/align/blob/main/frontend/src/views/Home/Dashboard.tsx)
  - Backend: [backend/app/controllers/project_controller.py](https://github.com/ben594/align/blob/main/backend/app/controllers/project_controller.py)
- User Profile:
  - Frontend: [frontend/src/views/Profile/ProfilePage.tsx](https://github.com/ben594/align/blob/main/frontend/src/views/Profile/ProfilePage.tsx)
  - Backend: [backend/app/controllers/user_controller.py](https://github.com/ben594/align/blob/main/backend/app/controllers/user_controller.py)
- Leaderboard:
  - Frontend: [frontend/src/views/Leaderboard/Leaderboard.tsx](https://github.com/ben594/align/blob/main/frontend/src/views/Leaderboard/Leaderboard.tsx)
  - Backend: [backend/app/controllers/leaderboard_controller.py](https://github.com/ben594/align/blob/main/backend/app/controllers/leaderboard_controller.py)
- Project cards:
  - Frontend: [frontend/src/views/Project/ProjectCreationPage.tsx](https://github.com/ben594/align/blob/main/frontend/src/views/Project/ProjectCreationPage.tsx)
  - Backend: Uses project controller linked above

## Run Frontend Locally
Starting from the base directory of the `align` repo, run the following in the container shell.
```
cd frontend
npm install
npm run dev
```

## Run Backend with Docker
Once you are in the container shell, and in the `align` repo, run the following in the container shell.
```
cd backend
poetry shell
./install.sh
flask run
```
