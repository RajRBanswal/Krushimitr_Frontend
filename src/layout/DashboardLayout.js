import React, { Suspense, useEffect, useState } from 'react';
// import Nav from '../components/Nav';
import MainContent from '../components/MainContent';
// import SideNav from '../components/SideNav';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashboard from '../dashboard_content/Dashboard';

function DashboardLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const user_id = localStorage.getItem('admin_id');
    if (!user_id) {
      setAdmin(false)
      navigate("/admin-login");
    } else {
      setAdmin(true)
    }
  },[])
  return (
    <>
          <Suspense fallback={<Dashboard />}>
            <MainContent />
          </Suspense>
    </>
  )
}

export default DashboardLayout