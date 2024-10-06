import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./views/Home/HomePage";
import AuthPage from "./views/Auth/AuthPage";
import LabelingInterface from "./views/Labeling/LabelingInterface";
import ReviewingInterface from "./views/Labeling/ReviewingInterface";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/label/:projectId",
    element: <LabelingInterface />,
  },
  {
    path: "/review/:projectId",
    element: <ReviewingInterface />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
