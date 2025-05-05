import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

export default function UserGuard() {
  const { user } = useSelector((state) => state.account);

  // Kullanıcı yoksa login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kullanıcı varsa, fakat admin değilse anasayfaya yönlendir
  if (user.role !== "admin" && user.role !== "user") {
    return <Navigate to="/" />;
  }

  // Kullanıcı varsa ve admin veya normal kullanıcı ise erişime izin ver
  return <Outlet />;
}
