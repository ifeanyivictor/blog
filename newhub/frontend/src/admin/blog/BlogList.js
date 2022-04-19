import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import './blog.css'
import { createBlog, deleteBlog, listAllBlogs } from "../../actions/blog";
import LoadingBox from "../../component/errorSucess/LoadingBox";
import MessageBox from "../../component/errorSucess/MessageBox";
import {
  BLOG_CREATE_RESET,
  BLOG_DELETE_RESET,
} from "../../constant/blogConstant";

export default function BlogList(props) {
  const blogListAll = useSelector((state) => state.blogListAll);
  const { loading, error, blogs } = blogListAll;

  const blogCreate = useSelector((state) => state.blogCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    blogs: createdBlog,
  } = blogCreate;

  const blogDelete = useSelector((state) => state.blogDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = blogDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: BLOG_CREATE_RESET });
      props.history.push(`/list-blog/${createdBlog._id}/blog-new`);
    }
    if (successDelete) {
      dispatch({ type: BLOG_DELETE_RESET });
    }
    dispatch(listAllBlogs({}));
  }, [dispatch, createdBlog, successCreate, props.history, successDelete]);

  const handleDelete = (blogs) => {
    if (window.confirm("Are you sure to delete?")) {
      dispatch(deleteBlog(blogs._id));
    }
  };

  const createHandler = () => {
    dispatch(createBlog());
  };

  return (
    <div className="max-width adm-container">
      <div className="adm-wrap-two">
        <div className="adm-header">
          <div type="button" className="adm-title">
            SELLER STORY
          </div>
        </div>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
        {loadingCreate && <LoadingBox></LoadingBox>}
        {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="adm-body">
            <div>
              <button
                type="button"
                onClick={createHandler}
                className="create-action"
              >
                Create New Post
              </button>
            </div>
            <div className="adm">
              <div className="pyn-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Approve</th>
                      <th>Reject</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((item) => (
                      <tr>
                        <td>
                          <div key={item._id} className="pyn-img-bx">
                            <img className="pyn-img" src={item.photo} alt="" />
                          </div>
                        </td>

                        <td>
                          <Link
                            to={`/story-detail/${item._id}`}
                            style={{ textDecoration: "none" }}
                          >
                            {item.title}
                          </Link>
                        </td>
                        <td>
                          <div>{new Date(item.createdAt).toDateString()}</div>
                        </td>
                        <td>{item.isApprove ? "YES" : "NO"}</td>
                        <td>{item.isRejected ? "YES" : "NO"}</td>
                        <td>
                          <button
                            className="pyn-update"
                            onClick={() =>
                              props.history.push(
                                `/list-blog/${item._id}/blog-new`
                              )
                            }
                          >
                            update
                          </button>
                          <button
                            className="pyn-delete"
                            onClick={() => handleDelete(item)}
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
