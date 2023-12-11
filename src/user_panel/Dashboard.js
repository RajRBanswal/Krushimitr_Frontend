import React, { useEffect, useState } from 'react';

function Dashboard() {
    let userId = "";
    useEffect(() => {
        userId = localStorage.getItem('user_id');
        getAllUsers()
    }, []);
    console.log(userId);
    const [users, setUsers] = useState("");
    const getAllUsers = async () => {
        const all_users = await fetch(`https://krushimitr.in/users/user-profile/${userId}`);
        const uu = await all_users.json();
        console.log(uu);
        setUsers(uu);
    }
    
  return (
    <div>
        <div className='row'>
            <div className='col-lg-4'>
                <div className='card bg-primary p-3 text-center'>
                    <h3>Total Orders</h3>
                    <h4>10</h4>
                </div>
            </div>
            <div className='col-lg-4'>
                <div className='card bg-warning p-3 text-center'>
                    <h3>Complete Orders</h3>
                    <h4>10</h4>
                </div>
            </div>
            <div className='col-lg-4'>
                <div className='card bg-danger p-3 text-center'>
                    <h3 className='text-white'>Pending Orders</h3>
                    <h4 className='text-white'>10</h4>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard