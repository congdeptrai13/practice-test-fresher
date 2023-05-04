import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import BookDetailsComponent from '../../components/bookDetails';

const BookPage = () => {
  let location = useLocation();
  console.log(location)
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  return (
    <div style={{background:"#F5F5F5",padding:"10px 48px"}}>
    <BookDetailsComponent idBook={id}/>
    </div>


  )
}

export default BookPage