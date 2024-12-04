import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      },
      {
        path: "user",
        element: <UsersPage/>
      },
      {
        path: "note",
        element: <NotesPage/>
      },
      {
        path: "register",
        element: <RegisterPage/>
      },
      {
        path: "login",
        element: <LoginPage/>
      },
    ],
  },
 
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWrapper>
    <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>,
)
