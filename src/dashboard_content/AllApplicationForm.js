import React, { useEffect, useState } from 'react'

function AllApplicationForm() {
    const [time, setTime] = useState(false)
    const deleteApplication = async (id) => {
        let resultDel = await fetch("https://krushimitr.in/admin/delete-application-form", {
            method: "post",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(resultDel => resultDel.json());
        if (resultDel.status === 201) {
            alert(resultDel.result);
            setTime(true);
        } else {
            alert(resultDel.result);
        }
    }
    const [allData, setAllData] = useState([]);
    useEffect(() => {
        const getAllApplication = async () => {
            const result = await fetch("https://krushimitr.in/admin/all-application-form").then(result => result.json());
            console.log(result.AddShopForm);
            setAllData(result.AddShopForm);
        }
        getAllApplication();
    }, [time])
    return (
        <>
            <div className="card p-3">
                <div className='row'>
                    <div className='col-lg-8'>
                        <h2 className='text-uppercase'>All NEWS</h2>
                    </div>
                    <div className='col-lg-4'>
                        {/* <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" onClick={() => setIsSet(true)} data-bs-target="#exampleModal">Add NEWS</button> */}
                    </div>
                </div>
                <hr />

                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <table className="table table-hover table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Mobile</th>
                                <th scope="col">Email</th>
                                <th scope="col">Type of License</th>
                                <th scope="col">License Image</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allData.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.mobile}</td>
                                        <td>{item.email}</td>
                                        <td>{item.type_of_license}</td>
                                        <td><img src={`https://krushimitr.in/upload/${item.license_image}`} width={'100px'} alt={item.license_image} /></td>
                                        <td>
                                            <button type="button" className='btn btn-primary btn-sm me-1' data-bs-toggle="modal" data-bs-target={`#editModal` + item._id}><i className="fas fa-edit"></i></button>
                                            <button type="button" onClick={() => deleteApplication(item._id)} className='btn btn-danger btn-sm me-1' ><i className="fas fa-trash"></i></button>
                                        </td>


                                    </tr>

                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    )
}

export default AllApplicationForm