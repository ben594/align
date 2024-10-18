import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import AuthPage from './views/Auth/AuthPage'
import Dashboard from './views/Home/Dashboard'
import HomePage from './views/Home/HomePage'
import LabelingInterface from './views/Labeling/LabelingInterface'
import ProfilePage from './views/Profile/ProfilePage'
import ReviewingInterface from './views/Labeling/ReviewingInterface'
import ProjectCreationPage from './views/Project/ProjectCreationPage.tsx'
import Leaderboard from './views/Leaderboard/Leaderboard'
import AuthRoute from './components/AuthRoute.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/user/:userId',
    element: <ProfilePage />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthRoute>
        <Dashboard />
      </AuthRoute>
    ),
  },
  {
    path: '/label/:projectId',
    element: (
      <AuthRoute>
        <LabelingInterface />
      </AuthRoute>
    ),
  },
  {
    path: '/review/:projectId',
    element: (
      <AuthRoute>
        <ReviewingInterface />
      </AuthRoute>
    ),
  },
  {
    path: '/new-project',
    element: (
      <AuthRoute>
        <ProjectCreationPage />
      </AuthRoute>
    ),
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
