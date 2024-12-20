import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import AuthPage from './views/Auth/AuthPage'
import AuthRoute from './components/AuthRoute.tsx'
import Dashboard from './views/Home/Dashboard'
import HomePage from './views/Home/HomePage'
import LabelingInterface from './views/Labeling/LabelingInterface'
import Leaderboard from './views/Leaderboard/Leaderboard'
import ProfilePage from './views/Profile/ProfilePage'
import ProjectCreationPage from './views/Project/ProjectCreationPage.tsx'
import ProjectDisplayPage from './views/Project/ProjectDisplayPage.tsx'
import FinalizedImagesPage from './views/Project/FinalizedImagesPage.tsx'
import ProjectSettingsPage from './views/Project/ProjectSettingsPage.tsx'
import ReviewingInterface from './views/Labeling/ReviewingInterface'
import NotFoundPage from './views/NotFoundPage.tsx'

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
    path: '/profile/:user_id',
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
  {
    path: '/project/:projectId/images',
    element: (
      <AuthRoute>
        <ProjectDisplayPage />
      </AuthRoute>
    ),
  },
  {
    path: '/project/:projectId/finalized_images',
    element: (
      <AuthRoute>
        <FinalizedImagesPage />
      </AuthRoute>
    ),

  },
  {
    path: '/project/:projectId/settings',
    element: (
      <AuthRoute>
        <ProjectSettingsPage />
      </AuthRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
