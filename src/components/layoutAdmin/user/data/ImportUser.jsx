import { Button, Modal } from 'antd';
import { useState } from 'react';
const ImportUser = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal title="Import data user" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>hello</p>
      </Modal>
    </>
  );
};
export default ImportUser;