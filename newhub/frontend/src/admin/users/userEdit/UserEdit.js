import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUser } from "../../../actions/userAction";
import LoadingBox from "../../../component/errorSucess/LoadingBox";
import MessageBox from "../../../component/errorSucess/MessageBox";
import { USER_UPDATE_RESET } from "../../../constant/userConstant";

export default function UserEdit(props) {
  const userId = props.match.params.id;

  const [first_name, setFirst_name] = useState("");
  const [other_name, setOther_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
      if (successUpdate) {
            dispatch({type: USER_UPDATE_RESET})
          props.history.push("/all-users")
      }
    if (!user) {
      dispatch(detailsUser(userId));
    } else {
      setFirst_name(user.first_name);
      setOther_name(user.other_name);
      setEmail(user.email);
      setPhone(user.phone);
      setIsSeller(user.isSeller);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, props.history, successUpdate, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: userId,
        first_name,
        other_name,
        phone,
        email,
        isSeller,
        isAdmin,
      })
    );
  };

  return (
    <div>
      <form className="name" onSubmit={submitHandler}>
        <div>Edit User</div>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {successUpdate && (
          <MessageBox variant="success">
            User info updated successfully
          </MessageBox>
        )}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div className="pyx-form">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                placeholder="First name"
                id="first_name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
              />
            </div>
            <div className="pyx-form">
              <label htmlFor="other_name">Other Name</label>
              <input
                type="text"
                placeholder="Other name"
                id="other_name"
                value={other_name}
                onChange={(e) => setOther_name(e.target.value)}
              />
            </div>
            <div className="pyx-form">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pyx-form">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                placeholder="Phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="pyx-form">
              <label htmlFor="isSeller">Is Seller? </label>
              <input
                type="checkbox"
                id="isSeller"
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              />
            </div>
            <div className="pyx-form">
              <label htmlFor="isAdmin">Is Admin? </label>
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </div>
            <div className="pyx-form">
              <button type="submit">Submit</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
