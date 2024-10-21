import React from "react";
import { Button, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";

const contacts = [
  {
    name: "Jason Price",
    email: "kuhlman.jeremy@yahoo.com",
    image:
      "https://i.pinimg.com/236x/36/a9/92/36a992231acb1ba40d3b869119ecd8ca.jpg",
  },
  {
    name: "Duane Dean",
    email: "rusty.botsford@wilfrid.io",
    image:
      "https://i.pinimg.com/236x/77/a1/54/77a154995c3faa9d0d52f3407c271aaf.jpg",
  },
  {
    name: "Jonathan Barker",
    email: "cora_haley@quinn.biz",
    image:
      "https://i.pinimg.com/236x/b0/0f/11/b00f119b57594470dd89d88d60593604.jpg",
  },
  {
    name: "Rosie Glover",
    email: "lockman.marques@hotmail.com",
    image:
      "https://i.pinimg.com/236x/a2/3f/9f/a23f9f9018efd72fe2d181a16e6fdf6e.jpg",
  },
  {
    name: "Patrick Greer",
    email: "pearlie.eichmann@trevion.net",
    image:
      "https://i.pinimg.com/236x/60/db/06/60db06e2eddfdd165a70a44c3263b0bd.jpg",
  },
  {
    name: "Darrell Ortega",
    email: "chaya.shields@ferry.info",
    image:
      "https://i.pinimg.com/236x/5e/e9/16/5ee9163bfc76dc3189234aca28a3f7c4.jpg",
  },
];

function Contact() {
  return (
    <div className="max-w-5xl mx-auto p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#034EA1]">Contact</h1>
        <Button type="primary" className="bg-[#034EA1] text-[#FFFFFF]">
          Add New Contact
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
          <Card
            key={index}
            cover={
              <img
                alt={contact.name}
                src={contact.image}
                className="rounded-t-lg object-cover h-80 w-full"
              />
            }
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <Card.Meta
              title={<span className="font-bold">{contact.name}</span>}
              description={contact.email}
            />
            <Button
              type="default"
              className="mt-4 w-full"
              icon={<MailOutlined />}
            >
              Message
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Contact;
