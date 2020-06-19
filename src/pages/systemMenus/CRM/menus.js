import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';


// eslint-disable-next-line react/prefer-stateless-function
const menus = props => {
  const { dispatch } = props;

  const toggleCard = json => {
    dispatch({
      type: 'systemMenus/addTags',
      payload: {
        json
      }
    });
    router.push(json.path)
  }

  return (
    <div>
      <Row style={{padding: '16px'}} gutter={16}>
        <Col span={8}>
          <Card bordered title="流量管控" onClick={ () => toggleCard({path: '/systemMenus/crm/details', name: '流量管控'})}>
            我是流量管控
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered title="安全管控" onClick={ () => toggleCard({path: '/systemMenus/crm/safetyControl', name: '安全管控'})}>
            我是安全管控
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect( ({ systemMenus }) => ({ systemMenus }) )(menus);