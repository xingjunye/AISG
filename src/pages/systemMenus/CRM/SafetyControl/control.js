import React, { Component } from 'react';
import { Row, Col, DatePicker, Input, Button, Table, Icon, Tooltip, Modal, Tag, Badge, Form, Popconfirm, message, Spin, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import styles from '../index.less';
import Info from './rule';

// eslint-disable-next-line react/prefer-stateless-function
class SafetyControl extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      filterName: '', // 查询用 拦截器名称
      createTime: '', // 查询用 创建日期
      businessName: '', // 查询用 业务模块名
      businessCode: '', // 查询用 业务编码
      availability: '', // 查询用 状态
      // curRowDetail: null, // 保存当前行数据
      size: 10,  // 分页默认显示条数
      page: 1,  // 当前页码
      total: 0, //总数
      trActive: -1
    }
  }

  // 查询方法
  search = () => {
    const { dispatch } = this.props;
    const { filterName, createTime, businessName, businessCode, availability, page, size } = this.state;
    dispatch({
      type: 'safetyControl/search',
      payload: {
        filterName, // 查询用 拦截器名称
        createTime, // 查询用 创建日期
        businessName, // 查询用 业务模块名
        businessCode, // 查询用 业务编码
        availability, // 查询用 状态
        page,
        size
      }
    });
  }

  // 显示弹窗
  showMedal = () => {
    // this.setState({
    //   visible: true,
    // });
  }

  // 显示弹窗
  hideMedal = () => {
    this.setState({
      visible: false,
    });
  }

  // 设置单行变色
  setRowClassName = (record, index) => {
    const { trActive } = this.state;
    return trActive === index ? styles.rowClassName : '';
  }
  
  showConfirm = () => {
    Modal.confirm({
      title: '确定要删除吗?',
      content: '我在问你一遍你真的确认吗？',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  showRules = (json, index) => {
    const { dispatch } = this.props;
    // routerRedux
    dispatch({
      type: 'safetyControl/searchRules',
      payload: {
        filterId: json.filterId
      }
    });
    // dispatch(routerRedux.push({
    //   pathname: 'rule'
    // }));

    this.setState({
      trActive: index
    });
  }

  changePage = c => {
    this.setState({ page: c }, () => this.search());
  }

  render() {
    const { safetyControl } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { visible, size, page, filterName} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        align: 'center',
        render: (...params) => params[2] + 1
      },
      {
        title: '拦截器名称',
        dataIndex: 'filterName',
        key: 'filterName',
        render: (text, record, index) => <a onClick={ ()=>this.showRules(record, index)}>{text}</a>,
      },
      {
        title: '业务编码',
        dataIndex: 'businessCode',
        key: 'businessCode',
      },
      {
        title: '业务模块名',
        dataIndex: 'businessName',
        key: 'businessName',
        render: (text, record, index) => {
          return (
            <Tag color="green">
              {text}
            </Tag>
          )
        }
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180
      },
      {
        title: '状态',
        dataIndex: 'availability',
        key: 'availability',
        width: 100,
        render: (text, record, index) => text !== '1' ?  <Badge status="success" text="可用" /> : <Badge status="warning" text="不可用" />     
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 80,
        render: (text, record, index) => (
          <div>
            <Tooltip title='修改' >
              <Icon type='edit' style={{color: '#2db7f5'}} onClick={ ()=>this.showMedal(text)}></Icon>
            </Tooltip>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Tooltip title='删除' >
              <Icon type='delete' style={{color: '#f50'}} onClick={ ()=>this.showConfirm(text)}></Icon>
            </Tooltip>
          </div>  
        )
      },
    ];

    
    // 表格分页设置
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: () => `共${safetyControl.total}条`,
      pageSize: size,
      current: page,
      total: safetyControl.total,
      onShowSizeChange: (c, pg) => this.changePageSize(c, pg),
      onChange: c => this.changePage(c),
    }
    
    return (
      <div style={{padding: '10px'}}>
        <Modal
          title='详情'
          visible={visible}
          width='70%'
          onCancel={this.hideMedal}
          footer={false}
        >
          <Info></Info>
        </Modal>
        <Row gutter={[16, 15]}>
          <Col span={6}>
            <Input placeholder="拦截器名称" onChange={ e => this.setState({ filterName: e.target.value }) } />
          </Col>
          <Col span={6}>
            <Input placeholder="业务模块名" onChange={ e => this.setState({ businessName: e.target.value }) } />
          </Col>
          <Col span={6}>
            <DatePicker 
              style={{width: '100%'}} 
              format='YYYY-MM-DD SS:mm:ss'
              placeholder="请选择时间"
              onChange={(...param) => this.setState({createTime: param[1]})}
            />
          </Col>
          <Col span={6}>
            <Input placeholder="业务编码" onChange={e => this.setState({ businessCode: e.target.value })} />
          </Col>
        </Row>
        <Row gutter={[16, 15]}>
          <Col span={6}>
            <Select 
              style={{width: '100%'}} 
              placeholder="请选择状态"
              onChange={(...param) => this.setState({availability: param[0]})}
            >
              <Select.Option value="1">可用</Select.Option>
              <Select.Option value="0">不可用</Select.Option>
            </Select>
          </Col>
          <Col span={18} align="right">
            <Button type='primary' onClick={this.search} icon="search">查询</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type='primary' ghost icon="plus" onClick={ () => this.showMedal()}>新增</Button>
          </Col>
        </Row>
        {/* <Row gutter={[16, 15]}>
          <Col span={24}>
            <Button type='primary' ghost icon="plus" onClick={ () => this.showMedal()}>新增</Button>
          </Col>
        </Row> */}
        <Row gutter={[16, 15]}>
          <Col span={24}>
            <Spin tip="loading..." spinning={safetyControl.spinning}>
              <Table 
                scroll={{y: 'calc(100vh - 440px)'}} 
                pagination={paginationProps}
                rowKey={row => row.filterId}
                columns={columns} 
                bordered
                size='middle'
                dataSource={safetyControl.data}
                rowClassName={this.setRowClassName}>
              </Table>
            </Spin>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(({safetyControl})=>({
  safetyControl
}))(SafetyControl);