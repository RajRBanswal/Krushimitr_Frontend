import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function News() {
    const [time, setTime] = useState(false);
    const [newsData, setNewsData] = useState("");
    const [isSet, setIsSet] = useState(false);
    const [newsTitle, setNewsTitle] = useState("");
    const [newsDescription, setNewsDescription] = useState("");
    const [image, setImage] = useState([]);
    const [newsDate, setNewsDate] = useState("");
    const [allNews, setAllNews] = useState([]);
    const [newsLink, setNewsLink] = useState([]);
    
console.log(newsDate);
    const storeNEWS = async () => {
        const formData = new FormData();
        formData.append("newsTitle", newsTitle);
        formData.append("newsDescription", newsDescription);
        Object.values(image).forEach(file => {
            formData.append("multi_image", file);
        });
        formData.append("newsDate", newsDate);
        formData.append("newsLink", newsLink);
        // const result = await fetch("https://krushimitr.in/admin/add-news", {
        const result = await fetch("https://krushimitr.in/admin/add-news", {
            method: "POST",
            body: formData,
        }).then(result => result.json());
        if (result.status === 201) {
            setIsSet(true);
            alert(result.result);
        } else {
            alert(result.result);
        }
    }
    const DeleteOne = async (id) => {
        let resultDel = await fetch("https://krushimitr.in/admin/delete-news", {
            method: "post",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(resultDel => resultDel.json());
        if (resultDel.status === 201) {
            setIsSet(true);
            alert(resultDel.result);
        } else {
            alert(resultDel.result);
        }
    }
    const getNEWSData = async () => {
        const result = await fetch("https://krushimitr.in/admin/get-news").then(result => result.json());
        setAllNews(result.getNEWS);
    }
    useEffect(() => {
        getNEWSData();
    }, [isSet])
    return (
        <>
            <div className="card p-3">
                <div className='row'>
                    <div className='col-lg-8'>
                        <h2 className='text-uppercase'>All NEWS</h2>
                    </div>
                    <div className='col-lg-4'>
                        <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" onClick={() => setIsSet(true)} data-bs-target="#exampleModal">Add NEWS</button>
                    </div>
                </div>
                <hr />

                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <table className="table table-hover table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">NEWS</th>
                                <th scope="col">Description</th>
                                <th scope="col">Date</th>
                                <th scope="col">Link</th>
                                <th scope="col">Image</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allNews.map((news) => (
                                    <tr key={news._id}>
                                        <td>{news.news_title}</td>
                                        <td>{news.news_description}</td>
                                        <td>{news.news_date}</td>
                                        <td>{news.news_link}</td>
                                        <td><img src={`https://krushimitr.in/upload/${news.news_image[0]}`} width={'100px'} alt={news.category_image} /></td>
                                        <td>
                                        <button type="button" className='btn btn-primary btn-sm me-1' data-bs-toggle="modal" data-bs-target={`#editModal` + news._id}><i class="fas fa-edit"></i></button>
                                        <button type="button" onClick={()=>DeleteOne(news._id)} className='btn btn-danger btn-sm me-1' ><i class="fas fa-trash"></i></button>
                                        </td>
                                          

                                    </tr>

                                ))}
                        </tbody>
                    </table>
                </div>


                <div className={`modal fade ${isSet ? 'show' : ''} `} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-secondary py-2">
                                <h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Add NEWS</h1>
                                <button type="button" className="btn-close text-white pt-4" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className='row'>
                                    <div className='col-lg-8'>
                                        <label htmlFor="">NEWS Title </label>
                                        <input type="text" name="productName" onChange={(e) => setNewsTitle(e.target.value)} placeholder='NEWS Title' className='form-control' required />
                                    </div>
                                    <div className='col-lg-4'>
                                        <label htmlFor="">Date</label>
                                        <DatePicker selected={newsDate} onChange={(date) => setNewsDate(date)} dateFormat={"dd-MM-yyyy"} className='form-control' />
                                        {/* <input type="date" name="date" onChange={(e) => setNewsDate(e.target.value)} placeholder='Date' className='form-control' /> */}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <label htmlFor="">Description</label>
                                        <textarea name="desc" onChange={(e) => setNewsDescription(e.target.value)} placeholder='Description' className='form-control' ></textarea>
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col-lg-8'>
                                        <label htmlFor="">News Link</label>
                                        <input type="text" name="news_link"  onChange={(e) => setNewsLink(e.target.value)} placeholder='News Link' className='form-control' />
                                    </div>
                                    <div className='col-lg-4'>
                                        <label htmlFor="">News Image</label>
                                        <input type="file" name="product_img" multiple accept="image/*" onChange={(e) => setImage(e.target.files)} placeholder='Product Image' className='form-control' />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer py-1">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onClick={storeNEWS} data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default News