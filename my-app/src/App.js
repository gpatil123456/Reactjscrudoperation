import React, { useEffect, useState } from 'react'
import "./app.css"
import axios from 'axios';


function App() {
  const [movieName, setMovieName] = useState('')
  const [review, setReview] = useState('');
  const [movieReviewList, setMovieList] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [userInfo, setuserInfo] = useState({
    file: [],
    filepreview: null,
  });

  useEffect(() => {
    axios.get("http://localhost:3001/api/get").then((Response) => {
      setMovieList(Response.data);
    });
  }, []);

  const handleInputChange = (e) => {

   
    setuserInfo({
      ...userInfo,
      file: e.target.files[0],
      filepreview: URL.createObjectURL(e.target.files[0]),
    });

  }



  const submitReview = () => {
    const formdata = new FormData();
    formdata.append('avatar', userInfo.file);

   
    axios.post("http://localhost:3001/imageupload", formdata, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(res => { 
        console.warn(res);
        if (res.data.success === 1) {
          alert("Image upload successfully");
        }

      })

    axios.post("http://localhost:3001/api/insert", {
      movieName: movieName,
      movieReview: review,
    });

    setMovieList([...movieReviewList, { movieName: movieName, movieReview: review },
    ]);

  };
  const deleteRiview = (movie) => {
    axios.delete(`http://localhost:3001/api/delete/${movie}`);
  };

  const updateRiview = (movie) => {
    axios.put("http://localhost:3001/api/update", {
      movieName: movie,
      movieReview: newReview,
    });
    // setNewReview("")
  };


  return (
    <div className='center'>
      <h1>CRUD APPLICATION</h1>
      <div className='form'>
        <lable>Movie Name</lable>
        <input placeholder='Enter Movie Name' type="text" onChange={(e) => {
          setMovieName(e.target.value)
        }} name="movieName" />

        <lable>Review</lable>
        <input placeholder='Enter Movie Review' onChange={(e) => {
          setReview(e.target.value)
        }} type="text" name="movieName" />
      <input type="file" className="form-control" name="upload_file" onChange={handleInputChange} />
        {/* <button type="submit" onClick={() => submit()} > Upload </button> */}
        <button onClick={submitReview}>Submit</button>

      </div>
      <div className='wrap'>
        {movieReviewList.map((val) => {
          return (
            <div className='card'>
              <h1>{val.movieName}</h1>
              <p>{val.movieReview}</p>

              <input placeholder='Update Movie Review' type="text" className="one" onChange={(e) => {
                setNewReview(e.target.value)
              }} />
          
   {userInfo.filepreview !== null ?
                <img className="previewimg" src={userInfo.filepreview} alt="UploadImage" />
                : null} 
              <div className='button'>
                <button className='dot' onClick={() => { deleteRiview(val.movieName) }}>Delete</button>
                <div className='button_two'>
                  <button className='dot' onClick={() => {
                    updateRiview(val.movieName)
                  }}>Update</button>
                </div>
              </div>
            
            </div>
          )
        })}
        
      </div>

    </div>
  )
}


export default App