import React, { useEffect, useState } from 'react'
import "./app.css"
import axios from 'axios';

function App() {
  const [movieName, setMovieName] = useState('')
  const [review, setReview] = useState('');
  const [movieReviewList, setMovieList] = useState ([]);
  const [newReview, setNewReview] = useState ("");



  const submitReview = () => {
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
    setNewReview("")
  };


  useEffect(() => {
    console.log("im here")
    axios.get("http://localhost:3001/api/get/res")
    .then((Response) => {
      console.log(Response.data,  "mad")
      setMovieList(Response.data);
      
    });
  },[]);


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
        <button onClick={submitReview}>Submit</button>

      </div>
      <div className='wrap'>
      {movieReviewList.map((val) => {
        return (
          <div className='card'>
            <h1>{val.movieName}</h1>
            <p>{val.movieReview}</p>
         
            <input  placeholder='Update Movie Review' type="text" className="one" onChange={(e) => {
              setNewReview(e.target.value)
            }} /> 
            <div className='button'>
              <button onClick={() => { deleteRiview(val.movieReview) }}>Delete</button>
              <div className='button_two'>
            <button onClick={() => {
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