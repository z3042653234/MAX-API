import React, { useEffect, useState } from 'react';
import { API, showError, showInfo, showSuccess } from '../../helpers';
import {
  renderQuota,
  renderQuotaWithAmount,
} from '../../helpers/render';
import {
  Layout,
  Card,
  Button,
  Form,
  Divider,
  Space,
  Modal,
  Toast,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';

const TopUp = () => {
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpCount, setTopUpCount] = useState(0);
  const [amount, setAmount] = useState(0.0);
  const [minTopUp, setMinTopUp] = useState(1);
  const [topUpLink, setTopUpLink] = useState('');
  const [enableOnlineTopUp, setEnableOnlineTopUp] = useState(false);
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [payWay, setPayWay] = useState('');

  const topUp = async () => {
    if (redemptionCode === '') {
      showInfo('请输入兑换码！');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: redemptionCode,
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess('兑换成功！');
        Modal.success({
          title: '兑换成功！',
          content: '成功兑换额度：' + renderQuota(data),
          centered: true,
        });
        setUserQuota((quota) => quota + data);
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError('请求失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showError('超级管理员未设置充值链接！');
      return;
    }
    window.open(topUpLink, '_blank');
  };

  const preTopUp = async (payment) => {
    if (!enableOnlineTopUp) {
      showError('管理员未开启在线充值！');
      return;
    }
    await getAmount();
    if (topUpCount < minTopUp) {
      showError('充值数量不能小于' + minTopUp);
      return;
    }
    setPayWay(payment);
    setOpen(true);
  };

  const onlineTopUp = async () => {
    if (amount === 0) {
      await getAmount();
    }
    if (topUpCount < minTopUp) {
      showError('充值数量不能小于' + minTopUp);
      return;
    }
    setOpen(false);
    try {
      const res = await API.post('/api/user/pay', {
        amount: parseInt(topUpCount),
        payment_method: payWay,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          let params = data;
          let url = res.data.url;
          let form = document.createElement('form');
          form.action = url;
          form.method = 'POST';
          let isSafari =
            navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') < 1;
          if (!isSafari) {
            form.target = '_blank';
          }
          for (let key in params) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          showError(data);
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setUserQuota(data.quota);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.top_up_link) {
        setTopUpLink(status.top_up_link);
      }
      if (status.min_topup) {
        setMinTopUp(status.min_topup);
      }
      if (status.enable_online_topup) {
        setEnableOnlineTopUp(status.enable_online_topup);
      }
    }
    getUserQuota().then();
  }, []);

  const renderAmount = () => {
    return amount + '元';
  };

  const getAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    try {
      const res = await API.post('/api/user/amount', {
        amount: parseFloat(value),
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Layout>
        <Layout.Header>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#6262a0', margin: 0 }}>我的钱包</h2>
          </div>
        </Layout.Header>
        <Layout.Content style={{ padding: '20px' }}>
          <Modal
            title='确认充值'
            visible={open}
            onOk={onlineTopUp}
            onCancel={handleCancel}
            maskClosable={false}
            size={'small'}
            centered={true}
          >
            <p>充值数量：{topUpCount}</p>
            <p>实付金额：{renderAmount()}</p>
            <p>是否确认充值？</p>
          </Modal>
          <div
            style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
          >
            <Card
              style={{
                width: '100%',
                maxWidth: '650px',
                borderRadius: 'var(--semi-border-radius-small)',
              }}
              cover={
                <img
                  alt="example"
                  src="https://t.mwm.moe/pc"
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderTopLeftRadius: 'var(--semi-border-radius-small)',
                    borderTopRightRadius: 'var(--semi-border-radius-small)',
                  }}
                />
              }
            >
              <Title heading={3} style={{ textAlign: 'center', marginBottom: 20 }}>
                余额 {renderQuota(userQuota)}
              </Title>
              <div>
                <Divider>兑换余额</Divider>
                <Form>
                  <Form.Input
                    field={'redemptionCode'}
                    label={'兑换码'}
                    placeholder='请输入兑换码'
                    name='redemptionCode'
                    value={redemptionCode}
                    onChange={(value) => setRedemptionCode(value)}
                  />
                  <Space style={{ marginTop: 20 }}>
                    {topUpLink && (
                      <Button
                        type={'primary'}
                        theme={'solid'}
                        onClick={openTopUpLink}
                      >
                        获取兑换码
                      </Button>
                    )}
                    <Button
                      type={'warning'}
                      theme={'solid'}
                      onClick={topUp}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '兑换中...' : '兑换'}
                    </Button>
                  </Space>
                </Form>
              </div>
              <div style={{ marginTop: 40 }}>
                <Divider>在线充值</Divider>
                <Form>
                  <Form.Input
                    field={'topUpCount'}
                    label={`充值数量（最低 ${minTopUp}）`}
                    placeholder={`请输入充值数量`}
                    type={'number'}
                    value={topUpCount}
                    onChange={async (value) => {
                      if (value < minTopUp) {
                        value = minTopUp;
                      }
                      setTopUpCount(value);
                      await getAmount(value);
                    }}
                    suffix={`实付金额：${renderAmount()}`}
                    disabled={!enableOnlineTopUp}
                  />
                  <Space style={{ marginTop: 20 }}>
                    <Button
                      type={'primary'}
                      theme={'solid'}
                      onClick={() => preTopUp('zfb')}
                    >
                      支付宝
                    </Button>
                    <Button
                      style={{ backgroundColor: 'rgba(var(--semi-green-5), 1)' }}
                      type={'primary'}
                      theme={'solid'}
                      onClick={() => preTopUp('wx')}
                    >
                      微信
                    </Button>
                  </Space>
                </Form>
              </div>
            </Card>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default TopUp;
