import { Col, Row,Button, Modal, Rate, message } from 'antd'
import { useEffect, useState } from 'react';
import React from 'react'
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from 'react-image-gallery';
import "./bookDetails.scss"
import { ShoppingCartOutlined } from '@ant-design/icons';
import BookDetailsSkeleton from './BookDetailsSkeleton';
import { getDetailsBook } from '../../services/bookServices';
import { useDispatch } from 'react-redux';
import { doAddToCart } from '../../redux/order/orderSlice';

const BookDetailsComponent = (props) => {
  const {idBook} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mergeImageBook,setMergeImageBook] = useState([]);
  const [dataDetailsBook,setDataDetailsBook] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [fileListImage,setFileListImage] = useState([]);
  const [changeAmount,setChangeAmount] = useState(1);
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(()=>{
    handleGetDetailsBook()
  },[])
  const handleGetDetailsBook = async()=>{
    setIsLoading(true)
    const res = await getDetailsBook(idBook);
      setDataDetailsBook(res.data);
      setMergeImageBook([res.data.thumbnail,...res.data.slider])
    setIsLoading(false)
  }
  useEffect(()=>{
    processImage();
  },[mergeImageBook])

  const processImage = async()=>{
    const list = [];
    if(dataDetailsBook){
      mergeImageBook?.map((item,index)=>{
        return list.push({
          original: `${url}/images/book/${item}`,
          thumbnail: `${url}/images/book/${item}`,
        })
      })
      setFileListImage(list);
    }
    return null;
  }  
  const images =fileListImage;
  const handleOpenModal=()=>{
    showModal();
  }

  const handleAddToCart=()=>{
    dispatch(doAddToCart({dataDetailsBook,changeAmount}))
  }
  const handleChangleAmount=(amount)=>{
    if(amount < dataDetailsBook.quantity){
      setChangeAmount(+amount)
    }
    return;
  }
  return (
    <>
    {isLoading === false 
    ? 
    <>
    <Row gutter={20} style={{backgroundColor:"#fff",height:"100%"}}>
      <Col span={10} style={{padding:"15px"}}>
      <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showNav={false} slideOnThumbnailOver={true} onClick={handleOpenModal}/>
      </Col>
      <Col span={14} style={{padding:"35px"}}>
        <p>Tác giả: <a>{dataDetailsBook?.author}</a></p>
        <p style={{fontSize:"1.25rem",marginTop:"0.625rem"}}>{dataDetailsBook?.mainText}</p>
        <p style={{fontSize:"0.8rem",marginTop:"0.625rem"}}><Rate defaultValue={5} disabled style={{fontSize:"0.75rem"}}/> | Đã bán {dataDetailsBook?.sold}</p>
        <p className='price-detailBook'>{(dataDetailsBook?.price)?.toLocaleString()} ₫</p>
        <div className='delivery'>
        <p className='delivery-type'>Vận Chuyển</p>
        <p className='delivery-free'>Miễn phí vận chuyển</p>
        </div>
        <div className='input-select'>
          <p style={{color:"#757575",  width: "110px"}}>Số Lượng</p>
          <div className='input-group-button'>
            <button className='button-subtraction' onClick={()=> setChangeAmount((prev)=> prev - 1)} disabled={changeAmount === 1 ? true : false}>-</button>
            <input className='input-amount' type='text' value={changeAmount} onChange={(e)=> handleChangleAmount(e.target.value)}/>
            <button className='button-subtraction' onClick={()=> setChangeAmount((prev)=> prev + 1)} disabled={changeAmount === dataDetailsBook?.quantity ? true : false}>+</button>
          </div>
        </div>
        <div className='button-group'>
          <button className='button-addCart' onClick={handleAddToCart}><ShoppingCartOutlined /> Thêm vào giỏ hàng</button>
          <button className='button-buy'>Mua ngay</button>
        </div>
      </Col>
    </Row>
    <Modal title={dataDetailsBook?.mainText} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={"50vw"}>
    <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} onClick={handleOpenModal} thumbnailPosition={"right"}/>
      </Modal> 
      </>
      :
      <BookDetailsSkeleton/>
    }
      
    </>
  )
}

export default BookDetailsComponent