import React, { useState, useEffect }from 'react';
import { router } from 'umi'; 
import { PageHeader, Icon, Row, Col, Breadcrumb, Menu  } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import Control from './SafetyControl/control';
import Rule from './SafetyControl/rule'
import { CSSTransition } from 'react-transition-group';

const Index = props => {
  // tab切换回调函数
  // const [show, setShow] = useState(true);
  const { safetyControl: { show }, dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'safetyControl/isShow', 
      payload: {
        show: true
      }
    });
  }, []);
  return (
    <div className={styles.section}>
      <PageHeader 
        title="安全管控系统"
        onBack={() => show ? router.push('/systemMenus/crm/menus') : dispatch({type: 'safetyControl/isShow', payload: {show: !show}})}
        subTitle='你好我是安全管控系统，我来管理你的安全，你看看你安全不'
        style={{borderBottom: '1px solid #ededed'}}
        extra={<Icon style={{fontSize: '21px', cursor: 'pointer'}} type="ellipsis"></Icon>}
        >
      </PageHeader>
      <Row>
        <Col style={{padding: '16px'}}>
          <div className={styles['card-container']}>
            <CSSTransition
              in={show} // 如果this.state.show从false变为true，则动画入场，反之out出场
              timeout={1000} //动画执行1秒
              classNames='fade' //自定义的class名
            >
              <ul className={styles['animate-ul']}>
                <li className={styles['animate-li']}><Control /></li>
                <li className={styles['animate-li']}><Rule /></li>
              </ul>
            </CSSTransition>
          </div>
          {/* <Control /> */}
        </Col>
      </Row>
    </div>
  );
}

export default connect(({safetyControl})=>({safetyControl}))(Index);
