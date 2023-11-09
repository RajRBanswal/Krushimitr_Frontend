import React, { useEffect, useState } from 'react';

function Dashboard() {
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        getAllUsers()
    }, [userId]);
    const [users, setUsers] = useState();
    const getAllUsers = async () => {
        const all_users = await fetch(`https://krushimitr.in/users/user-profile/${userId}`);
        const uu = await all_users.json();
        setUsers(uu);
    }
    console.log(users);

  return (
    <div>
        <div className='row'>
            <div className='col-lg-8 m-auto'>
                <div className='card p-4 '>
                    <div className='row'>
                        <div className='col-lg-4 col-8'>
                            { 
                                {/* (users.profile_image == "") ? <img src={users.profile_image_app} width={'100%'} alt="" /> : <img src={`https://krushimitr.in/upload/${users.profile_image}`} width={'100%'} alt="" /> */}
                            }
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