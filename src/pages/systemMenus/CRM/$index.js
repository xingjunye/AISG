import React from 'react';
// import { withRouter } from "umi";
import { Tag } from 'antd';
import { connect } from 'dva';
import loadable from '@loadable/component';
import styles from './index.less';



const route = props => {
  const { dispatch, systemMenus: { arr }, match: { params: { name }, url }} = props;
  const closeTag = json => {
    dispatch({
      type: 'systemMenus/closeTags',
      payload: { json }
    });
  }

  if(name === ':name') {
    props.history.push('/systemMenus/CRM/menus');
    return(<div>Loading</div>);
  };
  const Menus =  loadable(() => import(`./${name}.js`));
  return(
  <div className={styles.container}>
    <div className={styles.tags} style={{display: name === 'menus' ? 'none' : 'block'}}>
      {arr.map( (item, i) => {
        return <Tag
          color={ url === item.path ? 'blue': "cyan" } 
          key={i}
          onClick={ () => props.history.push(item.path)}
        >{item.name}</Tag>
      })}
    </div>
    <div className={styles.body}>
      <Menus />
    </div>
  </div>);
}

export default connect( ({ systemMenus }) => ({ systemMenus }) )(route);
