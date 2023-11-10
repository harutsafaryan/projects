import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './components/error-page';
import Index from './routes';
import Project, {loader as projectLoader} from './routes/project';
import { AuthProvider, RequireAuth } from 'react-auth-kit';
import Login from './routes/login';
import NewProject, {action as newProjectAction} from './routes/newProject';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index:true,
        element: <Index/>
      },
      {
        path: 'login',
        element: <Login/>
      },
      {
        path:'projects',
        element: <Project/>,
        children: [
          {
            path: 'new',
            element: <NewProject/>,
            action: newProjectAction
          }
        ]
      }
    ]
  }
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
