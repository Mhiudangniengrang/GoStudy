import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Upload, Select } from "antd";
import {
  EditOutlined,
  CrownOutlined,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import useAuthen from "../../hooks/useAuthen";
import Cookies from "js-cookie";
import useSpecialization from "../../hooks/useSpecialization";

const { Option } = Select;

const ProfileUser = () => {
  const { isAuthenticated, infoUser, fetchUserInfo, fetchEditUser } =
    useAuthen();
  const {
    specializationAvailable,
    fetchGetSpecializationAvailable,
    fetchPutSpecialization,
  } = useSpecialization();
  const [userProfile, setUserProfile] = useState({
    fullName: infoUser.fullName || "",
    passwordHash: "",
    birthday: infoUser.birthday || "",
    sex: infoUser.sex || "",
    phone: infoUser.phone || "",
    profileImage: infoUser.profileImage || "",
  });

  const avatarUrl =
    userProfile.profileImage || "https://via.placeholder.com/150";
  const userName = userProfile.fullName || "User Name";
  const email = infoUser.email || "Not Available";
  const semesterName = infoUser.semester?.name || "Not Available";
  const userId = Cookies.get("userId");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSpecializationModalVisible, setIsSpecializationModalVisible] =
    useState(false);
  const [selectedSpecializationId, setSelectedSpecializationId] =
    useState(null);
  const [selectedUserSpecializationId, setSelectedUserSpecializationId] =
    useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGetSpecializationAvailable(userId);
    if (isAuthenticated && !infoUser.fullName && userId) {
      fetchUserInfo(userId);
    } else {
      setUserProfile({
        fullName: infoUser.fullName || "",
        passwordHash: "",
        birthday: infoUser.birthday || "",
        sex: infoUser.sex || "",
        phone: infoUser.phone || "",
        profileImage: infoUser.profileImage || "",
      });
    }
  }, [
    isAuthenticated,
    infoUser,
    fetchUserInfo,
    fetchGetSpecializationAvailable,
  ]);

  const getRoleLabel = (role) => {
    switch (role) {
      case 1:
        return "Free";
      case 3:
        return "Plus";
      case 4:
        return "Premium";
      default:
        return "Unknown";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      let imageUrl = userProfile.profileImage;
      if (newProfileImage) {
        imageUrl = await uploadImage(newProfileImage);
      }

      const updatedProfile = { ...userProfile, profileImage: imageUrl };
      await fetchEditUser(userId, updatedProfile);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dphupjpqt/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return data.secure_url;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const isDateExpired = (dateEnd) => {
    return new Date(dateEnd) < new Date();
  };

  const openSpecializationModal = (userSpecializationId) => {
    setSelectedUserSpecializationId(userSpecializationId);
    setIsSpecializationModalVisible(true);
  };

  const handleSpecializationUpdate = async () => {
    if (!selectedSpecializationId || !selectedUserSpecializationId) return;
    try {
      await fetchPutSpecialization(
        selectedUserSpecializationId,
        selectedSpecializationId
      );

      await fetchUserInfo(userId);

      setIsSpecializationModalVisible(false);
    } catch (error) {
      console.error("Error updating specialization:", error);
    }
  };

  return (
    <div className="flex justify-center items-center my-10">
      <div
        className={`relative w-[700px] ${
          infoUser.role === 4
            ? "border-2 border-orange-500 rounded-lg p-5"
            : "border-2 border-gray-500 rounded-lg p-5"
        }`}
      >
        <div className="relative rounded-lg p-5 z-10 bg-white">
          <div className="flex items-center mb-6">
            <div
              className={`relative ${
                infoUser.role === 4
                  ? "border-4 border-orange-500"
                  : "border-4 border-gray-300"
              } rounded-full flex justify-center items-center`}
            >
              <img
                src={avatarUrl}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover z-25"
              />
              {infoUser.role === 4 && (
                <CrownOutlined
                  className="absolute top-[-10px] left-[-10px] text-orange-500 z-40"
                  style={{ fontSize: "24px", transform: "rotate(-15deg)" }}
                />
              )}
            </div>

            <div className="ml-12 space-y-2">
              <h2 className="text-2xl font-semibold">{userName}</h2>
              <p className="text-gray-600 text-lg">Email: {email}</p>
              <p className="text-gray-600 text-lg">
                Birthdate: {formatDate(userProfile.birthday)}
              </p>
              <p className="text-gray-600 text-lg">Gender: {infoUser.sex}</p>
              <p className="text-gray-600 text-lg">Phone: {infoUser.phone}</p>
              <p className="text-gray-600 text-lg">Semester: {semesterName}</p>
              <p className="text-gray-600 text-lg">
                Package: {getRoleLabel(infoUser.role)}
              </p>
              <EditOutlined
                className="absolute top-2 right-0 m-4 z-40"
                onClick={() => setIsModalVisible(true)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <div className="bg-gray-100">
              {infoUser.specialization && infoUser.specialization.length > 0 ? (
                infoUser.specialization.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-gray-300"
                  >
                    <div className="flex items-center">
                      <span>{item.name}</span>
                    </div>
                    {isDateExpired(item.dateEnd) && (
                      <RedoOutlined
                        style={{ color: "red" }}
                        onClick={() =>
                          openSpecializationModal(item.userSpecializationId)
                        }
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No Specialization
                </div>
              )}
            </div>
          </div>

          <Modal
            title="Edit Profile"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleUpdate}
              >
                Save Changes
              </Button>,
            ]}
          >
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                name="fullName"
                value={userProfile.fullName}
                onChange={handleChange}
                className="mb-4"
              />
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Birthday
              </label>
              <Input
                name="birthday"
                value={userProfile.birthday}
                onChange={handleChange}
                type="date"
                className="mb-4"
              />
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Input
                name="sex"
                value={userProfile.sex}
                onChange={handleChange}
                className="mb-4"
              />
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                name="phone"
                value={userProfile.phone}
                onChange={handleChange}
                className="mb-4"
              />
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <Upload
                accept=".jpg,.jpeg,.png"
                beforeUpload={(file) => {
                  setNewProfileImage(file);
                  return false;
                }}
              >
                <Button icon={<PlusOutlined />}>Upload New Image</Button>
              </Upload>
            </div>
          </Modal>

          <Modal
            title="Select New Specialization"
            open={isSpecializationModalVisible}
            onCancel={() => setIsSpecializationModalVisible(false)}
            footer={[
              <Button
                key="cancel"
                onClick={() => setIsSpecializationModalVisible(false)}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleSpecializationUpdate}
              >
                Update Specialization
              </Button>,
            ]}
          >
            <Select
              placeholder="Select a specialization"
              onChange={(value) => setSelectedSpecializationId(value)}
              style={{ width: "100%" }}
            >
              {(Array.isArray(specializationAvailable.data)
                ? specializationAvailable.data
                : []
              ).map((item) => (
                <Option
                  key={item.specializationId}
                  value={item.specializationId}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
