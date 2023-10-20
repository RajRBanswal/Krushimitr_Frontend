import { City, State } from 'country-state-city';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function UserRegister() {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [cityCode, setCityCode] = useState([]);
    const [profileImage, setProfileImage] = useState([]);

    const StoreData = async(e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("mobile", mobile);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("address", address);
            formData.append("pincode", pincode);
            formData.append("profile_image", profileImage);
            const result = await fetch("https://krushimitr.in/users/user-register",{
                method:"post",
                body:formData,
            }).then(result=>result.json());
            if(result.status === 201){
                alert(result.result);
                
            }else{
                alert(result.result);
            }
        } catch (error) {
            
        }
    }

    const onChangeHandler = (e) => {
        setCityCode("");
        setState("");
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index]
        const cityCode = el.getAttribute('id');
        setCityCode(cityCode);
        setState(el.getAttribute('value'));
    }

    return (
        <>
            <div className='main_div py-5 h-100 w-100'>
                <div className='container py-5'>
                    <div className='row'>
                        <ToastContainer />
                        <div className='col-lg-8 m-auto'>
                            <div className='card' style={{ borderRadius: 0 }}>
                                <div className="card-body">
                                    <h3 className='text-center text-uppercase text-primary fw-bold'>Register Form</h3>
                                    <hr />
                                    <div className='row g-5'>
                                        <div className='col-lg-6 col-6'>
                                            <label>Name</label>
                                            <input type='text' className='form-control' name='name' onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className='col-lg-6 col-6'>
                                            <label>Email</label>
                                            <input type='text' className='form-control' name='email' onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className='row g-5'>
                                        <div className='col-lg-6 col-6'>
                                            <label>Mobile No.</label>
                                            <input type='number' className='form-control' name='mobile' onChange={(e) => setMobile(e.target.value)} />
                                        </div>
                                        <div className='col-lg-6 col-6'>
                                            <label htmlFor="name" className="form-label">State</label>
                                            <select class="form-select form-control" onChange={onChangeHandler}>
                                                {
                                                    State.getStatesOfCountry('IN').map(state => (
                                                        <option id={state.isoCode} value={state.name}>{state.name} </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                    </div>
                                    <div className='row g-5'>
                                        <div className='col-lg-3 col-6'>
                                            <label htmlFor="name" className="form-label">City</label>
                                            <select class="form-select form-control" onChange={(e) => setCity(e.target.value)}>
                                                {
                                                    City.getCitiesOfState('IN', cityCode).map(city => (
                                                        < option value={city.name} > {city.name} </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='col-lg-6 col-6'>
                                            <label>Address</label>
                                            <input type='text' className='form-control' name='address' onChange={(e) => setAddress(e.target.value)} />
                                        </div>
                                        <div className='col-lg-3 col-6'>
                                            <label>Pin Code</label>
                                            <input type='text' className='form-control' name='pincode' onChange={(e) => setPincode(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='row g-5'>
                                        <div className='col-lg-6 col-6'>
                                            <label>Password</label>
                                            <input type='password' className='form-control' name='address' onChange={(e) => setPassword(e.target.value)} required />
                                        </div>
                                        <div className='col-lg-6 col-6'>
                                            <label>Profile Image</label>
                                            <input type='file' className='form-control' name='profileImage' onChange={(e) => setProfileImage(e.target.files[0])} required />
                                        </div>
                                    </div>
                                    <div className='form-group mt-3 text-center'>
                                        <button type="button" onClick={StoreData} className="btn btn-danger">Submit</button>

                                    </div>
                                    <div className='row mt-1'>
                                        <div className='col-lg-12 col-12'>
                                            <p>You have an already account? <Link to={"/user_login"}>Login here...</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserRegister