import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './components/error-page';
import Index from './routes';
import { AuthProvider } from 'react-auth-kit';
import Login from './routes/login';
import ProtectedRoute from './components/protectedRoute';
import Root, { loader as projectsLoader } from './routes/root';
import Project, { loader as projectLoader } from './routes/project';
import NewProject, { loader as newProjectLoader, action as newProjectAction } from './routes/newProject';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Root /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    loader: projectsLoader(queryClient),
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'projects/new',
        element: <ProtectedRoute><NewProject /></ProtectedRoute>,
        loader: newProjectLoader(queryClient),
        action: newProjectAction(queryClient)
      },
      {
        path: 'projects/:projectId',
        element: <ProtectedRoute><Project /> </ProtectedRoute>,
        loader: projectLoader(queryClient),
      },
    ]
  },
  {
    path: 'login',
    element: <Login />
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider authType={"cookie"} authName={"_auth"} cookieDomain={window.location.hostname} cookieSecure={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
