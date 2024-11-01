import { create } from "zustand";
import {
  deleteBlogUser,
  getAllBlog,
  getBlog,
  postBlogUser,
  postBlogUserVip,
  postCommentBlog,
  postLikeBlog,
  putBlogUser,
} from "../api/blogApi";
import { notification } from "antd";

const useBlog = create((set) => ({
  blog: [],
  fetchGetBlog: async (userId, pageNumber, pageSize) => {
    try {
      const res = await getBlog(userId, pageNumber, pageSize);
      if (res && res.status === 200) {
        set({
          blog: res.data.data.data,
          totalElements: res.data.data.totalCount,
        });
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  },

  getAllBlog: [],
  fetchGetAllBlog: async ({ pageNumber }) => {
    try {
      const res = await getAllBlog({ pageNumber, pageSize: 10 });

      if (res && res.status === 200) {
        set({
          getAllBlog: res.data.data.data,
          totalElements: res.data.data.totalCount,
        });
      }
    } catch (err) {
      console.error("Error fetching all blog:", err);
    }
  },

  fetchPostBlog: async (userid, formData) => {
    try {
      const response = await postBlogUser(userid, formData);
      console.log("Blog posted successfully:", response.data);
    } catch (error) {
      console.error(
        "Error posting blog:",
        error.response?.data || error.message
      );
    }
  },
  fetchPostComment: async (commentData) => {
    try {
      const response = await postCommentBlog(commentData);
    } catch (error) {
      if (error.response?.status === 400) {
        notification.info({
          message: error.response.data.message,
          description:
            "Upgrade your package if you need more." || "Bad Request",
          duration: 2,
        });
      } else {
        console.error(
          "Error posting comment:",
          error.response?.data || error.message
        );
      }
    }
  },

  fetchPostLike: async (blogId, userId) => {
    try {
      const response = await postLikeBlog(blogId, userId);
    } catch (error) {
      console.error(
        "Error posting like:",
        error.response?.data || error.message
      );
    }
  },

  fetchPostBlogVip: async (userid, formData) => {
    try {
      const response = await postBlogUserVip(userid, formData);

      if (response.status === 200) {
        notification.success({
          message: "Blog",
          description: response.data.message,
          duration: 2,
        });
      }

      console.log("BlogVip posted successfully:", response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        notification.info({
          message: error.response.data.message,
          description:
            "Upgrade your package if you need more." || "Bad Request",
          duration: 2,
        });
      } else {
        console.error(
          "Error posting BlogVip:",
          error.response?.data || error.message
        );
      }
    }
  },

  fetchUpdateUser: async (postId, data) => {
    try {
      const response = await putBlogUser(postId, data);
      console.log("Blog updated successfully:", response.data);
    } catch (error) {
      console.error(
        "Error updating blog:",
        error.response?.data || error.message
      );
    }
  },
  fetchDeleteBlog: async (postId) => {
    try {
      const response = await deleteBlogUser(postId);
    } catch (error) {
      console.error("Error delete blog:", error);
    }
  },
}));

export default useBlog;
