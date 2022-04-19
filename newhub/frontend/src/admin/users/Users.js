import React, { useEffect } from "react";
import SideBar from "../../component/admin/sideBar/SideBar";
import { useSelector, useDispatch } from "react-redux";
import MessageBox from "../../component/errorSucess/MessageBox";
import LoadingBox from "../../component/errorSucess/LoadingBox";
import { deleteUser, listUsers } from "../../actions/userAction";
import { USER_DETAILS_RESET } from "../../constant/userConstant";

export default function Users(props) {
  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUsers());
    dispatch({ type: USER_DETAILS_RESET });
  }, [dispatch, successDelete]);

  const deleteHandler = (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(user._id));
    }
  };

  return (
    <div className="adm-container">
      <div className="adm-wrap-one">
        <SideBar />
      </div>
      <div className="adm-wrap-two">
        <div className="adm-header">
          <div className="adm-title">ALL USERS</div>
        </div>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
        {successDelete && (
          <MessageBox variant="success">User Deleted Successfully</MessageBox>
        )}

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="adm-body">
            <div className="adm">
              <div className="pyn-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Is Seller</th>
                      <th>Is Admin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr>
                        <td>
                          <div>
                            {user.first_name}
                            <strong>{user.other_name}</strong>
                          </div>
                        </td>
                        <td>
                          <div>{user.email}</div>
                        </td>
                        <td>
                          <div>{user.phone}</div>
                        </td>
                        <td>{user.isSeller ? "YES" : "NO"}</td>
                        <td>{user.isAdmin ? "YES" : "NO"}</td>
                        <td>
                          <button
                            className="pyn-update"
                            onClick={() =>
                              props.history.push(`/all-users/${user._id}/edit`)
                            }
                          >
                            update
                          </button>
                          <button
                            className="pyn-delete"
                            onClick={() => deleteHandler(user)}
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
        <div className="adm-footer">
          2022 Copyright. Quadila Inc. All right reserved
        </div>
      </div>
    </div>
  );
}
