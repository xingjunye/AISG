import React, { Component } from 'react';
import { Icon, Row, Col, Input, Button, Table, Modal, Form, Popconfirm, Tooltip, message, Spin, PageHeader } from 'antd';
import router from 'umi/router'; 
import { connect } from 'dva';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 17 },
  },
  labelAlign: 'left'
};

// eslint-disable-next-line react/prefer-stateless-function
class Details extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      madelTitle: '新增',
      id: null, // 查询用id
      businessName: null,// 查询用 业务模块名
      businessCode: null,// 查询用 业务编码
      // curRowDetail: null, // 保存当前行数据
      pageSize: 10,  // 分页默认显示条数
      current: 1,  // 当前页码

    }
  }

  // 显示弹窗
  showMedal = json => {
    const { dispatch } = this.props;
    let [curRowDetail, madelTitle] = [null, '新增'];
    if(json) {
      curRowDetail = json;
      madelTitle = '详情';
    }
    this.setState({
      visible: true,
      madelTitle
    });

    dispatch({
      type: 'details/setCurRowDetail',
      payload: {
        curRowDetail
      }
    });
    // console.log(curRowDetail);
  }

  // 隐藏弹窗
  hideMedal = () => {
    this.setState({
      visible: false
    });
  }

  // 删除确认弹窗
  confirm = (text, record, index) => {
    const { dispatch } = this.props;
    const This = this;
    dispatch({
      type: 'details/delete',
      payload: {
        id: text.flowControlId,
        record,
        index
      },
      callback(success, title) {
        if(success) {
          message.success(`${title}成功！`);
          This.setState({
            visible: false
          });
          This.search();
        }
      },
    });
    // console.log(text, record, index);
  }

  // 查询方法
  search = () => {
    const { dispatch } = this.props;
    const { id, businessName, businessCode, current, pageSize } = this.state;
    dispatch({
      type: 'details/search',
      payload: {
        id,
        businessName,
        businessCode,
        current,
        pageSize
      }
    });
  }

  // 回调函数,每页显示多少条
  changePageSize = (current, pageSize) => {
    this.setState({
      pageSize
    });
  }

  // 回调函数,选择页码
  changePage = current => {
    this.setState({
      current
    }, () => this.search());
  }

  //  删除用confirm
  showConfirm = (text, record, index) => {
    const { dispatch } = this.props;
    const This = this;
    Modal.confirm({
      title: '确定要删除吗?',
      content: '我在问你一遍你真的确认吗？',
      onOk() {
        dispatch({
          type: 'details/delete',
          payload: {
            id: text.flowControlId,
            record,
            index
          },
          callback(success, title) {
            if(success) {
              This.search();
              message.success(`${title}成功！`);
              This.setState({
                visible: false
              });
            }
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 新增和修改
  update = () => {
    const { dispatch, form, details: {curRowDetail} } = this.props;
    const This = this;
    form.validateFields((err, values) => {
      // console.log(values, curRowDetail);
      if(!err) {
        dispatch({
          type: 'details/update',
          payload: {
            curRowDetail: {
              ...curRowDetail,
              ...values
            },
          },
          callback(success, text) {
            if(success) {
              message.success(`${text}成功！`);
              This.setState({
                visible: false
              });
              This.search();
            }
          },
        });
      }
    });
  }

  render() {
    const { details } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { pageSize, current } = this.state;
    // let { visible } = this.state;
    const columns = [{
        title: '序号',
        width: 50,
        key: 'number',
        align: 'center',
        render: (text, record, index) => {
          return pageSize * (current - 1 ) + index + 1;
        }
      },
      {
        title: '业务模块名',
        key: 'businessName',
        dataIndex: 'businessName',
        render: text => <a>{text}</a>,
      },
      {
        title: '业务编码',
        key: 'businessCode',
        dataIndex: 'businessCode',
      },
      {
        title: '阈值',
        key: 'threshold',
        dataIndex: 'threshold',
        width: 100
      },
      {
        title: '时间频率',
        key: 'timeUnit',
        dataIndex: 'timeUnit',
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        sorter: (a, b) => a.flowControlId  - b.flowControlId
      },
      {
        title: '封停时长',
        key: 'blockTime',
        dataIndex: 'blockTime',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 80,
        render: (text, record, index) => (
          <div>
            <Tooltip placement="top" title={<span>详情与修改</span>}>
              <Icon type='edit' style={{color: '#2db7f5'}} onClick={ ()=>this.showMedal(text)}></Icon>
            </Tooltip>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Icon onClick={ ()=>this.showConfirm(text, record, index)} style={{color: '#f50'}} type="delete"></Icon>
          </div>
        )
      },
    ];
    // 表格分页设置
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: () => `共${details.total}条`,
      pageSize,
      current,
      total: details.total,
      onShowSizeChange: (c, pg) => this.changePageSize(c, pg),
      onChange: c => this.changePage(c),
    }

    return (
      <div className={styles.section}>
        <PageHeader 
          title="流量管控系统"
          onBack={() => router.push('/systemMenus/crm/menus')}
          subTitle='你好我是流量管控系统，我来管理你的流量，你看看你有多少流量，有多少也不够我告诉你'
          style={{borderBottom: '1px solid #ededed'}}
          extra={<Icon style={{fontSize: '21px', cursor: 'pointer'}} type="ellipsis"></Icon>}
          >
        </PageHeader>
        <Modal
          title={this.state.madelTitle}
          visible={this.state.visible}
          onOk={this.update}
          onCancel={this.hideMedal}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="业务模块名" hasFeedback>
              {getFieldDecorator('businessName', {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项!',
                  }
                ],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="业务编码" hasFeedback>
              {getFieldDecorator('businessCode', {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项!',
                  }],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="阈值" hasFeedback>
              {getFieldDecorator('threshold', {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项!',
                  }],
              })(<Input type="number"  placeholder=">0的整数"/>)}
            </Form.Item>
            <Form.Item label="时间频率" hasFeedback>
              {getFieldDecorator('timeUnit', {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项!',
                  } ],
              })(<Input type="number" placeholder=">0的整数 单位是（分钟）"/>)}
            </Form.Item>
            <Form.Item label="封停时长" hasFeedback>
              {getFieldDecorator('blockTime', {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项!',
                  }],
              })(<Input type="number" placeholder="-1为永久封号 单位是（分钟）" />)}
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={[16, 15]} style={{padding: '16px 24px 0'}}>
        <Col span={6}>
            <Input placeholder="id" onChange={ e => this.setState({id: e.target.value.trim() !== '' ? e.target.value.trim() : null })} />
          </Col>
          <Col span={6}>
            <Input placeholder="业务模块名" onChange={ e => this.setState({businessName: e.target.value.trim() !== '' ? e.target.value.trim() : null })} />
          </Col>
          <Col span={6}>
            <Input placeholder="业务编码" onChange={ e => this.setState({businessCode: e.target.value.trim() !== '' ? e.target.value.trim() : null })} />
          </Col>
          <Col span={6} align='right'>
            <Button type='primary' onClick={this.search} icon="search">查询</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type='primary' ghost icon="plus" onClick={ () => this.showMedal()}>新增</Button>
          </Col>
        </Row>
        <Row gutter={[16, 15]} style={{padding: '0 24px'}}>
          <Col span={24}>
            <Spin tip="loading..." spinning={details.spinning}>
              <Table 
                rowKey='flowControlId'
                size='middle'
                scroll={{ y: 'calc(100vh - 365px)'}} 
                pagination={paginationProps} 
                columns={columns} 
                bordered 
                dataSource={details.records} >
              </Table>
            </Spin>
          </Col>
        </Row>
      </div>
    )
  }
}

const detail = Form.create({
  mapPropsToFields(props) {
    const { curRowDetail } = props.details;
    if(curRowDetail) {
      return {
        businessName: Form.createFormField({
          value: curRowDetail.businessName
        }),
        businessCode: Form.createFormField({
          value: curRowDetail.businessCode
        }),
        threshold: Form.createFormField({
          value: curRowDetail.threshold
        }),
        timeUnit: Form.createFormField({
          value: curRowDetail.timeUnit
        }),
        blockTime: Form.createFormField({
          value: curRowDetail.blockTime
        }),
      }
    }
  }
})(Details);

export default connect(({
  details
}) => ({details}))(detail);