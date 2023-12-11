import React, { useEffect, useState } from 'react'

function AllSlider() {
    const [time, setTime] = useState(false)
    const [isSet, setIsSet] = useState(false);
    const [subHeading, setSubHeading] = useState("");
    const [heading, setHeading] = useState("");
    const [image, setImage] = useState("");

    const storeSlider = async () => {
        let formData = new FormData();
        formData.append("heading", heading);
        formData.append("subHeading", subHeading);
        formData.append("image", image);
        const result = await fetch("https://krushimitr.in/admin/add-slider", {
            method: "POST",
            body: formData,
        }).then(result => result.json());
        if (result.status === 201) {
            alert(result.result);
        } else {
            alert(result.result);
        }

    }
    const updateProduct = async (id) => {
        let formData = new FormData();
        formData.append("heading", heading);
        formData.append("subHeading", subHeading);
        formData.append("image", image);
        formData.append("id", id);
        const result = await fetch("https://krushimitr.in/admin/update-slider", {
            method: "POST",
            body: formData,
        }).then(result => result.json());
        if (result.status === 201) {
            alert(result.result);
        } else {
            alert(result.result);
        }
    }
    const DeleteOne = async (id) => {
        let resultDel = await fetch("https://krushimitr.in/admin/delete-slider", {
            method: "post",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(resultDel => resultDel.json());
        if (resultDel.status === 201) {
            alert(resultDel.result);
            setTime(true);
            setIsSet(false);
        } else {
            alert(resultDel.result);
        }
    }

    const [slider, setSlider] = useState([]);
    const getSliderData = async () => {
        let all_slider = await fetch("https://krushimitr.in/admin/all-slider");
        const getSlider = await all_slider.json();
        setSlider(getSlider.getSlider);
    };
    useEffect(() => {
        getSliderData();
        setTime(false);
    }, [time])
    return (
        <>
            <div className="card p-3">
                <div className='row'>
                    <div className='col-lg-8'>
                        <h2 className='text-uppercase'>All Slider Data</h2>
                    </div>
                    <div className='col-lg-4'>
                        <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" onClick={() => setIsSet(true)} data-bs-target="#exampleModal">Add Slider</button>
                    </div>
                </div>
                <hr />
                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <table className="table table-hover table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Heading</th>
                                <th scope="col">Sub Heading</th>
                                <th scope="col">Image</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                slider.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.heading}</td>
                                        <td>{item.sub_heading}</td>
                                        <td><img src={`https://krushimitr.in/upload/${item.slider_image}`} width={'100px'} alt={item.slider_image} /></td>
                                        <td><button type="button" className='btn btn-primary me-1' data-bs-toggle="modal" data-bs-target={`#editModal` + item._id}><i className="fas fa-edit"></i></button>
                                            <button type="button" className='btn btn-danger' onClick={() => DeleteOne(item._id)}><i className="fa fa-trash" aria-hidden="true"></i></button></td>
                                        <div className="modal fade" id={`editModal` + item._id} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-lg">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="editModalLabel">Update Category</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body p-4">
                                                        <div className='row'>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Heading</label>
                                                                <input type="text" name="heading" defaultValue={item.heading} onChange={(e) => setHeading(e.target.value)} placeholder='Heading' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Sub Heading </label>
                                                                <input type="text" name="subHeading" defaultValue={item.sub_heading} onChange={(e) => setSubHeading(e.target.value)} placeholder='Sub Heading' className='form-control' />
                                                            </div>
                                                        </div>

                                                        <div className='row mt-3'>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Slider Image</label>
                                                                <input type="file" name="slider_img" accept="image/*" onChange={(e) => setImage(e.target.files[0])} placeholder='Product Image' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <img src={`https://krushimitr.in/upload/${item.slider_image}`} width={'150px'} alt={item.slider_image} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" onClick={() => updateProduct(item._id)} data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
                <div className={`modal fade ${isSet ? 'show' : ''} `} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-secondary py-2">
                                <h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Add Slider Image</h1>
                                <button type="button" className="btn-close text-white pt-4" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Heading</label>
                                        <input type="text" name="heading" onChange={(e) => setHeading(e.target.value)} placeholder='Heading' className='form-control' />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Sub Heading </label>
                                        <input type="text" name="subHeading" onChange={(e) => setSubHeading(e.target.value)} placeholder='Sub Heading' className='form-control' />
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Products Image</label>
                                        <input type="file" name="product_img" accept="image/*" onChange={(e) => setImage(e.target.files[0])} placeholder='Product Image' className='form-control' />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer py-1">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onClick={storeSlider} className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllSlider