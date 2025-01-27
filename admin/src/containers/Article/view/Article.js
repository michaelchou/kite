import React from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  Radio,
  Switch,
  Tag,
  Alert
} from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import './Article.scss'
import {
  getArticleList,
  editArticle,
  deleteArticle
} from '../actions/ArticleAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@withRouter
@connect(({ stateArticle }) => ({ stateArticle }))
class Article extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => (
          <span
            style={{
              width: '20px',
              display: 'block'
            }}
          >
            {Number((this.state.pagination.current - 1) * 10) + index + 1}
          </span>
        )
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <a
            className="article-title"
            target="_blank"
            href={`/p/${record.aid}`}
          >
            {record.title}
          </a>
        )
      },
      {
        title: '概要',
        dataIndex: 'excerpt',
        key: 'excerpt'
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="orange">
            {this.state.status_list[record.status]}
          </Tag>
        )
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="red">
            {this.state.type_list[record.type]}
          </Tag>
        )
      },
      {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
        render: (text, record) => {
          return (
            <Tag className="table-article-tag-list" color="red">
              {this.state.source_list[Number(record.source)]}
            </Tag>
          )
        }
      },
      {
        title: '阅读数',
        dataIndex: 'read_count',
        key: 'read_count',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="green">
            {record.read_count}
          </Tag>
        )
      },
      {
        title: '评论数',
        dataIndex: 'comment_count',
        key: 'comment_count',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="green">
            {record.comment_count}
          </Tag>
        )
      },
      {
        title: '拒绝的原因',
        dataIndex: 'rejection_reason',
        key: 'rejection_reason',
        render: (text, record) => (
          <div>
            {~[3, 4, 5].indexOf(record.status) ? record.rejection_reason : ''}
          </div>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <div className="table--btn">
              <Button
                onClick={() => {
                  this.editUser(record)
                }}
                size="small"
                type="primary"
              >
                修改
              </Button>
              <Button
                className="box-btn-red"
                onClick={() => {
                  this.deleteArticle(record)
                }}
                size="small"
              >
                删除
              </Button>
            </div>
          )
        }
      }
    ],
    pagination: {
      current: 1
    },
    modal_visible_edit: false,
    loading: false,
    status_list: [
      '',
      '审核中',
      '审核通过',
      '审核失败',
      '回收站',
      '已删除',
      '无需审核',
      '草稿'
    ],
    type_list: ['', '文章', '提问', '说说'],
    source_list: ['', '原创', '转载'],
    title_val: '',
    status_val: '',
    type_val: '',
    source_val: '',
    edit_status_val: ''
  }

  componentDidMount() {
    this.fetchArticleList()
  }

  editUser(val) {
    console.log('val', val)
    this.setState({
      modal_visible_edit: true,
      edit_status_val: String(val.status)
    })
    this.props.form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      source: String(val.source),
      rejection_reason: val.rejection_reason
    })
    this.props.dispatch({ type: 'ARTICLE_SET_CURRENT_INFO', data: val })
  }

  deleteArticle(val) {
    this.props.dispatch({ type: 'ARTICLE_SET_CURRENT_INFO', data: val })
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchArticleDelete({
          aid: this.props.stateArticle.current_info.aid
        })
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  TablePageChange = async pages => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetchArticleList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchUserEdit(values)
      }
    })
  }

  fetchArticleDelete = values => {
    /*删除文章*/
    this.props.dispatch(
      deleteArticle(values, res => {
        alert.message_success('删除文章成功')
        this.fetchArticleList()
      })
    )
  }

  getParams = () => {
    const { title_val, status_val, type_val, source_val } = this.state
    return {
      title: title_val,
      source: source_val,
      status: status_val,
      type: type_val
    }
  }

  fetchArticleList = () => {
    /*获取文章带分页的列表*/
    let params = this.getParams()
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state

    this.props.dispatch(
      getArticleList({ page: current, ...params }, res => {
        let pagination = { ...that.state.pagination }
        pagination.total = res.count
        pagination.current = current
        that.setState({
          loading: false,
          pagination
        })
      })
    )
  }

  fetchUserEdit = values => {
    /*修改文章*/
    this.props.dispatch(
      editArticle(
        { aid: this.props.stateArticle.current_info.aid, ...values },
        res => {
          alert.message_success('修改文章成功')
          this.fetchArticleList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  resetBarFrom = () => {
    this.setState(
      {
        title_val: '',
        source_val: '',
        status_val: '',
        type_val: ''
      },
      () => {
        this.fetchArticleList()
      }
    )
  }

  changeVal = (val, type) => {
    let data = {}
    data[type] = val
    this.setState(data)
  }

  render() {
    const {
      loading,
      status_list,
      type_list,
      source_list,
      title_val,
      status_val,
      type_val,
      source_val,
      edit_status_val
    } = this.state
    const { stateArticle = {} } = this.props
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 5
        }
      }
    }
    return (
      <div className="layout-main">
        <div className="layout-main-title">
          <Icon type="file-text" /> <em>文章汇总</em>
        </div>

        <div className="admin-article layout-card-view">
          <div className="admin-article-bar">
            <Form layout="inline">
              <FormItem label="文章标题">
                <Input
                  value={title_val}
                  onChange={e => {
                    this.changeVal(e.target.value, 'title_val')
                  }}
                />
              </FormItem>
              <FormItem label="状态">
                <Select
                  className="select-view"
                  value={status_val}
                  onChange={value => {
                    this.changeVal(value, 'status_val')
                  }}
                >
                  <Option value="">全部</Option>
                  {status_list.map((item, key) =>
                    item ? (
                      <Option value={key} key={key}>
                        {item}
                      </Option>
                    ) : (
                      ''
                    )
                  )}
                </Select>
              </FormItem>
              <FormItem label="类型">
                <Select
                  className="select-view"
                  value={type_val}
                  onChange={value => {
                    this.changeVal(value, 'type_val')
                  }}
                >
                  <Option value="">全部</Option>
                  {type_list.map((item, key) =>
                    item ? (
                      <Option value={key} key={key}>
                        {item}
                      </Option>
                    ) : (
                      ''
                    )
                  )}
                </Select>
              </FormItem>
              <FormItem label="来源：">
                <Select
                  className="select-view"
                  value={source_val}
                  onChange={value => {
                    this.changeVal(value, 'source_val')
                  }}
                >
                  <Option value="">全部</Option>
                  {source_list.map((item, key) =>
                    item ? (
                      <Option value={key} key={key}>
                        {item}
                      </Option>
                    ) : (
                      ''
                    )
                  )}
                </Select>
              </FormItem>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.fetchArticleList}
                >
                  搜索
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.resetBarFrom}
                >
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="修改文章"
            visible={this.state.modal_visible_edit}
          >
            <Form className="from-view" onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} hasFeedback label="状态">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择状态！' }]
                })(
                  <Select
                    placeholder="状态"
                    onChange={value => {
                      this.setState({
                        edit_status_val: value
                      })
                    }}
                  >
                    {this.state.status_list.map((item, key) =>
                      item ? <Option key={key}>{item}</Option> : ''
                    )}
                  </Select>
                )}
              </FormItem>

              {~[3, 4, 5].indexOf(Number(edit_status_val)) ? (
                <FormItem {...formItemLayout} label="拒绝的原因">
                  {getFieldDecorator('rejection_reason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入拒绝的原因！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="文章被拒绝的原因" />)}
                </FormItem>
              ) : (
                ''
              )}

              <FormItem {...formItemLayout} hasFeedback label="类型">
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择类型！' }]
                })(
                  <Select placeholder="类型">
                    {this.state.type_list.map((item, key) =>
                      item ? <Option key={key}>{item}</Option> : ''
                    )}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} hasFeedback label="来源">
                {getFieldDecorator('source', {
                  rules: [{ required: true, message: '请选择来源！' }]
                })(
                  <Select placeholder="来源">
                    {source_list.map((item, key) =>
                      item ? <Option key={key}>{item}</Option> : ''
                    )}
                  </Select>
                )}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                <Button
                  className="register-btn"
                  htmlType="submit"
                  type="primary"
                >
                  更新
                </Button>
              </FormItem>
            </Form>
          </Modal>

          <Table
            columns={this.state.columns}
            dataSource={stateArticle.list}
            loading={loading}
            onChange={this.TablePageChange.bind(this)}
            pagination={this.state.pagination}
            rowKey="aid"
          />
        </div>

        <Alert
          style={{ marginTop: '20px' }}
          message="备注信息"
          description="文章发表完成后状态是审核中，是仅对自己可见的，审核不通过也是仅自己可见，并且会标注审核不通过，更改为审核通过的文章对所有人开放，
          这种方式是人工审核的，暂时采用这种方案，后续会更改"
          type="info"
          showIcon
        />
      </div>
    )
  }
}

const ArticleForm = Form.create()(Article)

export default ArticleForm
