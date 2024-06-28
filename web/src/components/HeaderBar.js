import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useSetTheme, useTheme } from '../context/Theme';

import { API, getLogo, getSystemName, showSuccess, showError } from '../helpers';
import '../index.css';

import fireworks from 'react-fireworks';

import { IconHelpCircle, IconKey, IconRadio, IconUserAdd, IconUser } from '@douyinfe/semi-icons';
import { IconAccessibility, IconButton, IconNotification } from '@douyinfe/semi-icons-lab';
import { Avatar, Dropdown, Layout, Nav, Switch, Modal, Button } from '@douyinfe/semi-ui';
import { stringToColor } from '../helpers/render';

const HeaderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const systemName = getSystemName();
  const logo = getLogo();
  const currentDate = new Date();
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');
  
  // enable fireworks on new year(1.1 and 2.9-2.24)
  const isNewYear =
    (currentDate.getMonth() === 0 && currentDate.getDate() === 1) ||
    (currentDate.getMonth() === 1 &&
      currentDate.getDate() >= 9 &&
      currentDate.getDate() <= 24);

  async function logout() {
    setShowSidebar(false);
    await API.get('/api/user/logout');
    showSuccess('注销成功!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleNewYearClick = () => {
    fireworks.init('root', {});
    fireworks.start();
    setTimeout(() => {
      fireworks.stop();
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }, 3000);
  };

  const fetchNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      setNoticeContent(data);
      setNoticeVisible(true);
    } else {
      showError(message);
    }
  };

  const theme = useTheme();
  const setTheme = useSetTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('theme-mode', 'dark');
    }

    if (isNewYear) {
      console.log('Happy New Year!');
    }
  }, [theme, isNewYear]);

  return (
    <>
      <Modal
        title="公告"
        visible={noticeVisible}
        onCancel={() => setNoticeVisible(false)}
        footer={
          <Button type="primary" onClick={() => setNoticeVisible(false)}>
            我知道了
          </Button>
        }
        style={{ maxWidth: '900px', width: 'auto' }}
      >
        <div
          style={{ height: '50vh', overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: noticeContent }}
        />
      </Modal>
      
      <Layout>
        <div style={{ width: '100%' }}>
          <Nav
            mode={'horizontal'}
            renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
              const routerMap = {
                about: '/about',
                login: '/login',
                register: '/register',
              };
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={routerMap[props.itemKey]}
                >
                  {itemElement}
                </Link>
              );
            }}
            selectedKeys={[]}
            onSelect={(key) => {}}
            footer={
              <>
                {isNewYear && (
                  <Dropdown
                    position='bottomRight'
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={handleNewYearClick}>
                          Happy New Year!!!
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    <Nav.Item itemKey={'new-year'} text={'🏮'} />
                  </Dropdown>
                )}
                <Nav.Item itemKey={'notice'} icon={<IconNotification />} onClick={fetchNotice} />
                <Switch
                  checkedText='🌞'
                  size={'large'}
                  checked={theme === 'dark'}
                  uncheckedText='🌙'
                  onChange={(checked) => {
                    setTheme(checked);
                  }}
                />
                {userState.user ? (
                  <>
                    <Dropdown
                      position='bottomRight'
                      render={
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={logout}>退出</Dropdown.Item>
                        </Dropdown.Menu>
                      }
                    >
                      <Avatar
                        size='small'
                        color={stringToColor(userState.user.username)}
                        style={{ margin: 4 }}
                      >
                        {userState.user.username[0]}
                      </Avatar>
                      <span>{userState.user.username}</span>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Nav.Item
                      itemKey={'login'}
                      text={'登录'}
                      icon={<IconUser className="IconUser" />}
                    />
                    <Nav.Item
                      itemKey={'register'}
                      text={'注册'}
                      icon={<IconUserAdd className="IconUserAdd" />}
                    />
                  </>
                )}
              </>
            }
          ></Nav>
        </div>
      </Layout>
    </>
  );
};

export default HeaderBar;
