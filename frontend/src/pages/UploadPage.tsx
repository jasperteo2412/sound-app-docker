import { message, Row, Col, Card, Button, Form, Progress, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CategoryField,
  DescriptionField,
  UploadButtonField,
} from "../components/upload/Fields.Upload";
import { UploadProps } from "antd/es/upload/Upload";
import { filesApi } from "../utils/api";

interface UploadPageProps {
  user: any;
  loggedIn: boolean;
  setLoggedIn: any;
}

export default function UploadPage(props: UploadPageProps) {
  const { loggedIn = false, setLoggedIn, user } = props;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [file, setFile] = useState<any>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(undefined);

  const [uploadForm] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const categories = [
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

  const uploadProps: UploadProps = {
    name: "file",
    accept: "audio/*,video/mp4,video/x-msvideo",
    beforeUpload: () => false,
    fileList: fileList
  };

  const handleFile = (e: any) => {
    if (e) {
      setFile(e.file);
      setFileList(e?.fileList);
    }
  };

  function handleUpload() {
    uploadForm
      .validateFields()
      .then(() => {
        const uploadData = uploadForm.getFieldsValue();
        console.log("uploadData: ", uploadData);
        setDescription(uploadData.description);
        setCategory(uploadData.category);
        setIsFormValid(true);
      })
      .catch((error: any) => {
        const hasErrors = error.errorFields.length > 0;
        setIsFormValid(!hasErrors);
      });
  }

  async function uploadHandler() {
    if (!file) return;
    console.log("file: ", file);
    const form = new FormData();
    form.append("file", file);
    form.append("description", description);
    form.append("category", category);

    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", filesApi.uploadUrl());
      xhr.withCredentials = true;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve("success")
          : reject(new Error(xhr.responseText || xhr.statusText));
      xhr.onerror = reject;
      xhr.send(form);
    }).catch((error) => {
      setError(JSON.parse(error.message).error);
    });
    
    if(response === 'success'){
        messageApi.success(`Successfully uploaded file: ${description}`);
        uploadForm.resetFields();
        setFileList([]);
    }

    setLoading(false);
    setProgress(0);
    setFile(null);
    setDescription("");
    setCategory("");
  }

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (isFormValid) {
      setLoading(true);
      setIsFormValid(false);
      uploadHandler();
    }
  }, [isFormValid]);

  useEffect(() => {
    if (error) {
      messageApi.error(`Upload failed: ${error}`);
      setError(undefined);
    }
  }, [error]);

  return (
    <Row>
      {contextHolder}
      <Col className="center-container">
        <Card title={"Upload File"}>
          <Row style={{ padding: "20px" }}>
            <UploadButtonField
              uploadProps={uploadProps}
              handleValue={handleFile}
            />
          </Row>
          <Form form={uploadForm}>
            <Row>
              <DescriptionField value={""} />
            </Row>
            <Row>
              <CategoryField value={""} optionsList={categories} />
            </Row>
            <Row>
              <Button type="primary" onClick={handleUpload}>
                Save
              </Button>
            </Row>
            <Row style={{ visibility: loading ? "visible" : "hidden" }}>
              <Progress percent={progress} />
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
