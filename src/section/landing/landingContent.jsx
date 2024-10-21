import React from "react";
import { Button } from "antd";
import logo1 from "../assets/landing/Asset 1.png";
import logo2 from "../assets/landing/Asset 4.png";
function LandingContent() {
  return (
    <>
      <div className="flex flex-col lg:flex-row mt-10 bg-white ">
        <div className="ml-12">
          <h1 className="text-5xl font-bold text-blue-900">
            Looking for a study partner?
          </h1>
          <div className="mx-5">
            <p className="text-2xl text-[#6A88A9] mt-4 font-semibold">
              Self-study website with companions
            </p>
            <img src={logo2} className="w-64 my-10 m-20" alt="Go Study" />
            <p className="text-lg text-[#034EA1] font-medium mt-8 text-center w-2/3">
              Experience a new form of learning with friends who share the same
              ideals at FPT University.
            </p>
          </div>
          <div className="flex my-8 space-x-5">
            <Button
              type="default"
              size="large"
              className="border-blue-600 text-blue-600 w-[35%]"
            >
              More information
            </Button>
            <Button
              type="default"
              size="large"
              className="bg-orange-500 text-white w-1/3 custom-button"
            >
              Join us
            </Button>
          </div>
        </div>
        <img
          src={logo1}
          className="w-full lg:w-[62%] h-auto mt-8 lg:mt-0"
          alt="Illustration"
        />
      </div>
      <p className="mb-4 text-[#D1E7FF] font-semibold bg-[#034EA1] p-8 text-center text-lg">
        "Experience a new form of learning with friends who share the same
        ideals at FPT University".
      </p>
    </>
  );
}

export default LandingContent;
