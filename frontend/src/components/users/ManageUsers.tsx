import { Button, Col, Flex, Row, Table } from "antd";
import { useEffect, useState } from "react";
import UpdateUserModal from "./Modal.UpdateUser";
import { dateInSGT } from "../../utils/utils";

interface ManageUsersProps {
  list: any;
  setIsRefresh: any;
  handleAdminDelete: any;
  user: any;
}
export default function ManageUsers(props: ManageUsersProps) {
  const { list, setIsRefresh, handleAdminDelete, user } = props;

  const [data, setData] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns: any = [
    {
      title: "S/N",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: 250,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 250,
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      fixed: "right",
    },
  ];

  function processData(list: any) {
    const processedData = list?.filter((users: any) => user.id !== users.id).map((users: any) => {
      return {
        id: users.id,
        username: users.username,
        role: users.role,
        createdOn: dateInSGT(new Date(users.created_at)),
        action: (
          <Row>
            <Flex gap={2}>
              <Col>
                <Button type="link" onClick={() => handleUpdate(users)}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={() => handleAdminDelete(users.id)}>
                  Delete
                </Button>
              </Col>
            </Flex>
          </Row>
        ),
      };
    });
    setData(processedData);
  }

  function handleUpdate(users: any) {
    setSelectedUser(users);
    setShowModal(true);
  }

  useEffect(() => {
    if (list) {
      console.log("list: ", list);
      processData(list);
    }
  }, [list]);

  return (
    <Row>
        <UpdateUserModal showModal={showModal} setShowModal={setShowModal} setIsRefresh={setIsRefresh} user={selectedUser} />
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
      />
    </Row>
  );
}
