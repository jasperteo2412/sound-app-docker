import { Button, Col, Row, Space } from "antd";
import Logo from "../../images/audiohost_logo.png";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../utils/api";

interface NavBarProps {
  loggedIn?: boolean;
  setLoggedIn?: any
  username?: string;
}

export default function NavBar(props: NavBarProps) {
  const navigate = useNavigate();
  const {loggedIn = false, setLoggedIn, username = ""} = props;

  function logoutHandler(){
    authApi.logout().then(() => {
        sessionStorage.clear();
        setLoggedIn(false);
        navigate("/");
      });
  }

  return (
    <Row className="navbar">
      <Col xs={8}>
        <img
          src={Logo}
          className="logo"
          onClick={() => navigate("/")}
        />
      </Col>
      <Col xs={16} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Space
          direction="horizontal"
          size="middle"
          style={{
            display: "flex",
            visibility: loggedIn? 'visible' : 'hidden'
          }}
        >
          <Button type="link" onClick={() => navigate("/home")}>
            Home
          </Button>
          <Button type="link" onClick={() => navigate("/upload")}>
            Upload
          </Button>
          <Button type="link" onClick={() => navigate("/users")}>
            Users
          </Button>
          <Button type="link" onClick={logoutHandler}>
            Logout
          </Button>
        </Space>
      </Col>
    </Row>
  );
}
