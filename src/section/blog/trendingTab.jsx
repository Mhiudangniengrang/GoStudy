import React, { useEffect, useState } from "react";
import {
  Avatar,
  Image,
  Modal,
  Pagination,
  Spin,
  Input,
  Button,
  Form,
  message,
} from "antd";
import { RetweetOutlined, HeartOutlined } from "@ant-design/icons";
import useBlog from "../../hooks/useBlog";
import Cookies from "js-cookie";

function TrendingTab({ refreshTrending }) {
  const {
    getAllBlog,
    fetchGetAllBlog,
    totalElements,
    fetchPostComment,
    fetchPostLike,
  } = useBlog();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comment, setComment] = useState({});
  const [commentCount, setCommentCount] = useState(0); // Track comment count
  const userId = Number(Cookies.get("userId"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchGetAllBlog({ pageNumber: currentPage, pageSize });
      setLoading(false);
    };

    fetchData();
  }, [fetchGetAllBlog, currentPage, pageSize, refreshTrending]);

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

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  const handleCommentChange = (postId, value) => {
    setComment((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

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

      // Increment comment count
      setCommentCount((prevCount) => prevCount + 1);

      await fetchGetAllBlog({ pageNumber: currentPage, pageSize });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await fetchPostLike(postId, userId);
      console.log("Like posted successfully");

      await fetchGetAllBlog({ pageNumber: currentPage, pageSize });
    } catch (error) {
      console.error("Error posting like:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-4 grid-cols-1">
          {Array.isArray(getAllBlog) && getAllBlog.length > 0 ? (
            getAllBlog.map((post, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 shadow-md bg-white border-orange-300"
              >
                <div className="flex items-center mb-2">
                  {post.userViewModel ? (
                    <>
                      <Avatar size={44} src={post.userViewModel.profileImage} />
                      <div className="ml-2">
                        <h2 className="font-bold text-orange-600">
                          {post.userViewModel.fullName}
                        </h2>
                        <p className="text-gray-500">
                          {post.userViewModel.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="ml-2">
                      <h2 className="font-bold text-orange-600">Anonymous</h2>
                      <p className="text-gray-500">No email provided</p>
                    </div>
                  )}
                </div>
                <p className="text-lg">{post.content}</p>
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
                            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
                            onClick={() => handleOpenModal(post)}
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
                      <RetweetOutlined className="mr-1" />{" "}
                      {post.shareCount || 0} Shares
                    </div>
                    <div className="flex items-center">
                      <Button
                        type="link"
                        onClick={() => handleLikePost(post.postId)}
                      >
                        <HeartOutlined className="mr-1" />
                        ❤️ {post.likeCount || 0} Likes
                      </Button>
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
                          {comment.user && comment.user.userId === userId ? (
                            <>
                              <Avatar
                                size={32}
                                src={comment.user.profileImage}
                              />
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
                        <p className="text-sm text-gray-600">
                          {comment.content}
                        </p>
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
      )}

      {selectedPost && (
        <Modal
          title="All Images"
          open={isModalVisible}
          onCancel={handleCloseModal}
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

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalElements}
        onChange={handlePageChange}
        className="mt-4"
      />
    </div>
  );
}

export default TrendingTab;
