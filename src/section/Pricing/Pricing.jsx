import React, { useEffect } from "react";
import { Button, Card } from "antd";
import { PhoneOutlined, MailOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import usePackage from "../../hooks/usePackage";

function Pricing() {
  const navigate = useNavigate();
  const { packages, fetchGetPackage } = usePackage();

  useEffect(() => {
    fetchGetPackage();
  }, [fetchGetPackage]);

  const handleGetStarted = (id) => {
    navigate(`/user/payment/${id}`);
  };

  const plans = [
    {
      description: "The essentials to provide your best work for clients.",
    },
    {
      description: "A plan that scales with your rapidly growing business.",
    },
    {
      description: "Dedicated support and infrastructure for your company.",
    },
  ];

  return (
    <>
      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-semibold text-[#034EA1]">
              Pricing Strategy
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Whether you want to get organized, keep your personal life on
              track, or boost workplace productivity, Evernote has the right
              plan for you.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
            {packages.map((plan, index) => (
              <div
                key={index}
                className="flex flex-col justify-between pt-6 bg-white rounded-lg shadow-xl overflow-hidden transition-transform transform hover:scale-105"
              >
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    {plans[index] && plans[index].description}
                  </p>
                  {plan.price && (
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-base font-medium text-gray-500">
                        /month
                      </span>
                    </div>
                  )}

                  <ul className="mt-6 space-y-4">
                    {plan.features?.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="flex-shrink-0 h-6 w-6 text-indigo-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="ml-3 text-base text-gray-500">
                          {feature.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-gray-50">
                  <Button
                    type="primary"
                    className={`w-full ${
                      plan.price === 0 ? "bg-gray-300" : "bg-blue-500"
                    } text-white`}
                    onClick={() => handleGetStarted(plan.packageId)}
                    disabled={plan.price === 0}
                  >
                    {plan.price === 0 ? "Using" : "Get Started"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Pricing;
