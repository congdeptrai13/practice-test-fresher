import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, Modal, Row, Select, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { callUploadBookImg, getAllCategory, putUpdateBook } from '../../../services/bookServices';
import { v4 as uuidv4 } from 'uuid';

const ModalUpdateBook = (props) => {
  const {isModalUpdateOpen,setIsModalUpdateOpen,dataUpdate} = props;
  const [loading,setLoading] = useState(false);
  const [dataThumbnail, setDataThumbnail] = useState([])
  const [dataSlider, setDataSlider] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loadingSlider,setLoadingSlider] = useState(false);
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([])
  const [initForm,setInitForm] = useState([]);
  const [imageUrl, setImageUrl] = useState("");



  const onFinish = async(values)=>{
    if (dataThumbnail.length === 0) {
      message.error("Vui lòng upload ảnh thumbnail'")
      return;
  }

  if (dataSlider.length === 0) {
      message.error("Vui lòng upload ảnh slider")
      return;
  }

  const { mainText, author, price, sold, quantity, category } = values;
  const thumbnail = dataThumbnail[0].name;
  const slider = dataSlider.map(item => item.name);
  const res = await putUpdateBook(dataUpdate?._id,thumbnail,slider,mainText,author,price,sold,quantity,category);
  if(res && res.data){
    form.resetFields();
    message.success("Cập nhật sách thành công")
    setDataThumbnail([])
    setDataSlider([])
    setIsModalUpdateOpen(false)
    await props.getBooksPaginate()
    
  }
  // "thumbnail": "abc",
  //   "slider": ["def"],
  //   "mainText": "asdfasfasfd",
  //   "author": "asfdafdasdf",
  //   "price": 1,
  //   "sold": 1110,
  //   "quantity": 1000,
  //   "category": "Arts"
  }


  
  useEffect(() => {
    const fetchCategory = async () => {
        const res = await getAllCategory();
        if (res && res.data) {
            const d = res.data.map(item => {
                return { label: item, value: item }
            })
            setListCategory(d);
        }
    }
    fetchCategory();
}, [])

useEffect(() => {
  if (dataUpdate?._id) {
      const arrThumbnail = [
          {
              uid: uuidv4(),
              name: dataUpdate.thumbnail,
              status: 'done',
              url: `${import.meta.env.VITE_BACKEND_BASE_URL}/images/book/${dataUpdate.thumbnail}`,
          }
      ]

      const arrSlider = dataUpdate?.slider?.map(item => {
          return {
              uid: uuidv4(),
              name: item,
              status: 'done',
              url: `${import.meta.env.VITE_BACKEND_BASE_URL}/images/book/${item}`,
          }
      })

      const init = {
          _id: dataUpdate._id,
          mainText: dataUpdate.mainText,
          author: dataUpdate.author,
          price: dataUpdate.price,
          category: dataUpdate.category,
          quantity: dataUpdate.quantity,
          sold: dataUpdate.sold,
          thumbnail: { fileList: arrThumbnail },
          slider: { fileList: arrSlider }
      }
      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      form.setFieldsValue(init);
  }
  return () => {
      form.resetFields();
  }
}, [dataUpdate])

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
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

const handleChange = (info, type) => {
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

const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
  const res = await callUploadBookImg(file);
  if (res && res.data) {
      setDataThumbnail([{
          name: res.data.fileUploaded,
          uid: file.uid
      }])
      onSuccess('ok')
  } else {
      onError('Đã có lỗi khi upload file');
  }
};

const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
  const res = await callUploadBookImg(file);
  if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [...dataSlider, {
          name: res.data.fileUploaded,
          uid: file.uid
      }])
      onSuccess('ok')
  } else {
      onError('Đã có lỗi khi upload file');
  }
};

const handleRemoveFile = (file, type) => {
  if (type === 'thumbnail') {
      setDataThumbnail([])
  }
  if (type === 'slider') {
      const newSlider = dataSlider.filter(x => x.uid !== file.uid);
      setDataSlider(newSlider);
  }
}

const handlePreview = async (file) => {
  if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      return;
  }
  getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  });
};

  
  return (
    <>
    <Modal 
      title="Thêm mới Book" 
      open={isModalUpdateOpen} onOk={()=> form.submit()} 
      cancelText={"Hủy"} 
      okText={"Thêm mới"} 
      width={"50vw"}
      onCancel={()=>{
        form.resetFields()
        setDataThumbnail([])
        setDataSlider([])
        setIsModalUpdateOpen(false)
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
    options={listCategory}
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
          <InputNumber style={{width:"100%"}} />
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
              name="thumbnail"
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              multiple={false}
              customRequest={handleUploadFileThumbnail}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onRemove={(file) => handleRemoveFile(file, "thumbnail")}
              onPreview={handlePreview}
              defaultFileList={initForm?.thumbnail?.fileList ?? []}
          >
              <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
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
            multiple
            name="slider"
            listType="picture-card"
            className="avatar-uploader"
            customRequest={handleUploadFileSlider}
            beforeUpload={beforeUpload}
            onChange={(info) => handleChange(info, 'slider')}
            onRemove={(file) => handleRemoveFile(file, "slider")}
            onPreview={handlePreview}
            defaultFileList={initForm?.slider?.fileList ?? []}
        >
            <div>
                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        </Upload>
      </Form.Item>
      </Col>
      </Row>
    </Form>
      </Modal>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
    </>
  )
}

export default ModalUpdateBook