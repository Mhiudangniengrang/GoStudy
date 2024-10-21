import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const AdminError = () => {
    
  return (
    <Result
      status="404"
      title="404"
      subTitle="xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary" className="bg-[#ff4778] text-white">
          <Link to="/admin/dashboard">Quay Trở lại trang chủ</Link>
        </Button>
      }
    />
  );
};

export default AdminError;
