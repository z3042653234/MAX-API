import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  API,
  copy,
  isRoot,
  showError,
  showInfo,
  showSuccess,
} from '../helpers';
import Turnstile from 'react-turnstile';
import { UserContext } from '../context/User';
import { onGitHubOAuthClicked } from './utils';
import {
  Avatar,
  Banner,
  Button,
  Card,
  Descriptions,
  Image,
  Input,
  InputNumber,
  Layout,
  Modal,
  Space,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import {
  getQuotaPerUnit,
  renderQuota,
  renderQuotaWithPrompt,
  stringToColor,
} from '../helpers/render';
import TelegramLoginButton from 'react-telegram-login';

const PersonalSetting = () => {
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [inputs, setInputs] = useState({
    wechat_verification_code: '',
    email_verification_code: '',
    email: '',
    self_account_deletion_confirmation: '',
    set_new_password: '',
    set_new_password_confirmation: '',
  });
  const [status, setStatus] = useState({});
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showWeChatBindModal, setShowWeChatBindModal] = useState(false);
  const [showEmailBindModal, setShowEmailBindModal] = useState(false);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [affLink, setAffLink] = useState('');
  const [systemToken, setSystemToken] = useState('');
  const [models, setModels] = useState([]);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
    getUserData().then(() => {
      console.log(userState);
    });
    loadModels().then();
    getAffLink().then();
    setTransferAmount(getQuotaPerUnit());
  }, []);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval); // Clean up on unmount
  }, [disableButton, countdown]);

  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const generateAccessToken = async () => {
    const res = await API.get('/api/user/token');
    const { success, message, data } = res.data;
    if (success) {
      setSystemToken(data);
      await copy(data);
      showSuccess(`令牌已重置并已复制到剪贴板`);
    } else {
      showError(message);
    }
  };

  const getAffLink = async () => {
    const res = await API.get('/api/user/aff');
    const { success, message, data } = res.data;
    if (success) {
      let link = `${window.location.origin}/register?aff=${data}`;
      setAffLink(link);
    } else {
      showError(message);
    }
  };

  const getUserData = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
    } else {
      showError(message);
    }
  };

  const loadModels = async () => {
    let res = await API.get(`/api/user/models`);
    const { success, message, data } = res.data;
    if (success) {
      setModels(data);
      console.log(data);
    } else {
      showError(message);
    }
  };

  const handleAffLinkClick = async (e) => {
    e.target.select();
    await copy(e.target.value);
    showSuccess(`邀请链接已复制到剪切板`);
  };

  const handleSystemTokenClick = async (e) => {
    e.target.select();
    await copy(e.target.value);
    showSuccess(`系统令牌已复制到剪切板`);
  };

  const deleteAccount = async () => {
    if (inputs.self_account_deletion_confirmation !== userState.user.username) {
      showError('请输入你的账户名以确认删除！');
      return;
    }

    const res = await API.delete('/api/user/self');
    const { success, message } = res.data;

    if (success) {
      showSuccess('账户已删除！');
      await API.get('/api/user/logout');
      userDispatch({ type: 'logout' });
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      showError(message);
    }
  };

  const bindWeChat = async () => {
    if (inputs.wechat_verification_code === '') return;
    const res = await API.get(
      `/api/oauth/wechat/bind?code=${inputs.wechat_verification_code}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('微信账户绑定成功！');
      setShowWeChatBindModal(false);
    } else {
      showError(message);
    }
  };

  const changePassword = async () => {
    if (inputs.set_new_password !== inputs.set_new_password_confirmation) {
      showError('两次输入的密码不一致！');
      return;
    }
    const res = await API.put(`/api/user/self`, {
      password: inputs.set_new_password,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess('密码修改成功！');
    } else {
      showError(message);
    }
    setShowChangePasswordModal(false);
  };

  const transfer = async () => {
    if (transferAmount < getQuotaPerUnit()) {
      showError('划转金额最低为' + renderQuota(getQuotaPerUnit()));
      return;
    }
    const res = await API.post(`/api/user/aff_transfer`, {
      quota: transferAmount,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(message);
      setOpenTransfer(false);
      getUserData().then();
    } else {
      showError(message);
    }
  };

  const sendVerificationCode = async () => {
    if (inputs.email === '') {
      showError('请输入邮箱！');
      return;
    }
    setDisableButton(true);
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('验证码发送成功，请检查邮箱！');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const bindEmail = async () => {
    if (inputs.email_verification_code === '') {
      showError('请输入邮箱验证码！');
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/oauth/email/bind?email=${inputs.email}&code=${inputs.email_verification_code}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('邮箱账户绑定成功！');
      setShowEmailBindModal(false);
      userState.user.email = inputs.email;
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const getUsername = () => {
    if (userState.user) {
      return userState.user.username;
    } else {
      return 'null';
    }
  };

  const handleCancel = () => {
    setOpenTransfer(false);
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('已复制：' + text);
    } else {
      Modal.error({ title: '无法复制到剪贴板，请手动复制', content: text });
    }
  };

  return (
    <div className="semi-col" >
      <div className="semi-card semi-card-bordered">
        <div className="semi-card-body">
          <div className="semi-card-meta">
            <div className="semi-card-meta-avatar">
              <span className="semi-avatar semi-avatar-circle semi-avatar-default semi-avatar-img">
                <img src="/tx.png" alt="avatar" />
              </span>
            </div>
            <div className="semi-card-meta-wrapper">
              <div className="semi-card-meta-wrapper-title">
                <span className="semi-typography semi-typography-primary semi-typography-normal">
                  <div
                    className="semi-tag semi-tag-default semi-tag-square semi-tag-light semi-tag-green-light"
                    style={{ marginRight: 8 }}
                  >
                    <div className="semi-tag-content semi-tag-content-ellipsis">
                      ID: {userState?.user?.id || '2079'}
                    </div>
                  </div>
                  {getUsername()}
                </span>
              </div>
              <div className="semi-card-meta-wrapper-description">
                <div
                  className="semi-tag semi-tag-default semi-tag-square semi-tag-ghost semi-tag-light-blue-ghost"
                  style={{ margin: 10 }}
                >
                  <div className="semi-tag-content semi-tag-content-center">
                    <span
                      role="img"
                      aria-label="member"
                      className="semi-icon semi-icon-small semi-icon-member"
                      style={{ marginRight: 5 }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        focusable="false"
                        aria-hidden="true"
                      >
                        <path
                          d="M0.829978 7.659C0.590978 6.892 1.50498 6.29 2.11498 6.813L3.96998 8.402C4.32328 8.70469 4.74214 8.92106 5.19346 9.03401C5.64478 9.14696 6.11618 9.15339 6.57041 9.05281C7.02464 8.95222 7.44925 8.74737 7.81069 8.45445C8.17213 8.16152 8.46049 7.78855 8.65298 7.365L11.091 2.003C11.446 1.221 12.556 1.221 12.911 2.003L15.349 7.365C15.5415 7.78855 15.8298 8.16152 16.1913 8.45445C16.5527 8.74737 16.9773 8.95222 17.4315 9.05281C17.8858 9.15339 18.3572 9.14696 18.8085 9.03401C19.2598 8.92106 19.6787 8.70469 20.032 8.402L21.886 6.813C22.496 6.29 23.41 6.893 23.17 7.659L19.44 19.597C19.3127 20.0041 19.0586 20.3598 18.7148 20.6122C18.371 20.8646 17.9555 21.0005 17.529 21H6.46998C6.04369 21 5.62856 20.8637 5.28515 20.6112C4.94174 20.3586 4.68801 20.0029 4.56098 19.596L0.830978 7.66L0.829978 7.659Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                    {userState.user?.group || '普通用户'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="semi-card semi-card-bordered" style={{ marginTop: 20 }}>
        <div className="semi-card-body">
          <div className="semi-descriptions semi-descriptions-left semi-descriptions-vertical">
            <table>
              <tbody>
                <tr>
                  <th className="semi-descriptions-item semi-descriptions-item-th">
                    <span className="semi-descriptions-key">当前余额</span>
                  </th>
                  <td className="semi-descriptions-item semi-descriptions-item-td" colSpan="1">
                    <span className="semi-descriptions-value">
                      <b style={{ color: 'rgb(63, 134, 0)' }}>{renderQuota(userState?.user?.quota)}</b>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className="semi-descriptions-item semi-descriptions-item-th">
                    <span className="semi-descriptions-key">历史消耗</span>
                  </th>
                  <td className="semi-descriptions-item semi-descriptions-item-td" colSpan="1">
                    <span className="semi-descriptions-value">{renderQuota(userState?.user?.used_quota)}</span>
                  </td>
                </tr>
                <tr>
                  <th className="semi-descriptions-item semi-descriptions-item-th">
                    <span className="semi-descriptions-key">请求次数</span>
                  </th>
                  <td className="semi-descriptions-item semi-descriptions-item-td" colSpan="1">
                    <span className="semi-descriptions-value">{userState?.user?.request_count} 次</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="semi-card semi-card-bordered" style={{ marginTop: 20 }}>
        <div className="semi-card-body">
          <div style={{ marginTop: 20 }}>
            <Typography.Text strong>邮箱</Typography.Text>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="semi-input-wrapper semi-input-wrapper-readonly semi-input-wrapper-default">
                  <Input
                    value={
                      userState.user && userState.user.email !== ''
                        ? userState.user.email
                        : '未绑定'
                    }
                    readOnly={true}
                  />
                </div>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setShowEmailBindModal(true);
                  }}
                >
                  {userState.user && userState.user.email !== ''
                    ? '修改绑定'
                    : '绑定邮箱'}
                </Button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Typography.Text strong>微信</Typography.Text>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="semi-input-wrapper semi-input-wrapper-readonly semi-input-wrapper-default">
                  <Input
                    value={
                      userState.user && userState.user.wechat_id !== ''
                        ? '已绑定'
                        : '未绑定'
                    }
                    readOnly={true}
                  />
                </div>
              </div>
              <div>
                <Button
                  disabled={
                    (userState.user && userState.user.wechat_id !== '') ||
                    !status.wechat_login
                  }
                >
                  {status.wechat_login ? '绑定' : '未启用'}
                </Button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Typography.Text strong>GitHub</Typography.Text>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="semi-input-wrapper semi-input-wrapper-readonly semi-input-wrapper-default">
                  <Input
                    value={
                      userState.user && userState.user.github_id !== ''
                        ? userState.user.github_id
                        : '未绑定'
                    }
                    readOnly={true}
                  />
                </div>
              </div>
              <div>
                <Button
                  onClick={() => {
                    onGitHubOAuthClicked(status.github_client_id);
                  }}
                  disabled={
                    (userState.user && userState.user.github_id !== '') ||
                    !status.github_oauth
                  }
                >
                  {status.github_oauth ? '绑定' : '未启用'}
                </Button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <Typography.Text strong>Telegram</Typography.Text>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="semi-input-wrapper-readonly semi-input-wrapper-default">
                  <Input
                    value={
                      userState.user && userState.user.telegram_id !== ''
                        ? userState.user.telegram_id
                        : '未绑定'
                    }
                    readOnly={true}
                  />
                </div>
              </div>
              <div>
                {status.telegram_oauth ? (
                  userState.user.telegram_id !== '' ? (
                    <Button disabled={true}>已绑定</Button>
                  ) : (
                    <TelegramLoginButton
                      dataAuthUrl="/api/oauth/telegram/bind"
                      botName={status.telegram_bot_name}
                    />
                  )
                ) : (
                  <Button disabled={true}>未启用</Button>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <Space>
              <Button onClick={generateAccessToken}>生成系统访问令牌</Button>
              <Button
                onClick={() => {
                  setShowChangePasswordModal(true);
                }}
              >
                修改密码
              </Button>
              <Button
                type="danger"
                onClick={() => {
                  setShowAccountDeleteModal(true);
                }}
              >
                删除个人账户
              </Button>
            </Space>

            {systemToken && (
              <Input
                readOnly
                value={systemToken}
                onClick={handleSystemTokenClick}
                style={{ marginTop: '10px' }}
              />
            )}
            {status.wechat_login && (
              <Button
                onClick={() => {
                  setShowWeChatBindModal(true);
                }}
              >
                绑定微信账号
              </Button>
            )}
            <Modal
              onCancel={() => setShowWeChatBindModal(false)}
              visible={showWeChatBindModal}
              size="small"
            >
              <Image src={status.wechat_qrcode} />
              <div style={{ textAlign: 'center' }}>
                <p>微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）</p>
              </div>
              <Input
                placeholder="验证码"
                name="wechat_verification_code"
                value={inputs.wechat_verification_code}
                onChange={(v) =>
                  handleInputChange('wechat_verification_code', v)
                }
              />
              <Button color="" fluid size="large" onClick={bindWeChat}>
                绑定
              </Button>
            </Modal>
          </div>
        </div>
      </div>

      <Modal
        onCancel={() => setShowEmailBindModal(false)}
        onOk={bindEmail}
        visible={showEmailBindModal}
        size="small"
        centered={true}
        maskClosable={false}
      >
        <Typography.Title heading={6}>绑定邮箱地址</Typography.Title>
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Input
            fluid
            placeholder="输入邮箱地址"
            onChange={(value) => handleInputChange('email', value)}
            name="email"
            type="email"
          />
          <Button onClick={sendVerificationCode} disabled={disableButton || loading}>
            {disableButton ? `重新发送 (${countdown})` : '获取验证码'}
          </Button>
        </div>
        <div style={{ marginTop: 10 }}>
          <Input
            fluid
            placeholder="验证码"
            name="email_verification_code"
            value={inputs.email_verification_code}
            onChange={(value) =>
              handleInputChange('email_verification_code', value)
            }
          />
        </div>
        {turnstileEnabled && (
          <Turnstile
            sitekey={turnstileSiteKey}
            onVerify={(token) => {
              setTurnstileToken(token);
            }}
          />
        )}
      </Modal>

      <Modal
        onCancel={() => setShowAccountDeleteModal(false)}
        visible={showAccountDeleteModal}
        size="small"
        centered={true}
        onOk={deleteAccount}
      >
        <div style={{ marginTop: 20 }}>
          <Banner
            type="danger"
            description="您正在删除自己的帐户，将清空所有数据且不可恢复"
            closeIcon={null}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Input
            placeholder={`输入你的账户名 ${userState?.user?.username} 以确认删除`}
            name="self_account_deletion_confirmation"
            value={inputs.self_account_deletion_confirmation}
            onChange={(value) =>
              handleInputChange('self_account_deletion_confirmation', value)
            }
          />
          {turnstileEnabled && (
            <Turnstile
              sitekey={turnstileSiteKey}
              onVerify={(token) => {
                setTurnstileToken(token);
              }}
            />
          )}
        </div>
      </Modal>

      <Modal
        onCancel={() => setShowChangePasswordModal(false)}
        visible={showChangePasswordModal}
        size="small"
        centered={true}
        onOk={changePassword}
      >
        <div style={{ marginTop: 20 }}>
          <Input
            name="set_new_password"
            placeholder="新密码"
            value={inputs.set_new_password}
            onChange={(value) => handleInputChange('set_new_password', value)}
          />
          <Input
            style={{ marginTop: 20 }}
            name="set_new_password_confirmation"
            placeholder="确认新密码"
            value={inputs.set_new_password_confirmation}
            onChange={(value) =>
              handleInputChange('set_new_password_confirmation', value)
            }
          />
          {turnstileEnabled && (
            <Turnstile
              sitekey={turnstileSiteKey}
              onVerify={(token) => {
                setTurnstileToken(token);
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PersonalSetting;