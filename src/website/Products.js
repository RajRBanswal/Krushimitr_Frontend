import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

function Products() {
    const params = useParams();
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const getProductData = async () => {

            let all_products = await fetch(`https://krushimitr.in/admin/products/${params.name}`);
            const getProd = await all_products.json();
            if (getProd.status === 201) {
                setProduct(getProd.product_data);
            } else {
                setProduct(getProd.result);
            }
        }
        getProductData()
    }, [params]);


    return (
        <>
            {/* <!-- About Start --> */}
            <div className="container-fluid about pt-5">
                <div className="container productView">
                    <h1>{params.name}</h1>

                    <div className='row'>

                        {product.map((item) => (

                            <div className='col-lg-6 mt-3'>
                                <div className='card h-100'>
                                    <div className='row'>
                                        <div className='col-lg-5 '>
                                            <img src={`https://krushimitr.in/upload/${item.image}`} style={{ width: '100%', height: '200px' }} alt={item.image} />
                                        </div>
                                        <div className='col-lg-7'>
                                            <div className='pt-3'>
                                                <p className='text-dark fw-bold mb-2'>{item.productName} ( {item.weight}g)</p>
                                                <p className='mb-2'><label className="text-primary fw-bold mb-0"><i className='fa fa-rupee' ></i>{item.price}</label> &nbsp;  {item.oldPrice ? <del className=''><i className='fa fa-rupee' ></i>{item.oldPrice}</del> : ''}</p>
                                                <Link className="btn btn-primary mx-1 btn-sm" to=""><i className="fas fa-cart-plus"></i></Link>
                                                <Link className="btn btn-secondary mx-1 btn-sm" to="#" data-bs-toggle="modal" data-bs-target={'#ViewModal' + item._id}><i className="bi bi-eye"></i></Link>

                                                <div class="modal fade" id={'ViewModal' + item._id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog modal-lg">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Product Details</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <div className='row'>
                                                                    <div className='col-lg-6'>
                                                                        <label><b>Product Name :</b> {item.productName}</label>
                                                                    </div>
                                                                    <div className='col-lg-6'>
                                                                        <label><b>Description :</b> {item.description}</label>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                <div className='row'>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Product Company :</b> {item.company}</label>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Weight :</b> {item.weight}</label>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Size :</b> {item.size}</label>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                <div className='row'>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Price :</b> {item.price}</label>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Old Price :</b> {item.oldPrice}</label>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Discount :</b> {item.discount} {item.percentSbl}</label>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                <div className='row'>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Guarantee :</b> {item.guarantee}</label>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>Warranty :</b> {item.warranty}</label>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        <label><b>GST :</b> {item.gst}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* category */}
                                                            {/* productName
description
size
weight
image */}
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                <button type="button" class="btn btn-primary">Save changes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='productPercentage'>
                                        {item.discount ? <span>{item.discount}{item.percentSbl}</span> : ''}
                                    </div>
                                </div>

                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            {/* <!-- About End --> */}
        </>
    )
}

export default Products