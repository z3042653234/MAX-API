import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API, getLogo, getSystemName, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';
import {
  Button,
  Card,
  Divider,
  Form,
  Icon,
  Layout,
  Modal,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';

const RegisterForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
  });
  const { username, password, password2, email, verification_code } = inputs;
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const logo = getLogo();
  let affCode = new URLSearchParams(window.location.search).get('aff');

  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setShowEmailVerification(status.email_verification);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

  let navigate = useNavigate();

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！');
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致');
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
        return;
      }
      setLoading(true);
      if (!affCode) {
        affCode = localStorage.getItem('aff');
      }
      inputs.aff_code = affCode;
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        inputs,
      );
      const { success, message } = res.data;
      if (success) {
        navigate('/login');
        showSuccess('注册成功！');
      } else {
        showError(message);
      }
      setLoading(false);
    }
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') return;
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
      showSuccess('验证码发送成功，请检查你的邮箱！');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Layout.Header></Layout.Header>
      <Layout.Content>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
            marginTop: 80,
          }}
        >
          <div style={{ width: 500 }}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img 
                  src={logo} 
                  alt="logo" 
                  style={{ 
                    height: 72, 
                    marginBottom: 10, 
                    borderRadius: 'var(--semi-border-radius-small)' 
                  }} 
                />
                <Title heading={2} style={{ textAlign: 'center' }}>
                  欢迎加入
                </Title>
                <Title style={{ color: '#6262a0' }} heading={2}>
                  注册 {getSystemName()} 账户
                </Title>
              </div>
              <Form>
                <Form.Input
                  field={'username'}
                  label={'用户名'}
                  placeholder='输入用户名，最长 12 位'
                  name='username'
                  onChange={(value) => handleChange('username', value)}
                />
                <Form.Input
                  field={'password'}
                  label={'密码'}
                  placeholder='输入密码，最短 8 位，最长 20 位'
                  name='password'
                  type='password'
                  onChange={(value) => handleChange('password', value)}
                />
                <Form.Input
                  field={'password2'}
                  label={'确认密码'}
                  placeholder='再次输入密码'
                  name='password2'
                  type='password'
                  onChange={(value) => handleChange('password2', value)}
                />
                {showEmailVerification ? (
                  <>
                    <Form.Input
                      field={'email'}
                      label={'邮箱'}
                      placeholder='输入邮箱地址'
                      name='email'
                      type='email'
                      onChange={(value) => handleChange('email', value)}
                      suffix={
                        <Button 
                          onClick={sendVerificationCode} 
                          disabled={loading}
                        >
                          获取验证码
                        </Button>
                      }
                    />
                    <Form.Input
                      field={'verification_code'}
                      label={'验证码'}
                      placeholder='输入验证码'
                      name='verification_code'
                      onChange={(value) => handleChange('verification_code', value)}
                    />
                  </>
                ) : (
                  <></>
                )}
                <Button
                  theme='solid'
                  style={{ width: '100%', marginTop: 20 }}
                  type={'primary'}
                  size='large'
                  onClick={handleSubmit}
                  loading={loading}
                >
                  注册
                </Button>
              </Form>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}
              >
                <Text>
                  已有账户？<Link to='/login'>点击登录</Link>
                </Text>
              </div>
            </Card>
            {turnstileEnabled ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
              >
                <Turnstile
                  sitekey={turnstileSiteKey}
                  onVerify={(token) => {
                    setTurnstileToken(token);
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default RegisterForm;
