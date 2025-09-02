import { Button, Form, message, Modal, Row, Typography } from "antd";
import { usersApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { create } from "domain";
import { UsernameField, PasswordField, RoleField } from "../login/Fields.Login";

interface CreateUserModalProps {
  showModal: boolean;
  setShowModal: any;
  setIsRefresh: any;
}
export default function CreateUserModal(props: CreateUserModalProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { showModal, setShowModal, setIsRefresh } = props;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [createForm] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const roles = [
    {
      label: "User",
      value: "user",
    },
    {
      label: "Admin",
      value: "admin",
    },
  ];

  function handleCreate() {
    createForm
      .validateFields()
      .then(() => {
        const createData = createForm.getFieldsValue();
        console.log("createData: ", createData);
        setUsername(createData.username);
        setPassword(createData.password);
        setRole(createData.role);
        setIsFormValid(true);
      })
      .catch((error: any) => {
        const hasErrors = error.errorFields.length > 0;
        setIsFormValid(!hasErrors);
      });
  }

  function handleCancel() {
    createForm.resetFields();
    setShowModal(false);
  }

  async function createHandler() {
    try {
      await usersApi.create({ username, password, role });

      messageApi.success("User created!");
      setUsername("");
      setPassword("");
      setRole("");
      setIsRefresh(true);
      setShowModal(false);
    } catch (error: any) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if (isFormValid) {
      setLoading(true);
      setIsFormValid(false);
      createHandler();
    }
  }, [isFormValid]);

  useEffect(() => {
    if (error) {
      messageApi.error(`Unable to login: ${error}`);
      setError(undefined);
    }
  }, [error]);

  return (
    <Modal
      open={showModal}
      okText="Create"
      onOk={handleCreate}
      onCancel={() => {
        handleCancel();
      }}
    >
      {contextHolder}
      <div className="center-div">
        <Row style={{ marginTop: 12 }}>
          <Form form={createForm}>
            <Row style={{ marginBottom: 12 }}>
              <Typography.Title level={4}>Create User</Typography.Title>
            </Row>
            <Row>
              <UsernameField value={username} />
            </Row>
            <Row>
              <PasswordField value={password} />
            </Row>
            <Row>
              <RoleField value={role} optionsList={roles} />
            </Row>
          </Form>
        </Row>
      </div>
    </Modal>
  );
}
