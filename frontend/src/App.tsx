import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import AuthPage from './views/Auth/AuthPage'
import Dashboard from './views/Home/Dashboard'
import HomePage from './views/Home/HomePage'
import LabelingInterface from './views/Labeling/LabelingInterface'
import ProfilePage from './views/Profile/ProfilePage'
import ReviewingInterface from './views/Labeling/ReviewingInterface'
import Leaderboard from './views/Leaderboard/Leaderboard'

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
    element: <Dashboard />,
  },
  {
    path: '/label/:projectId',
    element: <LabelingInterface />,
  },
  {
    path: '/review/:projectId',
    element: <ReviewingInterface />,
  },
  {
    path: '/leaderboard',
    element: <Leaderboard/>
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
