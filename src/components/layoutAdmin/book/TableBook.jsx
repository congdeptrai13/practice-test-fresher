import React, { useEffect, useState } from 'react'
import InputFilter from './InputFilter'
import { Button, Table,Drawer, Descriptions, Badge,Modal, Form, Input, message,Popover, Popconfirm, Divider, Upload, Row, Col, InputNumber, Select } from 'antd';
import { deleteUser, getUsersWithPaginate, postCreateUser } from '../../../services/userServices';
import moment from 'moment';
import {
  ExportOutlined,
  ImportOutlined,
  UserAddOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import * as XLSX from "xlsx";
import { callUploadBookImg, deleteBook, getAllCategory, getBooksWithPaginate, postCreateBook } from '../../../services/bookServices';
import { v4 as uuidv4 } from 'uuid';
import ModalUpdateBook from './ModalUpdateBook';
const TableBook = () => {
  const [current,setCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(5);
  const [listBooks,setListBooks] = useState([]);
  const [totalUsers,setTotalUsers] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [sorterBy,setSorterBy] = useState("-updatedAt");
  const [detailsBook,setDetailsBook] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen,setIsModalImportOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataBookUpdate,setDataBookUpdate] = useState([]);
  const [form] = Form.useForm();
  const [mergeImage,setMergeImage] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const [fileListSlider, setFileListSlider] = useState([]);
  const [category,setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [loadingSlider,setLoadingSlider] = useState(false);
  const [dataThumbnail,setDataThumbnail] = useState([]);
  console.log(listBooks)

  const [dataSlider,setDataSlider] = useState([]);
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  const showDrawer = () => {
    setOpen(true);
    setFileList([]);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    getBooksPaginate();
  },[current,pageSize,sorterBy])
  const getBooksPaginate = async(query)=>{
    setIsLoading(true);
    const res = await getBooksWithPaginate(current,pageSize,query,sorterBy);
    setIsLoading(false);
    if(res && res?.data){
      setListBooks(res?.data?.result);
      setTotalUsers(res?.data?.meta?.total);
    }
  }

  const handleSearchUser = (query)=>{
    getBooksPaginate(query)
  }
  const handleViewBookDetails=(book)=>{
    setDetailsBook(book);
    setMergeImage([book.thumbnail,...book.slider]);
    showDrawer();
  }
  const columns = [
    {
      title: 'ID',
      dataIndex:'_id',
      render: (_, record) => (
        <a onClick={() => handleViewBookDetails(record)}>{record._id}</a>
      ),      sorter: {
        multiple: 4,
      },
    },
    {
      title: 'Tên sách',
      dataIndex: 'mainText',
      sorter: {
        multiple: 3,
      },
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Giá tiền',
      width:"100px",
      dataIndex: 'price',
      render:(_,record)=>(
        <span>{(record.price).toLocaleString()} đ</span>
      ),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      render:(_,record)=>(
        <span>{moment(record?.updatedAt).format()}</span>
      ),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Action',
      render: (_, record) => (
        <div style={{display:"flex",gap:"30px",justifyContent:"center",alignItems:"center"}}>
          <Popconfirm
    title="Delete the task"
    description="Bạn có chắc muốn xóa quyển sách này?"
    okText="Xác nhận"
    cancelText="Hủy"
    placement="leftTop"
    onConfirm={()=>confirmDeleteUser(record)}
  >
          <DeleteOutlined style={{fontSize:"20px",cursor:"pointer",color:"orange"}}/>
          </Popconfirm>
       
        <EditOutlined style={{fontSize:"20px",cursor:"pointer",color:"orange"}} onClick={()=> handleUpdateBook(record)}/>
        </div>
      ),
    },
  ];
  const confirmDeleteUser=async(book)=>{
    const res = await deleteBook(book._id);
    if(res && res.data){
      message.success("Xóa book thành công");
      await getBooksPaginate();
    }else{
      message.error(res.message);
    }
  }
  const handleUpdateBook=(dataBook)=>{
    setDataBookUpdate(dataBook);
    setIsModalUpdateOpen(true);
  }
  // console.log(dataBookUpdate);
  const onChange = (pagination,filters, sorter, extra) => {
    if(sorter.order === "ascend"){
      setSorterBy(`-${sorter.field}`);
    }
    if(sorter.order === "descend"){
      setSorterBy(`${sorter.field}`);
    }
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleReloadTable=()=>{
    setSorterBy("-updatedAt");
  }

  const handleExportUser=()=>{
    const worksheet = XLSX.utils.json_to_sheet(listBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "exportBook.csv");
  }
  const renderHeader= ()=>{
    return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <h5>Table List Books</h5>
      <div style={{display:"flex",gap:"15px"}}>
        <Button type="primary" onClick={handleExportUser}>
        <ExportOutlined />
        Export
        </Button>
        <Button type="primary" onClick={showModal}>
        <UserAddOutlined />
        Thêm mới
        </Button>
        <Button style={{border:"none"}} onClick={handleReloadTable}>
        <ReloadOutlined />
        </Button>
      </div>
    </div>
  }
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = async(values) => {
    if(dataThumbnail.length === 0){
      message.error("Vui lòng upload ảnh thumbnail");
      return;
    }
    if(dataSlider.length === 0){
      message.error("Vui lòng upload ảnh slider");
      return;
    }
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item)=> (item.name))
    const {mainText,author,price,sold,quantity,category} = values;
    const res = await postCreateBook(thumbnail,slider,mainText,author,price,sold,quantity,category);
    if(res && res.data){
      message.success("Tạo mới sách thành công")
      setDataThumbnail([]);
      setDataSlider([]);
      setIsModalOpen(false);
      getBooksPaginate();
      
    }else{
      message.success("Không thể tạo mới sách")

    }
  };

  const processImage = ()=>{
    const list = [];
    if(detailsBook){
      mergeImage?.map((item,index)=>{
        return list.push({
          uid: uuidv4(),
          name: item,
          status: 'done',
          url: `${url}/images/book/${item}`,
        })
      })
      setFileList(list);
    }
    return null;
  }

  useEffect(()=>{
    fetchCategory();
  },[])
  const fetchCategory = async()=>{
    const res = await getAllCategory();
    let list = [];
    if(res && res.data){
      res?.data?.map((item)=>{
        return list.push({
          value:item,
          label:item
        })
      })
      setCategory(list);
    }
  }
  useEffect(()=>{
    processImage();
  },[mergeImage])
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const getBase64PreviewImg = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
  const handleCancelPreview = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64PreviewImg(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange= (info,type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUploadFileThumbnail = async({file,onSuccess,onError})=>{
    const res = await callUploadBookImg(file);
    if(res && res.data){
      setDataThumbnail([{
        name: res.data.fileUploaded,
        uid: file.uid
      }])
      onSuccess("ok")
    }else{
      onError("đã có lỗi khi upload file")
    }
  }
  const handleUploadFileSlider = async({file,onSuccess,onError})=>{
    const res = await callUploadBookImg(file);
    if(res && res.data){
      setDataSlider((dataSlider)=> [...dataSlider,{
        name: res.data.fileUploaded,
        uid:file.uid
      }])
      onSuccess("ok")
    }else{
      onError("đã có lỗi khi upload file")
    }
  }
  return (
    <>
      <InputFilter handleSearch={handleSearchUser}/>
      <div style={{marginTop:"20px",height:"100%"}}>
      <Table columns={columns} dataSource={listBooks} onChange={onChange} loading={isLoading}
        pagination={{ total:`${totalUsers}`,defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['1', '5', '10'],
        showTotal: (total, range) => { return(
          <div>{range[0]}-{range[1]} of {total} items</div>
        )
      }
      }}
        title={renderHeader}
      />
      </div>
      <Drawer title="Chức năng xem chi tiết" placement="right" onClose={onClose} open={open} width="50vw">
      <Descriptions title="Thông tin người dùng" bordered>
    <Descriptions.Item label="ID" span={1}>{detailsBook?._id}</Descriptions.Item>
    <Descriptions.Item label="Tên sách" span={2}>{detailsBook?.mainText}</Descriptions.Item>
    <Descriptions.Item label="Tác giả"span={1}>{detailsBook?.author}</Descriptions.Item>
    <Descriptions.Item label="Giá tiền"span={2}>{detailsBook?.price}</Descriptions.Item>
    <Descriptions.Item label="Thể loại" span={3}>
      <Badge status="processing" text={detailsBook?.category} />
    </Descriptions.Item>
    <Descriptions.Item label="Created At">{moment(detailsBook?.createdAt).format()}</Descriptions.Item>
    <Descriptions.Item label="Updated At">{moment(detailsBook?.updatedAt).format()}</Descriptions.Item>
  </Descriptions>
  <Divider orientation="left">Ảnh Books Text</Divider>
  <Upload
        listType="picture-card"
        showUploadList={{
          showRemoveIcon:false
        }}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}

      />
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
      </Drawer>

      <Modal 
      title="Thêm mới Book" 
      open={isModalOpen} onOk={()=> form.submit()} 
      cancelText={"Hủy"} 
      okText={"Thêm mới"} 
      width={"50vw"}
      onCancel={()=>{
        form.resetFields()
        setDataThumbnail([])
        setDataSlider([])
        setIsModalOpen(false)
      }}
      >
      <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
    >
      <Row gutter={16}>
      <Col span={12}>
     <Form.Item
        name="mainText"
        label="Tên sách"
        rules={[
          {
            required: true,
            message:"vui lòng nhập tên sách"
          }
        ]}
      >
        <Input />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
       name="author"
        label="Tác giả"
        rules={[
          {
            required: true,
            message:"vui lòng nhập tác giả"
          }
        ]}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item
       name="price"
        label="Giá tiền"
        rules={[
          {
            required: true,
            message:"vui lòng nhập giá tiền"
          }
        ]}
      >
        <InputNumber
        addonBefore={""}
        addonAfter="VND"
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      onChange={onChange}
    />
      </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item
       name="category"
        label="Thể loại"
        rules={[
          {
            required: true,
            message:"vui lòng chọn thể loại"
          }
        ]}
      >
       <Select
    showSearch
    placeholder="Search to Select"
    optionFilterProp="children"
    filterOption={(input, option) => (option?.label ?? '').includes(input)}
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
    options={category}
  />
      </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item
       name="quantity"
        label="Số lượng"
        rules={[
          {
            required: true,
            message:"vui lòng nhập số lượng"
          }
        ]}
      >
          <InputNumber style={{width:"100%"}} onChange={onChange} />
      </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item
       name="sold"
        label="Đã bán"
      >
          <InputNumber style={{width:"100%"}} min={0} max={1000}/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
       name="Thumbnail"
        label="Ảnh thumbnail"
      >
         <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        maxCount={1}
        multiple={false}
        customRequest={handleUploadFileThumbnail}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        <div>
          {loading ? <LoadingOutlined/> : <PlusOutlined/>}
          <div style={{marginTop:"8px"}}>Upload</div>
        </div>
      </Upload>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
       name="slider"
        label="Ảnh Slider"
      >
         <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        multiple
        customRequest={handleUploadFileSlider}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={(info)=> handleChange(info,"slider")}
      >
        <div>
          {loadingSlider ? <LoadingOutlined/> : <PlusOutlined/>}
          <div style={{marginTop:"8px"}}>Upload</div>
        </div>
      </Upload>
      </Form.Item>
      </Col>
      </Row>
    </Form>
      </Modal>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
      <ModalUpdateBook setIsModalUpdateOpen={setIsModalUpdateOpen} isModalUpdateOpen={isModalUpdateOpen} dataUpdate={dataBookUpdate} getBooksPaginate={getBooksPaginate} />
    </>
  )
}

export default TableBook