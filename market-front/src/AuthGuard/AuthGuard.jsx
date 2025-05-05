import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

export default function AuthGuard() {
  const { user } = useSelector(state => state.account);

  // Kullanıcı yoksa login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" />
  }

  // Kullanıcı varsa ama admin değilse anasayfaya yönlendir (veya başka bir yere)
  if (user.role !== "admin") {
    return <Navigate to="/" />
  }

  // Adminse erişime izin ver
  return <Outlet />
}
