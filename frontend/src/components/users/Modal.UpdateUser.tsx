import { Form, message, Modal, Row, Typography } from "antd";
import { usersApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { UpdatePasswordField, UpdateRoleField } from "./Fields.Update";

interface UpdateUserModalProps {
  showModal: boolean;
  setShowModal: any;
  setIsRefresh: any;
  user: any;
}
export default function UpdateUserModal(props: UpdateUserModalProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { showModal, setShowModal, setIsRefresh, user } = props;

  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [updateForm] = Form.useForm();
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

  function handleUpdate() {
    updateForm
      .validateFields()
      .then(() => {
        const updateData = updateForm.getFieldsValue();
        setPassword(updateData.password);
        setRole(updateData.role);
        setIsFormValid(true);
      })
      .catch((error: any) => {
        const hasErrors = error.errorFields.length > 0;
        setIsFormValid(!hasErrors);
      });
  }

  function handleCancel() {
    updateForm.resetFields();
    setShowModal(false);
  }

  async function updateHandler() {
    try {
      await await usersApi.update(user?.id, { password, role });

      messageApi.success("User updated!");
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
      updateHandler();
    }
  }, [isFormValid]);

  useEffect(() => {
    if (error) {
      messageApi.error(`Unable to update: ${error}`);
      setError(undefined);
    }
  }, [error]);

  return (
    <Modal
      open={showModal}
      okText="Update"
      onOk={handleUpdate}
      onCancel={() => {
        handleCancel();
      }}
    >
      {contextHolder}
      <div className="center-div">
        <Row style={{ marginTop: 12 }}>
          <Form form={updateForm}>
            <Row style={{ marginBottom: 12 }}>
              <Typography.Title level={4}>Update User</Typography.Title>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Typography.Text><label>Username: </label>{user?.username}</Typography.Text>
            </Row>
            <Row>
              <UpdatePasswordField value={password} />
            </Row>
            <Row>
              <UpdateRoleField value={user?.role} optionsList={roles} />
            </Row>
          </Form>
        </Row>
      </div>
    </Modal>
  );
}
