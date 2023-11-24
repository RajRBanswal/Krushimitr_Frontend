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
            <div className='col-lg-8 m-auto'>
                <div className='card p-4 '>
                    <div className='row'>
                        <div className='col-lg-4 col-8'>

                        </div>
                    </div>
                    {/* <h3 className='text-center'>{users.name}</h3> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard