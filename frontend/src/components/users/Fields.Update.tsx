import {
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Form, Input, Select } from "antd";

interface PasswordFieldProps {
  value: string;
}
export function UpdatePasswordField(props: PasswordFieldProps) {
  return (
    <Form.Item
      name="password"
      label="Password"
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
export function UpdateRoleField(props: RoleFieldProps) {
  const { value, optionsList } = props;

  return (
    <Form.Item
      name="role"
      label={<label style={{ paddingRight: "13px" }}>Role</label>}
      style={{ minWidth: "20vw" }}
    >
      <Select placeholder="Role" defaultValue={value} options={optionsList} />
    </Form.Item>
  );
}
