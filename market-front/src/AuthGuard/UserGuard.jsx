import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';

export default function UserGuard() {
  const { user, loading } = useSelector((state) => state.account);
  const location = useLocation();

  useEffect(() => {
    console.log('🔐 UserGuard check:', {
      user: user ? { id: user.id, role: user.role } : null,
      loading,
      currentPath: location.pathname
    });
  }, [user, loading, location.pathname]);

  // Yükleme durumunda bekle
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // Kullanıcı yoksa login sayfasına yönlendir
  if (!user) {
    console.log('🚫 UserGuard: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kullanıcı varsa, fakat geçerli rol değilse anasayfaya yönlendir
  if (user.role !== "admin" && user.role !== "user") {
    console.log('🚫 UserGuard: Invalid role, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ UserGuard: Access granted');
  // Kullanıcı varsa ve admin veya normal kullanıcı ise erişime izin ver
  return <Outlet />;
}
