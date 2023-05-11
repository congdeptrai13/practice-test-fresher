import { FilterOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs } from 'antd'
import Meta from 'antd/es/card/Meta';
import React, { useEffect, useState } from 'react'
import { getAllCategory } from '../../services/bookServices';
import { getBooksWithPaginate } from '../../services/bookServices';
import LoadingComponent from '../loading';
import { useNavigate, useOutletContext } from 'react-router-dom';
import "./homeComponent.scss"

const Home = () => {
  const [searchNav,setSearchNav] = useOutletContext();
  const [listCategory,setListCategory] = useState([]);
  const [listBook,setListBook] = useState([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [pageSize,setPageSize] = useState(4);
  const [total,setTotal] = useState(2);
  const [loadingBook,setLoadingBook] = useState(false);
  const [filterBook,setFilterBook] = useState("");
  const [sorterBook,setSorterBook] = useState("-sold");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(()=>{
    fetchGetAllListCategory();
    fetchGetAllListBook();
  },[])

  useEffect(()=>{
    fetchGetAllListBook();
  },[currentPage,pageSize,sorterBook,filterBook,searchNav])

  const fetchGetAllListBook = async()=>{
    setLoadingBook(true);
    const res = await getBooksWithPaginate(currentPage,pageSize,filterBook,sorterBook,searchNav);
    if(res && res.data){
      setListBook(res.data);
      setTotal(res.data.meta.total);
    }
    setLoadingBook(false);
  }
  const fetchGetAllListCategory = async()=>{
    const res = await getAllCategory();
   if(res && res.data){
    setListCategory(res.data);
   }
  }

  const url = import.meta.env.VITE_BACKEND_BASE_URL

  const items = [
    {
      key: '-sold',
      label: `Phổ Biến`,
    },
    {
      key: 'updatedAt',
      label: `Hàng Mới`,
    },
    {
      key: 'price',
      label: `Giá Thấp Đến Cao`,
    },
    { 
      key: '-price',
      label: `Giá Cao Đến Thấp`,
    },
  ];

  function convertToUnsigned(str) {
    // Tạo bảng chữ cái chứa các ký tự có dấu trong Tiếng Việt
    var unicodeTable = {
      'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'đ': 'd',"Đ":"D",
      'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };
    
    // Tách các từ và chuyển đổi các ký tự có dấu sang không dấu
    var words = str.split(' ');
    for (var i = 0; i < words.length; i++) {
      var newWord = '';
      for (var j = 0; j < words[i].length; j++) {
        var char = words[i][j];
        if (unicodeTable.hasOwnProperty(char)) {
          newWord += unicodeTable[char];
        } else {
          newWord += char;
        }
      }
      words[i] = newWord;
    }
    
    // Ghép các từ lại thành chuỗi hoàn chỉnh
    return words.join(' ');
  }
  
  const slug = (str) =>{
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
             .replace(/\s+/g, '-') // collapse whitespace and replace by -
             .replace(/-+/g, '-'); // collapse dashes
  
    return str;
  };

  const onFinish= (values) =>{
    if(values?.range?.from >=0 && values?.range?.to >=0){
      let filterRange = `&price>=${values?.range?.from}&price<=${values?.range?.to}`
      if(values?.category?.length){
        let stringCate = `&category=`;
        stringCate += values.category.join(",");
        filterRange += stringCate;
      }
      setFilterBook(filterRange)
    }
    
  }


  const onChangePaginate= (current, size)=>{
    setCurrentPage(current)
    setPageSize(size);
  }

  const handleChangeFilter=(changedValues, values)=>{
    let stringCate = `&category=`;
    stringCate += values.category.join(",");
    if(stringCate.length > 0){
      setFilterBook(stringCate)
    }
  }
  const onchangeTabs=(activeKey)=>{
    setSorterBook(activeKey);
  }

  const handleRedirectBook=(book)=>{
    let f = book.mainText;
    f= slug(convertToUnsigned(f))
    navigate(`/book/${f}?id=${book._id}`)
  }
  return (
    
    <div style={{backgroundColor:"#ccc",marginTop:"10px"}}>
      <div className='wrapper' style={{margin:"24px",padding:"24px"}}>
        <Row gutter={10}>
          <Col sm={24} md={8} lg={6} xl={6} >
            <div style={{border:"1px solid #ccc",height:"100%",backgroundColor:"#fff",borderRadius:"5px",padding:"5px 10px"}}>
            <Form
            onFinish={onFinish}
            layout="vertical"
            form={form}
            onValuesChange={(changedValues, values)=> handleChangeFilter(changedValues, values)}
      >
        <Form.Item 
        >
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>
              <FilterOutlined style={{color:"blue"}}/>
               Bộ lọc tìm kiếm
              </span>
              <ReloadOutlined style={{cursor:"pointer"}} onClick={()=> {
                form.resetFields()
                setFilterBook("")
                setSearchNav("")
                setSorterBook("-sold")
                fetchGetAllListBook()
              }
                }/>
              </div>
        </Form.Item>
        <Divider/>
        <Form.Item
        name="category"
        label="Danh mục sản phẩm"
        >
          <Checkbox.Group>
        <Row>
                    {listCategory.map((item)=>{
                      return <Col span={24}>
                      <Checkbox value={item} style={{marginTop:"10px"}}>{item}</Checkbox>
                    </Col>
                    })}
                </Row>
                </Checkbox.Group>
        </Form.Item>
        <Divider/>
        <Form.Item
        >
        <div>
                <p>Khoảng giá</p>
                <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
                  <Form.Item
                  name={["range","from"]}
                  >
                  <InputNumber
                  name="from"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder={"đ TỪ"}
                  />
                </Form.Item>
                  <Form.Item
                  name={["range","to"]}
                  >
                  <InputNumber
                  name='to'
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder={"đ ĐẾN"}
                  />
                </Form.Item>
                </div>
              </div>
        </Form.Item>
        <Divider/>
          <Form.Item
          >
          <Button type="primary" block onClick={()=> form.submit()}>Áp dụng</Button>
          </Form.Item>

            </Form> 
            </div>
          </Col>
          <Col sm={24} md={16} lg={18} xl={18}>
          <div style={{border:"1px solid #ccc",padding:"5px",height:"100%",backgroundColor:"#fff"}}>
              <div>
              <Tabs defaultActiveKey="1" items={items} onChange={(activeKey)=> onchangeTabs(activeKey)}/>
              </div>
              <div>
                <Spin spinning={loadingBook}>
                <Row gutter={10}>
                  {listBook?.result?.map((item)=>{
                    return (
                      <Col  sm={12} md={12} lg={6} xl={6} style={{marginTop:"5px"}}>
                      <Card
                        hoverable
                        style={{ width: "100%" }}
                        cover={<img alt="example" src={`${url}/images/book/${item.thumbnail}`} />}
                        onClick={()=>handleRedirectBook(item)}
                      >
                        <p style={{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",fontSize:"0.8rem"}}>{item.mainText}</p>
                        <p style={{fontSize:"0.8rem",margin:"3px 0"}}>{(item.price)?.toLocaleString()} đ</p>
                        <p style={{fontSize:"0.8rem"}}><Rate defaultValue={5} disabled style={{fontSize:"0.75rem"}}/> | Đã bán {item.sold}</p>
                      </Card>
                      </Col>
                    )
                  })}
                </Row>
                </Spin>
                
                <div style={{marginTop:"30px",textAlign:"center"}}>
                <Pagination pageSize={4} defaultCurrent={1} total={total} onChange={onChangePaginate}/>
                </div>
              </div>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home