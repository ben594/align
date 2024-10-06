# Align
An online platform for image labeling.

Team members: Caroline Zhang, Jamie Tan, Rally Lin, Ben Li, Maxwell Lin 

Team name: Align (Open Project)

Github link: https://github.com/ben594/align 

### Milestone 2 Update
Since the last milestone, we planned the different components/functionalities of our project and set up our code repository. We also designed a Figma wireframe outlining the possible actions you can take in the app.

## Run Frontend Locally
Starting from the base directory of the `align` repo, run the following in the container shell.
```
cd frontend
npm run dev
```

## Run Backend with Docker
Once you are in the container, and in the `align` repo, run the following in the container shell.
```
cd backend
./setup.sh
poetry shell
flask run
```
