import { Button, Modal } from 'antd';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { Space, Table, Tag } from 'antd';
const { Dragger } = Upload;
import * as XLSX from "xlsx";
import { postImportUser } from '../../../services/userServices';
import template from "../../../assets/template.xlsx?url"
const ImportUser = (props) => {
  const {isModalImportOpen,setIsModalImportOpen} = props;
  const [dataImport,setDataImport] = useState([]);
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  
  const propsImport = {
    name: 'file',
    multiple: false,
    accept:".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    customRequest:dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        if(info.fileList && info.fileList.length > 0){
          const file = info.fileList[0].originFileObj;
          let reader = new FileReader();
          reader.onload = function(e) {
            let data = new Uint8Array(reader.result);
            let workbook = XLSX.read(data, {type: 'array'});
            // find the name of your sheet in the workbook first
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // convert to json format
            const jsonData = XLSX.utils.sheet_to_json(worksheet,{
              header:["fullName","email","phone"],
              range:1,
            });
            setDataImport(jsonData);
        };
        reader.readAsArrayBuffer(file);
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const columns = [
    {
      title: 'Tên hiện thị',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
  ];
  const renderTableHeader=()=>{
    return <>
      <h5>Dữ liệu upload</h5>
    </>
  }
  const handleCancel=()=>{
    setDataImport([]);
    setIsModalImportOpen(false);
  }
  const handleOk=async()=>{
   let newData = dataImport.map((item)=>{
     item.password = "123456";
     return item;
    })
    const res = await postImportUser(newData);
    if(res.data){
      message.success(`countError:${res.data.countError} | countSuccess:${res.data.countSuccess}`)
      setDataImport([]);
      setIsModalImportOpen(false);
    }else{
      message.error(res.message);
    }
  }
    return (
    <>
      <Modal title="Import data user" open={isModalImportOpen} onOk={handleOk} onCancel={handleCancel}
      width={"50vw"}
      okText="Import data"
      maskClosable={false}
      destroyOnClose={true}
      okButtonProps={
        {disabled: dataImport < 1,}
      }
      >
        <Dragger {...propsImport}
        >
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Only accept .csv, .xls, .xlsx. or <a href={template} onClick={e => e.stopPropagation()}>Download Sample File</a>
    </p>
  </Dragger>
  <Table columns={columns} dataSource={dataImport} title={renderTableHeader} pagination={false}
  />;
      </Modal>
    </>
  );
};
export default ImportUser;