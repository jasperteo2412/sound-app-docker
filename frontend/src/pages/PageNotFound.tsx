import { Row, Col, Card, Result, Typography } from "antd";

export default function PageNotFound({ title = '404', subtitle = 'Page not found' }) {
  const { Text, Title } = Typography;

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "80vh", padding: 24 }}
    >
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}
        >
          <Result
            status="404"
            title={
              <Title level={1} style={{ margin: 0 }}>
                {title}
              </Title>
            }
            subTitle={
              <Text type="secondary">
                {subtitle}. The page you are looking for does not exist.
              </Text>
            }
          />
        </Card>
      </Col>
    </Row>
  );
}
