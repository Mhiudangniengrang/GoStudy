import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary" className="bg-[#ff4778] text-white">
          <Link to="/">Quay Trở lại trang chủ</Link>
        </Button>
      }
    />
  );
};

export default ErrorPage;
