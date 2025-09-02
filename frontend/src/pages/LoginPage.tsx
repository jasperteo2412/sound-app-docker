import { Button, Card, Col, Form, message, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { PasswordField, UsernameField } from "../components/login/Fields.Login";
import { useNavigate } from "react-router-dom";
import { authApi } from "../utils/api";

interface LoginPageProps {
  loggedIn: boolean;
  setLoggedIn: any;
  setUser: any;
}

export default function LoginPage(props: LoginPageProps) {
  const { loggedIn = false, setLoggedIn, setUser } = props;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [loginForm] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  function handleLogin() {
    loginForm
      .validateFields()
      .then(() => {
        const loginData = loginForm.getFieldsValue();
        console.log("loginData: ", loginData);
        setUsername(loginData.username);
        setPassword(loginData.password);
        setIsFormValid(true);
      })
      .catch((error: any) => {
        const hasErrors = error.errorFields.length > 0;
        setIsFormValid(!hasErrors);
      });
  }

  async function loginHandler() {
    try {
      const { user } = await authApi.login(username, password);
      console.log("user: ", user);
      setUser(user);
      sessionStorage.setItem("user", user);
      setLoggedIn(true);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFormValid) {
      setLoading(true);
      setIsFormValid(false);
      loginHandler();
    }
  }, [isFormValid]);

  useEffect(() => {
    if (loggedIn) {
      setLoading(true);
      navigate("/home");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (error) {
      messageApi.error(`Unable to login: ${error}`);
      setError(undefined);
    }
  }, [error]);

  return (
    <Row>
      {contextHolder}
      <Col className="center-container">
        {loading ? (
          <Spin spinning={loading} tip={"Loading..."} />
        ) : (
          <Card title={"Login"}>
            <Form form={loginForm}>
              <Row>
                <UsernameField value={username} />
              </Row>
              <Row>
                <PasswordField value={password} />
              </Row>
              <Row>
                <Button type="primary" onClick={handleLogin}>
                  Login
                </Button>
              </Row>
            </Form>
          </Card>
        )}
      </Col>
    </Row>
  );
}
