import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';

import '../css/fan-edit-page.css';
import Nav from './Nav';
import Photo from './sub-components/fan-edit-page/Photo';
import Bio from './sub-components/fan-edit-page/Bio';
import BioEditForm from './sub-components/fan-edit-page/BioEditForm';
import PhotoUploadForm from './sub-components/fan-edit-page/PhotoUploadForm';
import {USER_ID} from '../store/actions/authentication';


const FanEditPage = ({
    user, 
    follows, 
    currentImgUrl, 
    name, 
    currentBio, 
    uploadPhoto, 
    deletePhoto,
    editBio,
    deleteFollow }) => {

    console.log("IN FAN EDIT PAGE!!!");

    const userId = localStorage.getItem(USER_ID);
    // const dispatch = useDispatch();
    const [isUploadPhotoFormVisible, setIsUploadPhotoFormVisible] = useState(false);
    const [isBioEditFormVisible, setIsBioEditFormVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [imgUrl, setImgUrl] = useState(currentImgUrl);
    const [bio, setBio] = useState(currentBio);
    

    // HANDLE UPLOAD PHOTO BUTTON
    const handleUploadPhotoBtn = (e) => {
        console.log("upload button clicked!");
        setIsUploadPhotoFormVisible(true);
    }


    // HANDLE DELETE PHOTO BUTTON
    const handleDeletePhotoBtn = (e) => {
        console.log("delete button clicked!");
        (async () => {
            const nullUrl = await deletePhoto();
            setImgUrl(nullUrl);
        })();
    }
    

    // HANDLE PHOTO SUBMIT BUTTON
    const handlePhotoSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", image);
        
        setIsUploadPhotoFormVisible(false);
   
        (async () => {
            const url = await uploadPhoto(data);
            setImgUrl(url);
        })();
    }


    // HANDLE BIO EDIT BUTTON
    const handleBioEditBtn = (e) => {
        setIsBioEditFormVisible(true);
    }
    

    // UPDATE ON CHANGE
    const updateProperty = (callback) => (e) => {
        callback(e.target.value);
        console.log("BIO", bio);
    };


    // HANDLE BIO SUBMIT
    const handleBioSubmitBtn = (e) => {
        e.preventDefault();
        const data = { bio };
    
        (async () => {
            const newBio = await editBio(data);
            setBio(newBio);
        })()

        setIsBioEditFormVisible(false);
    }

    const handleFollowDeleteBtn = (e) => {
        console.log("value!!", e.target.value);

        const id = e.target.value;
        (async () => {
            await deleteFollow(id);
        })()
    }


    // RENDER
    if(!user) {
        console.log("NOT LOADED YET")
        return null;
    }
    

    console.log("IMG URL!!!", imgUrl);

    const followingList = [];
    let total = 0;
    
    for(const property in follows) {
        followingList.push([follows[property].User, follows[property].id]);
        total++;
    }

    return (
        <>
        <Nav />
        { isUploadPhotoFormVisible ? 
            (<PhotoUploadForm 
                setIsUploadPhotoFormVisible={setIsUploadPhotoFormVisible} 
                handlePhotoSubmit={handlePhotoSubmit} setImage={setImage} 
                />) : (null)
        }
            <div className="fan-page-holder">
                <div className="fan-page">
                    <div className="content-holder">
                        <div className="photo-holder">
                            <Photo 
                                imgUrl={imgUrl} 
                                handleUploadPhotoBtn={handleUploadPhotoBtn} 
                                handleDeletePhotoBtn={handleDeletePhotoBtn}
                            />
                        </div>
                        <div className="name-bio-holder">
                            <div className="name">
                                {name}
                            </div>
                            <div className="bio-header">
                                Bio
                                <button onClick={handleBioEditBtn} className="bio-edit-btn">edit</button>
                            </div>

                            {   isBioEditFormVisible ? 
                                    (<BioEditForm  
                                        updateProperty={updateProperty} 
                                        bio={bio}
                                        setBio={setBio}  
                                        handleBioSubmitBtn={handleBioSubmitBtn}
                                        setIsBioEditFormVisible={setIsBioEditFormVisible}
                                    />) : 
                                    (<Bio bio={bio}/>)
                            }

                        </div>
                    </div>

                    <div className="follows-header-holder">
                        following: <span>{total}</span>
                    </div>

                    <div className="follows-holder">

                        {followingList.map((follow) => (
                            <div key={follow[1]} className="follow-holder">

                                <img className="artist-photo" src={follow[0].imgUrl}/>

                                <div className="artist-name-btn-holder">
                                    <div className="artist-name">
                                        {follow[0].userName}
                                    </div>
                                    <button value={follow[1]} onClick={handleFollowDeleteBtn} className="unfollow-btn">unfollow</button>
                                </div>

                            </div>
                        ))}


                        {/* <div className="follow-holder">
                            
                            <img className="artist-photo" src={followingList[0].imgUrl}/>

                            <div className="artist-name-btn-holder">
                                <div className="artist-name">
                                    artist name
                                </div>
                                <button className="unfollow-btn">unfollow</button>
                            </div>

                        </div> */}

                    </div>
                </div>
            </div>
        </>
    )
}

export default FanEditPage;