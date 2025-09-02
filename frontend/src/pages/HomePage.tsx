import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { filesApi } from "../utils/api";
import { Button, Card, Col, Input, Row, Select, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AudioList from "../components/home/AudioList";

interface HomePageProps {
  user: any;
  loggedIn: boolean;
  setLoggedIn: any;
}

export default function HomePage(props: HomePageProps) {
  const { loggedIn = false, setLoggedIn, user } = props;
  const navigate = useNavigate();
  const { Title, Text } = Typography;

  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Podcast",
      value: "Podcast",
    },
    {
      label: "Lecture",
      value: "Lecture",
    },
    {
      label: "Music",
      value: "Music",
    },
    {
      label: "Audiobook",
      value: "Audiobook",
    },
    {
      label: "General",
      value: "General",
    },
  ];

  async function refresh() {
    const { files } = await filesApi.list();
    setFiles(files);
  }

  const filtered = useMemo(
    () =>
      files
        .filter((f: any) => category === "All" || f.category === category)
        .filter(
          (f: any) =>
            !query ||
            (f.description + " " + f.original_name)
              .toLowerCase()
              .includes(query.toLowerCase())
        ),
    [files, query, category]
  );

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      //   setLoading(true);
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <Card
      title={`Welcome, ${user?.username}`}
      className="custom-card"
      extra={
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => navigate("/upload")}
        >
          Upload
        </Button>
      }
    >
      <Row>
        <Title level={3}>Your files</Title>
      </Row>
      <Row>
        <Col className="col-space-10px" span={6}>
          <Input
            className="custom-input"
            placeholder={"Search..."}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </Col>
        <Col className="col-space-10px" span={6}>
          <Select
            className="custom-input"
            options={categories}
            defaultValue={"All"}
            onChange={(value) => {
              setCategory(value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <AudioList files={filtered} />
      </Row>
    </Card>
  );
}
