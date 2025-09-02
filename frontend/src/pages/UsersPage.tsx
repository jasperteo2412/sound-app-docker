import { Button, Card, Form, message, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "../components/login/Fields.Login";
import { usersApi } from "../utils/api";
import CreateUserModal from "../components/users/Modal.CreateUser";
import ManageUsers from "../components/users/ManageUsers";

interface UsersPageProps {
  user: any;
  loggedIn: boolean;
  setLoggedIn: any;
}

export default function UsersPage(props: UsersPageProps) {
  const { loggedIn = false, setLoggedIn, user } = props;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [changePasswordForm] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  //Admin functions
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  function handlePassword() {
    changePasswordForm
      .validateFields()
      .then(() => {
        const changePwData = changePasswordForm.getFieldsValue();
        console.log("changePasswordForm: ", changePwData);
        setPassword(changePwData.password);
        setIsFormValid(true);
      })
      .catch((error: any) => {
        const hasErrors = error.errorFields.length > 0;
        setIsFormValid(!hasErrors);
      });
  }

  async function updateHandler() {
    try {
      await usersApi.update(user?.id, { password });
      messageApi.success("Password updated successfully!");
      setPassword("");
      changePasswordForm.resetFields();
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await usersApi.remove(user?.id);
      messageApi.success("Account has been deleted!");
      setLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function handleAdminDelete(user: string) {
    try {
      await usersApi.remove(user);
      messageApi.success("User has been deleted!");
      setIsRefresh(true);
    } catch (error: any) {
      setError(error.message);
    }
  }

  function handleAdd() {
    setShowModal(true);
  }

  useEffect(() => {
    if (isFormValid) {
      setLoading(true);
      setIsFormValid(false);
      updateHandler();
    }
  }, [isFormValid]);

  async function refresh() {
    try {
      const { users } = await usersApi.list();
      setList(users);
    } catch (error: any) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if(isRefresh){
        refresh();
        setIsRefresh(false);
    }
  }, [isRefresh]);

  useEffect(()=>{
    if(user?.role === "admin"){
      setIsRefresh(true);
    }
  }, [user]);

  useEffect(() => {
    if (!loggedIn) {
      //   setLoading(true);
      navigate("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (error) {
      messageApi.error(`Unable to load data: ${error}`);
      setError(undefined);
    }
  }, [error]);

  return (
    <Row>
      <Spin spinning={loading} tip={"Loading..."}>
        <Card
          title={"User Account"}
          className="custom-card"
          extra={
            <Button danger type="primary" onClick={handleDelete}>
              Delete Account
            </Button>
          }
        >
          {contextHolder}
          <Row>
            <Typography.Text>
              Username: <strong>{user?.username}</strong>
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Text>
              Role: <strong>{user?.role}</strong>
            </Typography.Text>
          </Row>
          <Row>
            <Form form={changePasswordForm}>
              <Row>
                <PasswordField value={password} />
              </Row>
              <Row>
                <Button type="primary" onClick={handlePassword}>
                  Change Password
                </Button>
              </Row>
            </Form>
          </Row>
        </Card>
        <CreateUserModal showModal={showModal} setShowModal={setShowModal} setIsRefresh={setIsRefresh} />
        <Card
          title={"Manage Users"}
          className="custom-card"
          style={{ visibility: user?.role === "admin" ? "visible" : "hidden" }}
          extra={
            <Button type="primary" onClick={handleAdd}>
              Add Account
            </Button>
          }
        >
            <ManageUsers list={list} setIsRefresh={setIsRefresh} handleAdminDelete={handleAdminDelete} user={user} />
        </Card>
      </Spin>
    </Row>
  );
}
