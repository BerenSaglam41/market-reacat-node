import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'

export default function AuthGuard() {
  const { user, status } = useSelector(state => state.account);
  const location = useLocation();

  useEffect(() => {
    console.log('🔒 AuthGuard (Admin) check:', {
      user: user ? { id: user.id || user._id, role: user.role } : null,
      status,
      currentPath: location.pathname
    });
  }, [user, status, location.pathname]);

  // Yükleme durumunda bekle
  if (status === 'pending') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column'
      }}>
        <div>Yükleniyor...</div>
        <small>Admin yetkileri kontrol ediliyor</small>
      </div>
    );
  }

  // Kullanıcı yoksa login sayfasına yönlendir
  if (!user) {
    console.log('🚫 AuthGuard: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Kullanıcı varsa ama admin değilse anasayfaya yönlendir
  if (user.role !== "admin") {
    console.log('🚫 AuthGuard: Not admin (role:', user.role, '), redirecting to home');
    return <Navigate to="/" replace />
  }
  
  console.log('✅ AuthGuard: Admin access granted');
  // Adminse erişime izin ver
  return <Outlet />
}
