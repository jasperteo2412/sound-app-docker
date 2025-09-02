import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload, UploadProps } from "antd";

interface DescriptionFieldProps {
  value: string;
}
export function DescriptionField(props: DescriptionFieldProps) {
  return (
    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true, message: "Please enter file description!" }]}
      style={{ minWidth: "20vw" }}
    >
      <Input placeholder="Description" />
    </Form.Item>
  );
}

interface CategoryFieldProps {
  value: string;
  optionsList: any;
}
export function CategoryField(props: CategoryFieldProps) {
  const { optionsList } = props;

  return (
    <Form.Item
      name="category"
      label={<label style={{ paddingRight: "13px" }}>Category</label>}
      rules={[{ required: true, message: "Please select file category!" }]}
      style={{ minWidth: "20vw" }}
    >
      <Select placeholder="Category" options={optionsList} />
    </Form.Item>
  );
}

interface UploadButtonFieldProps {
  uploadProps: UploadProps;
  handleValue: any;
}
export function UploadButtonField(props: UploadButtonFieldProps) {
  const { uploadProps, handleValue } = props;
  return (
    <Form.Item
      label="Upload Audio File"
      name="audio"
      valuePropName="fileList"
      getValueFromEvent={handleValue}
      rules={[{ required: true, message: "Please upload an audio file!" }]}
    >
      <Upload {...uploadProps} maxCount={1}>
        <Button type="default" icon={<UploadOutlined />}>
          Upload (Max: 1)
        </Button>
      </Upload>
    </Form.Item>
  );
}
