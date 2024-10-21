import React from "react";
import { Helmet } from "react-helmet";
import { BlogView } from "../section/blog/view";

function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Blog </title>
      </Helmet>
      <BlogView />
    </>
  );
}

export default BlogPage;
