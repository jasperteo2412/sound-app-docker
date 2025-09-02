import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Input, Select } from "antd";

interface UsernameFieldProps {
  value: string;
}
export function UsernameField(props: UsernameFieldProps) {
  return (
    <Form.Item
      name="username"
      label="Username"
      rules={[{ required: true, message: "Please enter your username!" }]}
    >
      <Input prefix={<UserOutlined />} placeholder="Username" />
    </Form.Item>
  );
}

interface PasswordFieldProps {
  value: string;
}
export function PasswordField(props: PasswordFieldProps) {
  return (
    <Form.Item
      name="password"
      label="Password"
      rules={[{ required: true, message: "Please enter your password!" }]}
    >
      <Input.Password
        prefix={<LockOutlined />}
        placeholder="Password"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Form.Item>
  );
}

interface RoleFieldProps {
  value: string;
  optionsList: any;
}
export function RoleField(props: RoleFieldProps) {
  const { value, optionsList } = props;

  return (
    <Form.Item
      name="role"
      label={<label style={{ paddingRight: "13px" }}>Role</label>}
      rules={[{ required: true, message: "Please select user role!" }]}
      style={{ minWidth: "20vw" }}
    >
      <Select placeholder="Role" defaultValue={value} options={optionsList} />
    </Form.Item>
  );
}
