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

const useBlog = create((set) => ({
  blog: [],
  fetchGetBlog: async (userId, pageNumber, pageSize) => {
    try {
      const res = await getBlog(userId, pageNumber, pageSize);
      console.log("blog:", res.data.data.data);
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
      console.log("API Response:", res.data.data.data);

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
      console.log("Comment posted successfully:", response.data);
    } catch (error) {
      console.error(
        "Error posting comment:",
        error.response?.data || error.message
      );
    }
  },
  fetchPostLike: async (blogId, userId) => {
    try {
      const response = await postLikeBlog(blogId, userId);
      console.log("Like posted successfully:", response.data);
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
      console.log("BlogVip posted successfully:", response.data);
    } catch (error) {
      console.error(
        "Error posting blog:",
        error.response?.data || error.message
      );
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
      console.log("Blog deleted successfully:", response.data);
    } catch (error) {
      console.error("Error delete blog:", error);
    }
  },
}));

export default useBlog;
