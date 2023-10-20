import React, { useEffect, useState } from 'react'

function AllProducts() {
    const [time, setTime] = useState(false)
    const [isSet, setIsSet] = useState(false);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productSize, setSize] = useState("");
    const [productWeight, setProductWeight] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productOldPrice, setProductOldPrice] = useState("");
    const [productDiscount, setProductDiscount] = useState("");
    const [rupeePer, setRupeePer] = useState("");
    const [productCompany, setProductCompany] = useState("");
    const [gst, setGST] = useState("");
    const [productGuarantee, setProductGuarantee] = useState("");
    const [productWarranty, setProductWarranty] = useState("");
    const [image, setImage] = useState([]);
    const storeProducts = async () => {
        const formData = new FormData();
        formData.append("category", category);
        formData.append("productName", productName);
        formData.append("productDescription", productDescription);
        formData.append("productSize", productSize);
        formData.append("productPrice", productPrice);
        formData.append("productOldPrice", productOldPrice);
        formData.append("productWeight", productWeight);
        formData.append("productDiscount", productDiscount);
        formData.append("rupeePer", rupeePer);
        formData.append("productCompany", productCompany);
        formData.append("gst", gst);
        formData.append("productGuarantee", productGuarantee);
        formData.append("productWarranty", productWarranty);
        formData.append("image", image);
        let result = await fetch("https://krushimitr.in/admin/add-product", {
            method: "POST",
            body: formData,
        }).then(result => result.json());

        if (result.status === 201) {
            setProductName("")
            setProductDescription("")
            setSize("")
            setProductWeight("")
            setProductPrice("")
            setProductOldPrice("")
            setProductDiscount("")
            setProductCompany("")
            setGST("")
            setProductGuarantee("")
            setProductWarranty("")
            setImage("")
            alert(result.result);
            setTime(true);
            setIsSet(false);
        } else {
            alert(result.result);
        }
    }
    const DeleteOne = async (id) => {
        let resultDel = await fetch("https://krushimitr.in/admin/delete-product", {
            method: "post",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(resultDel => resultDel.json());
        if (resultDel.status === 201) {
            alert(resultDel.result);
            setIsSet(false);
            setTime(true);
        } else {
            alert(resultDel.result);
        }
    }
    const updateProduct = async (id) => {
        const formData = new FormData();
        formData.append("category", category);
        formData.append("productName", productName);
        formData.append("productDescription", productDescription);
        formData.append("productSize", productSize);
        formData.append("productPrice", productPrice);
        formData.append("productOldPrice", productOldPrice);
        formData.append("productWeight", productWeight);
        formData.append("productDiscount", productDiscount);
        formData.append("rupeePer", rupeePer);
        formData.append("productCompany", productCompany);
        formData.append("gst", gst);
        formData.append("productGuarantee", productGuarantee);
        formData.append("productWarranty", productWarranty);
        formData.append("image", image);
        formData.append("id", id);

        let result = await fetch("https://krushimitr.in/admin/update-product", {
            method: "POST",
            body: formData,
        }).then(result => result.json());

        if (result.status === 201) {
            alert(result.result);
            setTime(true);
            setIsSet(false);
        } else {
            alert(result.result);
        }
    }
    const getProductData = async () => {
        let all_products = await fetch("https://krushimitr.in/admin/all-products");
        const getProd = await all_products.json();
        if (getProd.status === 201) {
            setProducts(getProd.product_data);
            console.log(getProd.product_data);
        } else {
            setProducts(getProd.result);
        }
    };
    const [cate, setCate] = useState([]);
    const getCategoryData = async () => {
        let all_category = await fetch("https://krushimitr.in/admin/all-category");
        const getCat = await all_category.json();
        setCate(getCat.getCate);
    };
    useEffect(() => {
        getCategoryData();
        getProductData();
        setTime(false);
    }, [time])
    return (
        <>
            <div className="card p-3">
                <div className='row'>
                    <div className='col-lg-8'>
                        <h2 className='text-uppercase'>All Products</h2>
                    </div>
                    <div className='col-lg-4'>
                        <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" onClick={() => setIsSet(true)} data-bs-target="#exampleModal">Add Product</button>
                    </div>
                </div>
                <hr />
                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <table className="table table-hover table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Category</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Size</th>
                                <th scope="col">Price / Old Price</th>
                                <th scope="col">Weight</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Image</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product.category}</td>
                                        <td>{product.productName}</td>
                                        <td>{product.size}</td>
                                        <td>{product.price}₹  / {product.oldPrice}₹</td>
                                        <td>{product.weight}</td>
                                        <td>{product.discount} {product.percentSbl}</td>
                                        <td><img src={`https://krushimitr.in/upload/${product.image}`} width={'100px'} alt={product.category_image} /></td>
                                        <td><button type="button" className='btn btn-primary btn-sm me-1' data-bs-toggle="modal" data-bs-target={`#editModal` + product._id}><i class="fas fa-edit"></i></button>
                                            <button type="button" className='btn btn-danger btn-sm' onClick={() => DeleteOne(product._id)}><i class="fa fa-trash" aria-hidden="true"></i></button></td>
                                        <div className="modal fade" id={`editModal` + product._id} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-lg">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="editModalLabel">Update Category</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body p-4">
                                                        <div className='row'>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Category</label>
                                                                <select name="category" onChange={(e) => setCategory(e.target.value)} className='form-control form-select' >
                                                                    <option value={product.category}>{product.category}</option>
                                                                    {
                                                                        cate.map(cc => (
                                                                            <option key={cc._id} value={cc.category_name}>{cc.category_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Products Name</label>
                                                                <input type="text" name="category" defaultValue={product.productName} onChange={(e) => setProductName(e.target.value)} placeholder='Products Name' className='form-control' />
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-lg-8'>
                                                                <label htmlFor="">Description</label>
                                                                <input type="text" name="desc" defaultValue={product.description} onChange={(e) => setProductDescription(e.target.value)} placeholder='Description' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label htmlFor="">Size</label>
                                                                <input type="text" name="size" defaultValue={product.size} onChange={(e) => setSize(e.target.value)} placeholder='Size' className='form-control' />
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Price</label>
                                                                <input type="text" name="price" defaultValue={product.price} onChange={(e) => setProductPrice(e.target.value)} placeholder='Price' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Old Price</label>
                                                                <input type="text" name="old_price" defaultValue={product.oldPrice} onChange={(e) => setProductOldPrice(e.target.value)} placeholder='Old Price' className='form-control' />
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-lg-6 col-6'>
                                                                <label htmlFor="">Weight</label>
                                                                <input type="text" name="weight" defaultValue={product.weight} onChange={(e) => setProductWeight(e.target.value)} placeholder='Weight' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-4 col-4'>
                                                                <label htmlFor="">Discount</label>
                                                                <input type="text" name="desc" defaultValue={product.discount} onChange={(e) => setProductDiscount(e.target.value)} placeholder='Discount' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-2 col-2'>
                                                                <label htmlFor="">% / ₹</label>
                                                                <select name="desc" onChange={(e) => setRupeePer(e.target.value)} className='form-control form-select' >
                                                                    <option value={product.percentSbl}>{product.percentSbl}</option>
                                                                    <option value="₹">₹</option>
                                                                    <option value="%">%</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className='row mt-3'>
                                                            <div className='col-lg-6'>
                                                                <label htmlFor="">Products Image</label>
                                                                <input type="file" name="product_img" multiple accept="image/*" onChange={(e) => setImage(e.target.files)} placeholder='Product Image' className='form-control' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <img src={`https://krushimitr.in/upload/${product.image}`} width={'100px'} alt={product.category_image} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" onClick={() => updateProduct(product._id)} data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
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
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-secondary py-2">
                                <h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Add Products</h1>
                                <button type="button" className="btn-close text-white pt-4" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Category</label>
                                        <select name="category" onChange={(e) => setCategory(e.target.value)} className='form-control form-select' >
                                            <option value=''>Select Category</option>
                                            {
                                                cate.map(cc => (
                                                    <option key={cc._id} value={cc.category_name}>{cc.category_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Products Name </label>
                                        <input type="text" name="productName" onChange={(e) => setProductName(e.target.value)} placeholder='Products Name' className='form-control' required />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-8'>
                                        <label htmlFor="">Description</label>
                                        <input type="text" name="desc" onChange={(e) => setProductDescription(e.target.value)} placeholder='Description' className='form-control' />
                                    </div>
                                    <div className='col-lg-4'>
                                        <label htmlFor="">Size</label>
                                        <input type="text" name="size" onChange={(e) => setSize(e.target.value)} placeholder='Size' className='form-control' />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-4'>
                                        <label htmlFor="">Product Company</label>
                                        <input type="text" name="company" onChange={(e) => setProductCompany(e.target.value)} placeholder='Product Company' className='form-control' />
                                    </div>
                                    <div className='col-lg-4'>
                                        <label htmlFor="">GST</label>
                                        <select name="gst" onChange={(e) => setGST(e.target.value)}  className='form-control form-select'>
                                            <option value={""}>Select GST</option>
                                            <option value={"0"}>0%</option>
                                            <option value={"5"}>5%</option>
                                            <option value={"12"}>12%</option>
                                            <option value={"18"}>18%</option>
                                            <option value={"28"}>28%</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Price</label>
                                        <input type="text" name="price" onChange={(e) => setProductPrice(e.target.value)} placeholder='Price' className='form-control' required />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Old Price</label>
                                        <input type="text" name="old_price" onChange={(e) => setProductOldPrice(e.target.value)} placeholder='Old Price' className='form-control' />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Guarantee</label>
                                        <input type="text" name="Guarantee" onChange={(e) => setProductGuarantee(e.target.value)} placeholder='Guarantee' className='form-control' />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label htmlFor="">Warranty</label>
                                        <input type="text" name="warranty" onChange={(e) => setProductWarranty(e.target.value)} placeholder='Warranty' className='form-control' />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-6 col-6'>
                                        <label htmlFor="">Weight</label>
                                        <input type="text" name="weight" onChange={(e) => setProductWeight(e.target.value)} placeholder='Weight' className='form-control' />
                                    </div>
                                    <div className='col-lg-4 col-4'>
                                        <label htmlFor="">Discount</label>
                                        <input type="text" name="desc" onChange={(e) => setProductDiscount(e.target.value)} placeholder='Discount' className='form-control' />
                                    </div>
                                    <div className='col-lg-2 col-2'>
                                        <label htmlFor="">% / ₹</label>
                                        <select name="desc" onChange={(e) => setRupeePer(e.target.value)} className='form-control form-select' >
                                            <option value="" selected>Select</option>
                                            <option value="₹">₹</option>
                                            <option value="%">%</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <label htmlFor="">Products Image</label>
                                    <input type="file" name="product_img" multiple accept="image/*" onChange={(e) => setImage(e.target.files)} placeholder='Product Image' className='form-control' />
                                </div>
                            </div>
                            <div className="modal-footer py-1">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onClick={storeProducts} data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllProducts