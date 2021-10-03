import { Col, Row } from "antd";
import React from "react";

function Homepage() {
  return (
    <Row justify="center">
      <Col xs={24} align="middle">
        <div className="header">Welcome in Todo App</div>
      </Col>
    </Row>
  );
}

export default Homepage;
