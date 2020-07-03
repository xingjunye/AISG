import React, { Component } from 'react'
import { Row, Col, Input, Icon, Button, DatePicker, Badge, Switch, Table, Descriptions, Tooltip, Modal, Form, Popconfirm, message, Spin, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

class Info extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      madelTitle: '新增',
      // curRowDetail: null, // 保存当前行数据
      pageSize: 10,  // 分页默认显示条数
      current: 1,  // 当前页码
      isEdit: false,
      rulesArr: JSON.parse(JSON.stringify(props.safetyControl.rulesData))
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rulesArr: JSON.parse(JSON.stringify(nextProps.safetyControl.rulesData))
    });
  }

  // 返回主界面
  back = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyControl/setActive',
      payload: {
        index: '0'
      }
    });
  }

  //保存
  save = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyControl/update',
      callback() {
        message.success('修改成功！')
      }
    });
    this.setState({isEdit: false});
  }

  //修改
  update = isEdit => {
    
  }

  //添加
  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyControl/add'
    });
  }

  //编辑
  edit = isEdit => {
    this.setState({isEdit});
  }

  //重置
  reset = () => {
    // console.log('重置开始')
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyControl/reset'
    });
  }

  //取消
  closeEdit = () => {
    const { safetyControl: { rulesData, rulesDataCopy } } = this.props;
    const This = this;
    if(JSON.stringify(rulesData) != JSON.stringify(rulesDataCopy)){
      Modal.confirm({
        title: '您有数据尚未保存，是否要保存数据？',
        // content: '您有数据？',
        onOk() {
          This.save();
          This.edit(false);
        },
        onCancel() {
          This.reset();
          This.edit(false);
        },
      });
    }else {
      this.edit(false);
    }
  }

  //通用修改input值的方法
  changeValue = (val, i, name) => {
    const { rulesArr } = this.state;
    rulesArr.filterRules[i][name] = val;
    this.setState({rulesArr: { ...rulesArr }});
  }

  //删除
  delRule = obj => {
    const This = this;
    if(obj.ruleId != '') {
      const { dispatch } = this.props;
      dispatch({
        type: 'safetyControl/delRule',
        payload: {
          ...obj
        },
        callback() {
          message.success('删除成功！')
        }
      });
    }else{

    }
  }

  render() {
    const { pageSize, current, isEdit, rulesArr } = this.state;
    const { safetyControl: { rulesData: data, rulesDataCopy, spinning } } = this.props;
    // key: i,
    //     ruleName: `我是规则${i}`,
    //     status: `${i % 2}`,
    //     treasuryCheck: i % 2 === 0 ? '是' : '否',
    //     filterUnit: i % 2 === 0 ? 'url' : 'request',
    //     hitParamName: `单元${i}`,
    //     hitParamValue: i % 2 === 0 ? 'url' : '127.0.0.1:8080',
    //     hitParamType: i % 2 === 0 ? '字符串' : '数字'
    const columns = [
      {
        title: '规则名称',
        dataIndex: 'ruleName',
        render: (text, record, index) => {
          return isEdit ? (
            <Input 
              size='small' 
              value={rulesArr.filterRules[index].ruleName} 
              onChange={ e => this.changeValue(e.target.value, index, 'ruleName')}/>
          ) : (
            text
          )
        } 
      },
      {
        title: '过滤单元',
        dataIndex: 'filterUnit',
        render: (text, record, index) => 
          isEdit ? (
            <Input 
              size='small'
              value={rulesArr.filterRules[index].filterUnit}
              onChange={ e => this.changeValue(e.target.value, index, 'filterUnit')}/>
          ) : (
            text
          )
      },
      {
        title: '参数类型',
        dataIndex: 'hitParamType',
        width: 100,
        render: (text, record, index) => 
          isEdit ?  (
            <Select 
              size="small" 
              value={rulesArr.filterRules[index].hitParamType}
              style={{width: '100%'}} 
              onChange={ value => this.changeValue(value, index, 'hitParamType')} >
              <Select.Option value="STRING">STRING</Select.Option>
              <Select.Option value="BOOLEAN">BOOLEAN</Select.Option>
              <Select.Option value="NUMBER">NUMBER</Select.Option>
            </Select>
          ) : (
            <span>{text}</span>
          )
      },
      {
        title: '激活条件',
        dataIndex: 'triggerConditionCode',
        width: 100,
        render: (text, record, index) => {
          let options = [];
          switch(rulesArr.filterRules[index].hitParamType){
            case 'STRING': options = ['EQ', 'NEQ', 'REGEXP', 'INCLUDE', 'EXCLUDE']; break
            case 'BOOLEAN': options = ['TRUE', 'FALSE']; break
            case 'NUMBER': options = ['GT', 'GE', 'LT', 'LE', 'EQ', 'NEQ', 'INCLUDE', 'EXCLUDE']; break
          }

          if(record.hitParamType != rulesArr.filterRules[index].hitParamType) {
            rulesArr.filterRules[index].triggerConditionCode = options[0];
            // this.setState({rulesArr: {...rulesArr}})
            // console.log('aaaa')
          }else {
            rulesArr.filterRules[index].triggerConditionCode = record.triggerConditionCode
          }

          return isEdit ?
          (
            <Select size="small" 
              value={rulesArr.filterRules[index].triggerConditionCode} 
              style={{width: '100%'}} 
              placeholder="请选择激活条件" 
              onChange={ value => this.changeValue(value, index, 'triggerConditionCode')} >
              {options.map(item => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          ) : (
            <span>{text}</span>
          )
        }
      },
      {
        title: '命中参数名',
        dataIndex: 'hitParamName',
        render: (text, record, index) => 
          isEdit ? (
              <Input 
                size='small' 
                value={rulesArr.filterRules[index].hitParamName} 
                onChange={ e => this.changeValue(e.target.value, index, 'hitParamName')}/>
          ) : (
            text
          )
      },
      {
        title: '命中值',
        dataIndex: 'hitParamValue',
        width: 100,
        render: (text, record, index) => 
          isEdit ? (
            <Input 
              size='small' 
              value={rulesArr.filterRules[index].hitParamValue}
              onChange={ e => this.changeValue(e.target.value, index, 'hitParamValue')}/>
          ) : (
            text
          )
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (text, record, index) =>
        isEdit ?  (
          <Select size="small"
            value={`${rulesArr.filterRules[index].status}`}
            style={{width: '100%'}} 
            onChange={ value => this.changeValue(value, index, 'status')}>
            <Select.Option value="1">可用</Select.Option>
            <Select.Option value="0">不可用</Select.Option>
          </Select>
        ) : (
          text === 1 ? <Badge status="success" text="可用" /> : <Badge status="warning" text="不可用" /> 
        ) 
      },
      {
        title: '金库校验',
        dataIndex: 'treasuryCheck',
        width: 100,
        render: (text, record, index) => (<Switch 
          checkedChildren="开" 
          defaultChecked={text === 1 ? true : false} 
          disabled={!isEdit} 
          size="small" 
          unCheckedChildren="关"
          onChange={ value => this.changeValue(value = value ? 1: 0, index, 'treasuryCheck')}
         ></Switch>)
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 60,
        render: (text, record) => (
          <div>
            <Popconfirm
              title="您确定要删除吗?"
              onConfirm={()=>this.delRule(record)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Icon style={{color: 'red', cursor: 'pointer'}} type='delete'></Icon>
            </Popconfirm>
          </div>
        )
      },
    ];
    const bage = (data.availability !== '1' ? <Badge status="success" text="可用" /> : <Badge status="warning" text="不可用" />);
    return (
      <div style={{padding: '16px'}}>
        {/* <div className={styles.btnDiv}>
          <Button ghost size='default' type='primary' icon='plus'>新增</Button>
        </div> */}
        <Row gutter={[16, 15]}>
          <Col span={24}>
            <Descriptions layout='horizontal' bordered size='small' column={3}>
              <Descriptions.Item label="拦截器名称">
                <div style={{minWidth: '120px'}}>
                  {isEdit ? 
                    <Input size='small' 
                      defaultValue={data.filterName}
                      onChange={ e => rulesDataCopy.filterName = e.target.value } /> : 
                      <a onClick={ this.back }>{data.filterName}</a> }
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="业务模块名">
                {isEdit ? 
                  <Input size='small' 
                    defaultValue={data.businessName}
                    onChange={ e => rulesDataCopy.businessName = e.target.value } /> : 
                    data.businessName}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {isEdit ? <DatePicker 
                  format='YYYY-MM-DD SS:mm:ss' 
                  defaultValue={moment(data.createTime, 'YYYY-MM-DD SS:mm:ss')}
                  onChange={ (moment, timeString) => rulesDataCopy.createTime = timeString} 
                  /> : data.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="业务编码">
                {isEdit ? <Input size='small' 
                  defaultValue={data.businessCode}
                  onChange={ e => rulesDataCopy.businessCode = e.target.value }
                   /> : data.businessCode}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {isEdit ? <Select size="small" 
                  defaultValue={`${data.availability}`} 
                  style={{width: '130px'}}
                  onChange={ value => rulesDataCopy.availability = value }
                  placeholder="请选择状态">
                  <Select.Option value="1">可用</Select.Option>
                  <Select.Option value="0">不可用</Select.Option>
                </Select> : bage}
              </Descriptions.Item>
              <Descriptions.Item label="操作" style={{background: "red"}}>
                <div style={{paddingLeft: '3px'}}>
                  {isEdit ? 
                    <>
                      <Tooltip title="添加">
                        <Button type='dashed' size='small' onClick={ () => this.add(false)}>
                          <Icon type='plus' style={{color: '#1890ff'}} ></Icon>
                        </Button>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="重置">
                        <Button type='dashed' size='small' shape="circle"  onClick={this.reset}>
                          <Icon type='reload' style={{color: '#1890ff'}} ></Icon>
                        </Button>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="保存">
                        <Button type='dashed' size='small' onClick={this.save}>
                          <Icon type='save' style={{color: '#1890ff'}} ></Icon>
                        </Button>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="取消">
                        <Button type='dashed' size='small' onClick={this.closeEdit}>
                          <Icon type='close' style={{color: '#108ee9'}} ></Icon>
                        </Button>
                      </Tooltip>
                    </> :
                    <Tooltip title="修改">
                      <Icon type="edit" onClick={() => this.edit(true)} style={{color: '#108ee9', cursor: 'pointer'}} />
                    </Tooltip>
                  }
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {/* {
            isEdit ? 
            (<Col span={2} style={{textAlign: 'right'}}>
              <Tooltip title='保存' >
                <Icon type="save" style={{color: '#108ee9', cursor: 'pointer'}} />
              </Tooltip>
            </Col>) :
            (<Col span={2} style={{textAlign: 'right'}}>
              <Tooltip title='添加' >
                <Icon type="plus" style={{color: '#108ee9', cursor: 'pointer'}} />
              </Tooltip>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Tooltip title='修改' >
              <Icon type="edit" onClick={this.changeValue} style={{color: '#108ee9', cursor: 'pointer'}} />
              </Tooltip>
            </Col>)
          } */}
        </Row>
        <Row gutter={[16, 15]}>
          <Col span={24}>
            <Spin tip="loading..." spinning={spinning}>
              <Table
                rowKey={ (row, i) => i} 
                scroll={{y: 'calc(100vh - 460px)'}} 
                pagination={false} 
                columns={columns} 
                bordered
                size='small' 
                dataSource={data.filterRules} >
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
}))(Info);