import './i18n';

import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import Calendar from './pages/Calendar';
import Contact from './pages/Contact';
import Contents from './pages/Contents';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './pages/Users';
import { AuthRoute, PrivateRoute } from './Route';
import authService from './services/AuthService';

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  const authenticate = async () => {
    try {
      const authResponse = await authService.refresh();
      setAuthenticatedUser(authResponse.user);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
  }, [authenticatedUser]);

  return (
    isLoaded && (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#E31D1C]"></div>
          </div>
        }
      >
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute
              exact
              path="/users"
              component={Users}
              roles={['admin']}
            />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/favorites" component={Favorites} />
            <PrivateRoute exact path="/courses" component={Courses} />
            <PrivateRoute exact path="/courses/:id" component={Contents} />
            <PrivateRoute exact path="/calendar" component={Calendar} />
            <PrivateRoute exact path="/contact" component={Contact} />

            <AuthRoute exact path="/login" component={Login} />
          </Switch>
        </Router>
      </Suspense>
    )
  );
}
