import React, { useState } from "react";
import { Input, Button, Checkbox, Upload, notification } from "antd";
import {
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import contact from "../assets/account/contact.png";

function ContactUs() {
  const [formValues, setFormValues] = useState({
    name: "",
    street: "",
    city: "",
    postcode: "",
    phone: "",
    email: "",
    message: "",
    nda: false,
  });
  const [fileList, setFileList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormValues({ ...formValues, nda: e.target.checked });
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const areFieldsFilled = Object.values(formValues).every(
      (value) => value !== ""
    );

    if (!areFieldsFilled) {
      notification.error({
        message: "Submission Failed",
        description: "Please fill in all fields before submitting.",
      });
      return;
    }

    notification.success({
      message: "Feedback Sent",
      description: "Your feedback and files have been sent successfully!",
    });

    setFormValues({
      name: "",
      street: "",
      city: "",
      postcode: "",
      phone: "",
      email: "",
      message: "",
      nda: false,
    });
    setFileList([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-[#034EA1] mb-2">
            Get in <span className="text-[#F36F20]">touch</span>
          </h1>
          <p className="mb-6">
            Online learning platform connecting FPT students nationwide. We are
            always ready to support you in the process of studying and using the
            website.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder="Contact name"
              value={formValues.name}
              onChange={handleInputChange}
            />
            <Input
              name="street"
              placeholder="Street"
              value={formValues.street}
              onChange={handleInputChange}
            />
            <div className="flex gap-4">
              <Input
                name="city"
                placeholder="City"
                className="flex-1"
                value={formValues.city}
                onChange={handleInputChange}
              />
              <Input
                name="postcode"
                placeholder="Postcode"
                className="flex-1"
                value={formValues.postcode}
                onChange={handleInputChange}
              />
            </div>
            <Input
              name="phone"
              placeholder="Contact Phone"
              value={formValues.phone}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              placeholder="E-mail"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <Input.TextArea
              name="message"
              placeholder="Let's talk about your idea"
              rows={4}
              value={formValues.message}
              onChange={handleInputChange}
            />
            <div className="w-full">
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Prevent automatic upload
              >
                <Button
                  icon={<UploadOutlined />}
                  className="text-sm py-2 px-[12rem] w-full border-dashed"
                  style={{ height: "140px" }}
                >
                  Upload Additional file
                </Button>
              </Upload>
            </div>
            <Checkbox checked={formValues.nda} onChange={handleCheckboxChange}>
              I want to protect my data by signing an NDA
            </Checkbox>
            <Button
              type="primary"
              className="bg-blue-600 w-full mt-4"
              htmlType="submit"
            >
              SUBMIT
            </Button>
          </form>
        </div>
        <div className="flex-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4641238857164!2d106.62812931474901!3d10.855264692270306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292920e8b3a5%3A0x2a3bbf4a0c1f0fa8!2sFPT%20University!5e0!3m2!1sen!2s!4v1619727082677!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="FPT University Map"
          ></iframe>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 bg-gray-100 p-4 rounded-lg w-3/6">
        <div className="flex items-center">
          <PhoneOutlined className="text-3xl mr-2" />
          <div className="flex flex-col text-[11px]">
            <strong>Phone:</strong> (+84) 34 264 0809
          </div>
        </div>
        <div className="flex items-center">
          <MailOutlined className="text-3xl mr-2" />
          <div className="flex flex-col text-[11px]">
            <strong>E-MAIL:</strong> gostudy.go01@gmail.com
          </div>
        </div>
        <div className="flex items-center">
          <LinkOutlined className="text-3xl mr-2" />
          <div className="flex flex-col text-[11px]">
            <strong>HELPDESK:</strong>{" "}
            <a href="https://go.study.com" className="text-blue-600">
              https://go.study.com
            </a>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-[#034EA1] p-6 rounded-lg flex items-center">
        <div className="flex-shrink-0 mr-6">
          <img src={contact} alt="Books and Calendar" className="w-[80%]" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl text-white font-bold mb-4">
            Contact us when you need
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-white">
            <li>Support for using the website</li>
            <li>Answer questions about website features</li>
            <li>Feedback about the website</li>
            <li>Contribute ideas for the website</li>
            <li>Report violations</li>
            <li>Advertising cooperation</li>
            <li>We are always ready to listen and support you.</li>
          </ul>
          <p className="mt-4 text-white">
            Additionally, you can also find answers to frequently asked
            questions (FAQs) here:{" "}
            <a
              href="https://www.gostudy.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              https://www.gostudy.net/
            </a>
          </p>
          <p className="mt-2 font-bold text-white">
            Thank you for using Go! Study!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
