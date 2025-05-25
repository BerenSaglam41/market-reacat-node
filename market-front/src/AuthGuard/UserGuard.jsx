import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';

export default function UserGuard() {
  const { user, status } = useSelector((state) => state.account);
  const location = useLocation();

  useEffect(() => {
    console.log('🔐 UserGuard check:', {
      user: user ? { id: user.id || user._id, role: user.role, email: user.email } : null,
      status,
      currentPath: location.pathname,
      localStorage: localStorage.getItem('user') ? 'exists' : 'null'
    });
  }, [user, status, location.pathname]);

  // Yükleme durumunda bekle
  if (status === 'pending') {
    console.log('🔄 UserGuard: Loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column'
      }}>
        <div>Yükleniyor...</div>
        <small>Kullanıcı bilgileri kontrol ediliyor</small>
      </div>
    );
  }

  // Kullanıcı yoksa login sayfasına yönlendir
  if (!user) {
    console.log('🚫 UserGuard: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kullanıcı varsa, fakat geçerli rol değilse anasayfaya yönlendir
  if (user.role !== "admin" && user.role !== "user") {
    console.log('🚫 UserGuard: Invalid role:', user.role, 'redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ UserGuard: Access granted for', user.role);
  // Kullanıcı varsa ve admin veya normal kullanıcı ise erişime izin ver
  return <Outlet />;
}
