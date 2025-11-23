import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

// Импорт страниц
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  OrderInfo,
  IngredientDetails
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, Preloader } from '@components';

// Импортируем store и Provider
import { Provider } from 'react-redux';
import store from '../../services/store';
import { checkUserAuth } from '../../services/auth/authSlice';

// --- Хуки авторизации ---
const useAuth = () => {
  const { user, isAuthChecked } = useSelector((store) => store.auth);
  return {
    isAuthenticated: !!user,
    user,
    isAuthChecked
  };
};

const OnlyUnAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return isAuthenticated ? (
    <Navigate to={location.state?.from || '/'} replace />
  ) : (
    children
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

const ProtectedResetRoute = ({ children }: { children: React.ReactNode }) => {
  const hasResetToken = localStorage.getItem('resetPassword');
  return hasResetToken ? children : <Navigate to='/forgot-password' replace />;
};
// --- Конец хуков ---

// --- ModalWrapper ---
const ModalWrapper = ({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal onClose={handleClose} title={title}>
      {children}
    </Modal>
  );
};
// --- Конец ModalWrapper ---

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background || null;

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        {/* Основные маршруты */}
        <Routes location={backgroundLocation || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          {/* Защищенные маршруты для неавторизованных */}
          <Route
            path='/login'
            element={
              <OnlyUnAuth>
                <Login />
              </OnlyUnAuth>
            }
          />
          <Route
            path='/register'
            element={
              <OnlyUnAuth>
                <Register />
              </OnlyUnAuth>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <OnlyUnAuth>
                <ForgotPassword />
              </OnlyUnAuth>
            }
          />
          <Route
            path='/reset-password'
            element={
              <OnlyUnAuth>
                <ProtectedResetRoute>
                  <ResetPassword />
                </ProtectedResetRoute>
              </OnlyUnAuth>
            }
          />

          {/* Защищенные маршруты для авторизованных */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          {/* Маршруты для прямого перехода */}
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {/* Модальные окна */}
        {backgroundLocation && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <ModalWrapper title='Информация о заказе'>
                  <OrderInfo />
                </ModalWrapper>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <ModalWrapper title='Детали ингредиента'>
                  <IngredientDetails />
                </ModalWrapper>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <ModalWrapper title='Информация о заказе'>
                    <OrderInfo />
                  </ModalWrapper>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;
