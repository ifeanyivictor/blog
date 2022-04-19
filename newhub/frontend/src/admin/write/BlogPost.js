import React, { useState, useEffect } from "react";
import Axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./write.css";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../../component/errorSucess/LoadingBox";
import MessageBox from "../../component/errorSucess/MessageBox";
import { BLOG_UPDATE_RESET } from "../../constant/blogConstant";
import { detailsBlog, updateBlog } from "../../actions/blog";


export default function BlogPost(props) {
  const blogId = props.match.params.id;
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [highlight, setHighlight] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [isApprove, setIsApprove] = useState("");
  const [isRejected, setIsRejected] = useState("");
  const [reason, setReason] = useState("");

  const blogDetails = useSelector((state) => state.blogDetails);
  const { loading, error, blogs } = blogDetails;


  const blogUpdate = useSelector((state) => state.blogUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = blogUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      props.history.push("/");
    }
    if (!blogs || blogs._id !== blogId || successUpdate) {
      dispatch({ type: BLOG_UPDATE_RESET });
      dispatch(detailsBlog(blogId));
    } else {
      setTitle(blogs.title);
      setPhoto(blogs.photo);
      setCategory(blogs.category);
      setHighlight(blogs.highlight);
      setTag(blogs.tag);
      setDesc(blogs.desc);
      setIsRejected(blogs.isRejected);
      setIsApprove(blogs.isApprove);
      setReason(blogs.reason);
    }
  }, [dispatch, blogs, blogId, successUpdate, props.history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateBlog({
        _id: blogId,
        title,
        photo,
        desc,
        highlight,
        category,
        tag,
        isApprove,
        isRejected,
        reason,
      })
    );
  };

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setPhoto(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const onEditorChange = (value) => {
    setDesc(value);
  };

  return (
    <div className="max-width">
      {loadingUpdate && <LoadingBox></LoadingBox>}
      {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
      <div className="p36-title press-box">{blogId}</div>
      <div className="adm-body">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="adm-body">
            <form className="row" onSubmit={submitHandler}>
              <div className="p36-sections">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  required
                  maxLength={25}
                  value={title}
                  placeholder="Enter name"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="p36-sections">
                <label htmlFor="name">Tag</label>
                <input
                  type="text"
                  required
                  value={tag}
                  placeholder="Tag your post"
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>
              <div className="p36-sections">
                <label htmlFor="photo">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  placeholder="Enter Category"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="p36-sections">
                <label htmlFor="photo">Photo</label>
                <input
                  type="text"
                  required
                  value={photo}
                  placeholder="Enter name"
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>
              <div className="p36-sections">
                <label htmlFor="imageFile">Images File</label>
                <input
                  type="file"
                  id="imageFile"
                  placeholder="Choose Image"
                  onChange={uploadFileHandler}
                />

                {loadingUpload && <LoadingBox></LoadingBox>}
                {errorUpdate && (
                  <MessageBox variant="danger">{errorUpload}</MessageBox>
                )}
              </div>
        
              <div className="p36-sections">
                <div>
                  <label htmlFor="name">Description</label>
                  <ReactQuill
                    placeholder="enter description"
                    modules={BlogPost.modules}
                    formats={BlogPost.formats}
                    onChange={onEditorChange}
                    value={desc}
                  />
                </div>
              </div>
              <div className="p36-sections">
                <label>Highlight</label>
                <textarea
                  type="text"
                  maxLength={100}
                  required
                  value={highlight}
                  placeholder="Enter brief story"
                  onChange={(e) => setHighlight(e.target.value)}
                />
              </div>
              <div className="pyx-form">
                <label htmlFor="approve">Approve This Story? </label>
                <input
                  type="checkbox"
                  id="approve"
                  checked={isApprove}
                  onChange={(e) => setIsApprove(e.target.checked)}
                />
              </div>
              <div className="pyx-form">
                <label htmlFor="reject">Reject This Story? </label>
                <input
                  type="checkbox"
                  id="reject"
                  checked={isRejected}
                  onChange={(e) => setIsRejected(e.target.checked)}
                />
              </div>

              <div className="pyx-form">
                <label htmlFor="reason">
                  Rejected? Give reason for rejection
                </label>
                <textarea
                  type="text"
                  id="reason"
                  placeholder="Please enter reason for rejection if any"
                  checked={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <button className="ord-btn pass" type="submit">
                Submit post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

BlogPost.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    [{ color: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};
BlogPost.formats = [
  "header",
  "font",
  "size",
  "color",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
];
