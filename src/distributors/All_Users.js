import React, { useEffect, useState } from 'react'

function All_Users() {
    // const [tt, setTT] = useState(false);
    // const [users, setUsers] = useState([]);
    // const getAllUsers = async () => {
    //     const all_users = await fetch('https://krushimitr.in/admin/all-users');
    //     const uu = await all_users.json();
    //     console.log(uu);
    //     setUsers(uu);
    // }
    // useEffect(() => {
    //     getAllUsers()
    //     // setTT(false)
    // }, []);

    return (
        <>
            <div className="card p-3">
                <div className='row'>
                    <div className='col-lg-8'>
                        <h2 className='text-uppercase'>All Users</h2>
                    </div>
                    <div className='col-lg-4'>
                        <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" data-bs-target="#exampleModal">Add User</button>
                    </div>
                </div>
                <hr />
                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <table id="example" className="table table-striped" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.mobile}</td>
                                        <td></td>
                                    </tr>
                                ))
                            } */}

                        </tbody>

                    </table>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" data-bs-config={{ backdrop: true }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default All_Users