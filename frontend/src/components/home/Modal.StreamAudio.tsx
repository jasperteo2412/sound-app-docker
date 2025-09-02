import { Modal, Row, Typography } from "antd";
import { filesApi } from "../../utils/api";
import { useRef } from "react";

interface StreamAudioModalProps {
  fileId: string | null;
  showModal: boolean;
  setShowModal: any;
}
export default function StreamAudioModal(props: StreamAudioModalProps) {
  const { fileId, showModal, setShowModal } = props;
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleButtons(){
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setShowModal(false);
  }

  return (
    <Modal
      open={showModal}
      okText={"Done"}
      onOk={() => {
        handleButtons();
      }}
      onCancel={() => {
        handleButtons();
      }}
    >
      <Row style={{ marginTop: 12 }}>
        <Typography.Text>Now Playing:</Typography.Text>
        <audio
          ref={audioRef}
          controls
          style={{ display: "block", width: "100%", marginTop: 8 }}
          src={filesApi.streamUrl(fileId ?? "")}
        />
      </Row>
    </Modal>
  );
}
