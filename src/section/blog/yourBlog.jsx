import React, { useEffect, useState } from "react";
import {
  Avatar,
  Dropdown,
  Image,
  Space,
  message,
  notification,
  Pagination,
  Modal,
  Input,
  Button,
  Form,
  Upload,
} from "antd";
import {
  RetweetOutlined,
  SmallDashOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useAuthen from "../../hooks/useAuthen";
import useBlog from "../../hooks/useBlog";
import Cookies from "js-cookie";

// Cloudinary import
import { Cloudinary } from "@cloudinary/url-gen";

// Create Cloudinary instance
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "dphupjpqt", 
  },
});

function YourBlog({ refreshYourBlog }) {
  const { isAuthenticated, infoUser, fetchUserInfo } = useAuthen();
  const {
    blog,
    fetchGetBlog,
    fetchDeleteBlog,
    totalElements,
    fetchUpdateUser,
    fetchPostComment,
  } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isImagesModalVisible, setIsImagesModalVisible] = useState(false); 
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [images, setImages] = useState([]); 
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState({});
  const [commentCount, setCommentCount] = useState(0); 
  const userId = Number(Cookies.get("userId"));
  const [pageSize, setPageSize] = useState(10);

  const userName = infoUser.fullName || "User Name";
  const email = infoUser.email || "Not Available";
  const avatarUrl =
    infoUser.profileImage ||
    "https://i.pinimg.com/originals/9f/c4/a0/9fc4a0105bbfad34b73b90cdc3b7ff06.jpg";

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (isAuthenticated && userId) {
      if (!infoUser.fullName) {
        fetchUserInfo(userId);
      }
      fetchGetBlog(userId, currentPage, pageSize);
    }
  }, [
    isAuthenticated,
    infoUser,
    fetchUserInfo,
    fetchGetBlog,
    currentPage,
    pageSize,
    refreshYourBlog,
  ]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onClick = async ({ key }, post) => {
    if (key === "2") {
      try {
        await fetchDeleteBlog(post.postId);
        notification.success({
          message: "Delete Successful",
          description: "You have deleted the post successfully.",
          duration: 2,
        });
        fetchGetBlog(Cookies.get("userId"), currentPage, 10);
      } catch (error) {
        notification.error({
          message: "Delete Failed",
          description: "Failed to delete the post.",
          duration: 2,
        });
      }
    } else if (key === "1") {
      // Open the edit modal
      setSelectedPost(post); // Set selected post for editing
      setImages(post.blogImgs || []); // Set initial images
      setIsEditMode(true); // Switch to edit mode
      form.setFieldsValue({
        content: post.content,
      });
      setIsEditModalVisible(true); // Open modal for editing
    }
  };

  const uploadImages = async (images) => {
    try {
      const imageUrls = await Promise.all(
        images.map(async (image, index) => {
          // Nếu là URL, giữ nguyên không upload lại
          if (typeof image === "object" && image.img) {
            return image.img; // Giữ URL ảnh cũ
          }

          // Nếu là File, upload lên Cloudinary
          if (image instanceof File) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "ml_default");

            const response = await fetch(
              "https://api.cloudinary.com/v1_1/dphupjpqt/image/upload",
              {
                method: "POST",
                body: formData,
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error.message || "Image upload failed");
            }

            return data.secure_url; // Trả về URL Cloudinary cho ảnh mới
          }

          throw new Error(`Unsupported image type at index ${index}`);
        })
      );

      return imageUrls; // Trả về danh sách URL của ảnh cũ và ảnh mới
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleUpdateBlog = async (values) => {
    try {
      // Upload ảnh mới và giữ lại URL của ảnh cũ
      setLoading(true);

      const updatedImages = await uploadImages(images);

      const updatedData = {
        postId: selectedPost.postId,
        title: "", // Không thay đổi tiêu đề
        content: values.content, // Nội dung được cập nhật
        userId: Cookies.get("userId"), // ID người dùng
        images: updatedImages, // Giữ ảnh cũ và thêm ảnh mới
      };

      console.log("Final data to update:", updatedData);

      await fetchUpdateUser(selectedPost.postId, updatedData); // Cập nhật bài viết
      notification.success({
        message: "Update successful",
        description: "The article has been updated successfully.",
        duration: 2,
      });
      setIsEditModalVisible(false);
      setSelectedPost(null); // Xóa lựa chọn hiện tại
      fetchGetBlog(Cookies.get("userId"), currentPage, 10); // Làm mới danh sách bài viết
    } catch (error) {
      notification.error({
        message: "Update failed",
        description: `Error updating article: ${error.message}`,
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = ({ fileList }) => {
    const newFiles = fileList
      .map((file) => {
        if (file.url) {
          return { img: file.url, uid: file.uid };
        }

        if (file.originFileObj) {
          return file.originFileObj;
        }

        return null; 
      })
      .filter(Boolean); 

    setImages(newFiles); 
  };

  const handleCloseModals = () => {
    setIsEditModalVisible(false);
    setIsImagesModalVisible(false);
    setSelectedPost(null);
  };

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setIsImagesModalVisible(true); 
  };

  const items = [
    {
      label: "Edit",
      key: "1",
    },
    {
      label: "Delete",
      key: "2",
    },
  ];
  const handleCommentSubmit = async (postId) => {
    if (commentCount >= 3) {
      message.warning("You can only post 3 comments per day.");
      return;
    }

    const commentData = {
      postId,
      userId: userId,
      content: comment[postId] || "",
      createdAt: new Date().toISOString(),
    };

    try {
      await fetchPostComment(commentData);

      setComment((prevComments) => ({
        ...prevComments,
        [postId]: "",
      }));

      setCommentCount((prevCount) => prevCount + 1);
      await fetchGetBlog(Cookies.get("userId"), currentPage, 10); 
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComment((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };
  return (
    <div>
      <div>
        {blog && blog.length > 0 ? (
          blog.map((post, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-8 shadow-md bg-white border-orange-300"
              style={{ cursor: "pointer" }}
            >
              <div className="flex justify-between mb-2">
                <div className="flex">
                  <Avatar size={44} src={avatarUrl} />
                  <div className="ml-2">
                    <h2 className="font-bold text-orange-600">{userName}</h2>
                    <p className="text-gray-500">{email}</p>
                  </div>
                </div>
                <div>
                  <Dropdown
                    menu={{
                      items,
                      onClick: (e) => onClick(e, post),
                    }}
                    trigger={["click"]}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <SmallDashOutlined className="flex justify-end" />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </div>
              <p className="text-lg">{post.content}</p>

              {/* Image grid */}
              {post.blogImgs && post.blogImgs.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {post.blogImgs.slice(0, 1).map((imgObj) => (
                    <Image
                      key={imgObj.blogImgId}
                      width="100%"
                      height={300}
                      src={imgObj.img}
                      style={{ objectFit: "cover" }}
                    />
                  ))}
                  {post.blogImgs.length > 1 && (
                    <div className="relative">
                      <Image
                        key={post.blogImgs[1].blogImgId}
                        width="100%"
                        height={300}
                        src={post.blogImgs[1].img}
                        style={{ objectFit: "cover" }}
                      />
                      {post.blogImgs.length > 2 && (
                        <div
                          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center "
                          onClick={() => handleImageClick(post)}
                        >
                          <p className="text-white text-2xl font-bold">
                            +{post.blogImgs.length - 2}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500 my-3">
                <p className="text-sm text-gray-400">
                  {formatDate(post.createdAt)}
                </p>
                <div className="flex">
                  <div className="flex items-center mr-4">
                    <RetweetOutlined className="mr-1" /> {post.shareCount || 0}{" "}
                    Shares
                  </div>
                  <div className="flex items-center">
                    ❤️ {post.likeCount || 0} Likes
                  </div>
                </div>
              </div>
              <div className="my-5 space-y-3">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div
                      key={comment.commentId}
                      className="border-t border-gray-200 pt-2 mt-2"
                    >
                      <div className="flex items-center mb-2">
                        {comment.user ? (
                          <>
                            <Avatar size={32} src={comment.user.profileImage} />
                            <div className="ml-2">
                              <h3 className="font-semibold text-gray-700">
                                {comment.user.fullName}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {comment.user.email}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="ml-2">
                            <h3 className="font-semibold text-gray-700">
                              Anonymous
                            </h3>
                            <p className="text-xs text-gray-500">
                              No email provided
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet</p>
                )}
              </div>
              <Form onFinish={() => handleCommentSubmit(post.postId)}>
                <Form.Item>
                  <Input.TextArea
                    rows={2}
                    value={comment[post.postId] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.postId, e.target.value)
                    }
                    placeholder="Write a comment..."
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!comment[post.postId]?.trim()}
                  >
                    Comment
                  </Button>
                </Form.Item>
              </Form>
            </div>
          ))
        ) : (
          <p className="text-lg">No blog posts available</p>
        )}
      </div>

      {/* Images Modal */}
      {selectedPost && isImagesModalVisible && (
        <Modal
          title="All Images"
          open={isImagesModalVisible}
          onCancel={handleCloseModals}
          footer={null}
          centered
          width={800}
        >
          <div className="grid grid-cols-2 gap-4">
            {selectedPost.blogImgs.map((imgObj) => (
              <Image
                key={imgObj.blogImgId}
                width="100%"
                height={300}
                src={imgObj.img}
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditMode && (
        <Modal
          title="Edit Blog Post"
          open={isEditModalVisible}
          onCancel={handleCloseModals}
          footer={null}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleUpdateBlog}>
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Please enter the content" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Images">
              <Upload
                accept=".jpg,.jpeg,.png"
                listType="picture-card"
                fileList={images.map((image, index) => {
                  let url;
                  if (image instanceof File) {
                    url = URL.createObjectURL(image);
                  } else if (typeof image === "string") {
                    url = image;
                  }

                  return {
                    uid: index.toString(),
                    name: image?.name || `image-${index}`,
                    status: "done",
                    url,
                  };
                })}
                onChange={handleImageUpload}
                onRemove={(file) => {
                  const newImages = images.filter(
                    (_, i) => i !== parseInt(file.uid, 10)
                  );
                  setImages(newImages);
                }}
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div className="mt-2">Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Blog
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalElements}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
}

export default YourBlog;
