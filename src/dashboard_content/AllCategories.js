import React, { useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


function AllCategories() {
    const [category_name, setCategory] = useState("");
    const [isSet, setIsSet] = useState(false);
    const [quote, setQuote] = useState(false);
    const [update_name, setUpdateCategory] = useState("");
    const [image, setImage] = useState("");


    const storeCategory = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("category_name", category_name);
        formData.append("image", image);
        let result = await fetch("https://krushimitr.in/admin/add-category", {
            method: "post",
            body: formData,

        }).then(result => result.json());

        if (result.status === 201) {
            alert(result.result);
  
            setIsSet(false)
            setCategory("");
            setQuote(true);
        } else {
            alert(result.result);
        }
    }
    const updateCategory = async (id) => {
        const formData = new FormData();
        formData.append('update_name',update_name);
        formData.append('image',image);
        formData.append('id',id);
        let resultUpdate = await fetch("https://krushimitr.in/admin/update-category", {
            method: "POST",
            body: formData,
           
        }).then(resultUpdate => resultUpdate.json());
        console.log(resultUpdate);

        if (resultUpdate.status === 201) {
            setIsSet(false)
            alert(resultUpdate.result);
            setCategory("");
            setQuote(true);
        } else {
            alert(resultUpdate.result);
        }
    }
    const DeleteOne = async (id) => {
        let resultDel = await fetch("https://krushimitr.in/admin/delete-category", {
            method: "post",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(resultDel => resultDel.json());

        if (resultDel.status === 201) {
            alert(resultDel.result);
            setQuote(true);
        } else {
            alert(resultDel.result);
        }
    }

    const [cate, setCate] = useState([]);
    const getCategoryData = async () => {
        let all_category = await fetch("https://krushimitr.in/admin/all-category");
        const getCat = await all_category.json();
        setCate(getCat.getCate);
    };
    useEffect(() => {
        getCategoryData();
        setQuote(false);
    }, [quote])


    return (
        <>
            <div className="card p-3">
                <div className='row'>
                    <div className='col-lg-8'>
                        <h2 className='text-uppercase'>All Categories</h2>
                    </div>
                    <div className='col-lg-4'>
                        <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" onClick={() => setIsSet(true)} data-bs-target="#exampleModal">Add Category</button>
                    </div>
                </div>
                <hr />
                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <table className="table table-hover table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Category Name</th>
                                <th scope="col">Category Image</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cate.map(ca => (
                                    <tr key={ca._id}>
                                        <td>{ca.category_name}</td>
                                        <td><img src={`https://krushimitr.in/upload/${ca.category_image}`} width={'100px'} alt={ca.category_image} /></td>
                                        <td><button type="button" className='btn btn-primary me-1' data-bs-toggle="modal" data-bs-target={`#editModal` + ca._id}><i className="fas fa-edit"></i></button>
                                            <button type="button" onClick={() => DeleteOne(ca._id)} className='btn btn-danger' ><i className="fa fa-trash" aria-hidden="true"></i></button></td>
                                        <div className="modal fade" id={`editModal` + ca._id} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="editModalLabel">Update Category</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body p-4">
                                                        <div className='row'>
                                                            <label htmlFor="">Category Name</label>
                                                            <input type="text" defaultValue={ca.category_name} onChange={(e) => setUpdateCategory(e.target.value)} name="categoty" className='form-control' />
                                                        </div>
                                                        <div className='row mt-3'>
                                                            <label htmlFor="">Category Image (Size : 100 * 100)</label>
                                                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className='form-control' />
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" onClick={() => updateCategory(ca._id)} data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </tr>

                                ))}
                        </tbody>
                    </table>
                </div>
                <div className={`modal fade ${isSet ? 'show' : ''} `} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Category</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className='row'>
                                    <label htmlFor="">Category Name</label>
                                    <input type="text" name="category" onChange={(e) => setCategory(e.target.value)} placeholder='Category Name' className='form-control' />
                                </div>
                                <div className='row mt-3'>
                                    <label htmlFor="">Category Image (Size : 100 * 100)</label>
                                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className='form-control' />
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onClick={storeCategory} className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default AllCategories