import { Button, Card, Row, Table } from "antd";
import { useEffect, useState } from "react";
import StreamAudioModal from "./Modal.StreamAudio";
import { dateInSGT } from "../../utils/utils";

interface AudioListProps {
  files: any;
}

export default function AudioList(props: AudioListProps) {
  const { files } = props;
  const [data, setData] = useState<any>();
  const [fileId, setFileId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const columns: any = [
    {
      title: "S/N",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 250,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 250,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 200,
    },
    {
      title: "Size (MB)",
      dataIndex: "size",
      width: 100,
    },
    {
      title: "Uploaded",
      dataIndex: "uploaded",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      fixed: "right",
    },
  ];

  function processData(audioFiles: any) {
    const processedData = audioFiles?.map((file: any, index: number) => {
      return {
        key: file.id,
        id: index + 1,
        name: file.original_name,
        description: file.description,
        category: file.category,
        size: (file.size_bytes / (1024 * 1024)).toFixed(2),
        uploaded: dateInSGT(new Date(file.created_at)),
        action: (
          <Button type="link" onClick={() => handlePlay(file.id)}>
            Play
          </Button>
        ),
      };
    });
    setData(processedData);
  }

  function handlePlay(fileId: string) {
    setFileId(fileId);
    setShowModal(true);
  }

  useEffect(() => {
    if (files) {
      console.log("files: ", files);
      processData(files);
    }
  }, [files]);

  return (
    <Row>
      <StreamAudioModal
        fileId={fileId}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <Card title={"Audio List"}>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </Row>
  );
}
