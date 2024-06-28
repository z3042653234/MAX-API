import React, { useEffect, useState } from 'react';
import {
  API,
  copy,
  isAdmin,
  showError,
  showSuccess,
  timestamp2string,
} from '../helpers';

import {
  Banner,
  Button,
  Form,
  ImagePreview,
  Layout,
  Modal,
  Progress,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { ITEMS_PER_PAGE } from '../constants';

const colors = [
  'amber',
  'blue',
  'cyan',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
];

function renderType(type) {
  switch (type) {
    case 'IMAGINE':
      return (
        <Tag color='blue' size='large'>
          绘图
        </Tag>
      );
    case 'UPSCALE':
      return (
        <Tag color='orange' size='large'>
          放大
        </Tag>
      );
    case 'VARIATION':
      return (
        <Tag color='purple' size='large'>
          变换
        </Tag>
      );
    case 'HIGH_VARIATION':
      return (
        <Tag color='purple' size='large'>
          强变换
        </Tag>
      );
    case 'LOW_VARIATION':
      return (
        <Tag color='purple' size='large'>
          弱变换
        </Tag>
      );
    case 'PAN':
      return (
        <Tag color='cyan' size='large'>
          平移
        </Tag>
      );
    case 'DESCRIBE':
      return (
        <Tag color='yellow' size='large'>
          图生文
        </Tag>
      );
    case 'BLEND':
      return (
        <Tag color='lime' size='large'>
          图混合
        </Tag>
      );
    case 'SHORTEN':
      return (
        <Tag color='pink' size='large'>
          缩词
        </Tag>
      );
    case 'REROLL':
      return (
        <Tag color='indigo' size='large'>
          重绘
        </Tag>
      );
    case 'INPAINT':
      return (
        <Tag color='violet' size='large'>
          局部重绘-提交
        </Tag>
      );
    case 'ZOOM':
      return (
        <Tag color='teal' size='large'>
          变焦
        </Tag>
      );
    case 'CUSTOM_ZOOM':
      return (
        <Tag color='teal' size='large'>
          自定义变焦-提交
        </Tag>
      );
    case 'MODAL':
      return (
        <Tag color='green' size='large'>
          窗口处理
        </Tag>
      );
    case 'SWAP_FACE':
      return (
        <Tag color='light-green' size='large'>
          换脸
        </Tag>
      );
    default:
      return (
        <Tag color='white' size='large'>
          未知
        </Tag>
      );
  }
}

function renderCode(code) {
  switch (code) {
    case 1:
      return (
        <Tag color='green' size='large'>
          已提交
        </Tag>
      );
    case 21:
      return (
        <Tag color='lime' size='large'>
          等待中
        </Tag>
      );
    case 22:
      return (
        <Tag color='orange' size='large'>
          重复提交
        </Tag>
      );
    case 0:
      return (
        <Tag color='yellow' size='large'>
          未提交
        </Tag>
      );
    default:
      return (
        <Tag color='white' size='large'>
          未知
        </Tag>
      );
  }
}

function renderStatus(type) {
  switch (type) {
    case 'SUCCESS':
      return (
        <Tag color='green' size='large'>
          成功
        </Tag>
      );
    case 'NOT_START':
      return (
        <Tag color='grey' size='large'>
          未启动
        </Tag>
      );
    case 'SUBMITTED':
      return (
        <Tag color='yellow' size='large'>
          队列中
        </Tag>
      );
    case 'IN_PROGRESS':
      return (
        <Tag color='blue' size='large'>
          执行中
        </Tag>
      );
    case 'FAILURE':
      return (
        <Tag color='red' size='large'>
          失败
        </Tag>
      );
    case 'MODAL':
      return (
        <Tag color='yellow' size='large'>
          窗口等待
        </Tag>
      );
    default:
      return (
        <Tag color='white' size='large'>
          未知
        </Tag>
      );
  }
}

const renderTimestamp = (timestampInSeconds) => {
  const date = new Date(timestampInSeconds * 1000);

  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function renderDuration(submit_time, finishTime) {
  if (!submit_time || !finishTime) return 'N/A';

  const start = new Date(submit_time);
  const finish = new Date(finishTime);
  const durationMs = finish - start;
  const durationSec = (durationMs / 1000).toFixed(1);
  const color = durationSec > 60 ? 'red' : 'green';

  return (
    <Tag color={color} size="large">
      {durationSec} 秒
    </Tag>
  );
}

const LogsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const columns = [
    {
      title: '提交时间',
      dataIndex: 'submit_time',
      render: (text, record, index) => {
        return <div>{renderTimestamp(text / 1000)}</div>;
      },
    },
    {
      title: '花费时间',
      dataIndex: 'finish_time',
      key: 'finish_time',
      render: (finish, record) => {
        return renderDuration(record.submit_time, finish);
      },
    },
    {
      title: '渠道',
      dataIndex: 'channel_id',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return (
          <div>
            <Tag
              color={colors[parseInt(text) % colors.length]}
              size='large'
              onClick={() => {
                copyText(text);
              }}
            >
              {text}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'action',
      render: (text, record, index) => {
        return <div>{renderType(text)}</div>;
      },
    },
    {
      title: '任务ID',
      dataIndex: 'mj_id',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '提交结果',
      dataIndex: 'code',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return <div>{renderCode(text)}</div>;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return <div>{renderStatus(text)}</div>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      render: (text, record, index) => {
        return (
          <div>
            <Progress
              stroke={record.status === 'FAILURE' ? 'var(--semi-color-warning)' : null}
              percent={text ? parseInt(text.replace('%', '')) : 0}
              showInfo={true}
              aria-label='drawing progress'
            />
          </div>
        );
      },
    },
    {
      title: '结果图片',
      dataIndex: 'image_url',
      render: (text, record, index) => {
        if (!text) {
          return '无';
        }
        return (
          <Button
            onClick={() => {
              setModalImageUrl(text);
              setIsModalOpenurl(true);
            }}
          >
            查看图片
          </Button>
        );
      },
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      render: (text, record, index) => {
        if (!text) {
          return '无';
        }

        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100 }}
            onClick={() => {
              setModalContent(text);
              setIsModalOpen(true);
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
    {
      title: 'PromptEn',
      dataIndex: 'prompt_en',
      render: (text, record, index) => {
        if (!text) {
          return '无';
        }

        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100 }}
            onClick={() => {
              setModalContent(text);
              setIsModalOpen(true);
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
    {
      title: '失败原因',
      dataIndex: 'fail_reason',
      render: (text, record, index) => {
        if (!text) {
          return '无';
        }

        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100 }}
            onClick={() => {
              setModalContent(text);
              setIsModalOpen(true);
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
  ];

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [logCount, setLogCount] = useState(ITEMS_PER_PAGE);
  const [logType, setLogType] = useState(0);
  const isAdminUser = isAdmin();
  const [isModalOpenurl, setIsModalOpenurl] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const [modalImageUrl, setModalImageUrl] = useState('');

  let now = new Date();

  const [inputs, setInputs] = useState({
    channel_id: '',
    mj_id: '',
    start_timestamp: timestamp2string(now.getTime() / 1000 - 2592000),
    end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
  });
  const { channel_id, mj_id, start_timestamp, end_timestamp } = inputs;

  const [stat, setStat] = useState({
    quota: 0,
    token: 0,
  });

  const handleInputChange = (value, name) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const setLogsFormat = (logs) => {
    for (let i = 0; i < logs.length; i++) {
      logs[i].timestamp2string = timestamp2string(logs[i].created_at);
      logs[i].key = '' + logs[i].id;
    }
    setLogs(logs);
    setLogCount(logs.length + ITEMS_PER_PAGE);
  };

  const loadLogs = async (startIdx) => {
    setLoading(true);

    let url = '';
    let localStartTimestamp = Date.parse(start_timestamp);
    let localEndTimestamp = Date.parse(end_timestamp);
    if (isAdminUser) {
      url = `/api/mj/?p=${startIdx}&channel_id=${channel_id}&mj_id=${mj_id}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    } else {
      url = `/api/mj/self/?p=${startIdx}&mj_id=${mj_id}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    }
    const res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setLogsFormat(data);
      } else {
        let newLogs = [...logs];
        newLogs.splice(startIdx * ITEMS_PER_PAGE, data.length, ...data);
        setLogsFormat(newLogs);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const pageData = logs.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === Math.ceil(logs.length / ITEMS_PER_PAGE) + 1) {
      loadLogs(page - 1).then((r) => {});
    }
  };

  const refresh = async () => {
    setActivePage(1);
    await loadLogs(0);
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('已复制：' + text);
    } else {
      Modal.error({ title: '无法复制到剪贴板，请手动复制', content: text });
    }
  };

  useEffect(() => {
    refresh().then();
  }, [logType]);

  useEffect(() => {
    const mjNotifyEnabled = localStorage.getItem('mj_notify_enabled');
    if (mjNotifyEnabled !== 'true') {
      setShowBanner(true);
    }
  }, []);

  return (
    <>
      <Layout>
        <Layout.Header>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#6262a0' }}>绘画日志</h2>
          </div>
          {isAdminUser && showBanner ? (
            <Banner
              type='info'
              description='当前未开启Midjourney回调，部分项目可能无法获得绘图结果，可在运营设置中开启。'
            />
          ) : null}
          <Form layout='horizontal' style={{ marginTop: 10 }}>
            <>
              <Form.Input
                field='channel_id'
                label='渠道 ID'
                style={{ width: 176 }}
                value={channel_id}
                placeholder={'可选值'}
                name='channel_id'
                onChange={(value) => handleInputChange(value, 'channel_id')}
              />
              <Form.Input
                field='mj_id'
                label='任务 ID'
                style={{ width: 176 }}
                value={mj_id}
                placeholder='可选值'
                name='mj_id'
                onChange={(value) => handleInputChange(value, 'mj_id')}
              />
              <Form.DatePicker
                field='start_timestamp'
                label='起始时间'
                style={{ width: 272 }}
                initValue={new Date(start_timestamp)}
                value={new Date(start_timestamp)}
                type='dateTime'
                name='start_timestamp'
                onChange={(date) => handleInputChange(date.toISOString(), 'start_timestamp')}
              />
              <Form.DatePicker
                field='end_timestamp'
                fluid
                label='结束时间'
                style={{ width: 272 }}
                initValue={new Date(end_timestamp)}
                value={new Date(end_timestamp)}
                type='dateTime'
                name='end_timestamp'
                onChange={(date) => handleInputChange(date.toISOString(), 'end_timestamp')}
              />

              <Form.Section>
                <Button
                  label='查询'
                  type='primary'
                  htmlType='submit'
                  className='btn-margin-right'
                  onClick={refresh}
                >
                  查询
                </Button>
              </Form.Section>
            </>
          </Form>
        </Layout.Header>
        <Table
          style={{ marginTop: 5 }}
          columns={columns}
          dataSource={pageData}
          pagination={{
            currentPage: activePage,
            pageSize: ITEMS_PER_PAGE,
            total: logCount,
            pageSizeOpts: [10, 20, 50, 100],
            onPageChange: handlePageChange,
          }}
          loading={loading}
        />
        <Modal
          visible={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          closable={null}
          bodyStyle={{ height: '400px', overflow: 'auto' }}
          width={800}
        >
          <p style={{ whiteSpace: 'pre-line' }}>{modalContent}</p>
        </Modal>
        <ImagePreview
          src={modalImageUrl}
          visible={isModalOpenurl}
          onVisibleChange={(visible) => setIsModalOpenurl(visible)}
        />
      </Layout>
    </>
  );
};

export default LogsTable;
