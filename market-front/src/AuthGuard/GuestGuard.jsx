import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestGuard() {
  const { user } = useSelector((state) => state.account);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
