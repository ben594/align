import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./views/Home/HomePage";
import AuthPage from "./views/Auth/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
