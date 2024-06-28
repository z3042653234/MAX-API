import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/User';
import { StatusContext } from '../context/Status';

import {
  API,
  getLogo,
  getSystemName,
  isAdmin,
  isMobile,
  showError,
} from '../helpers';
import '../index.css';

import {
  IconCalendarClock,
  IconComment,
  IconCreditCard,
  IconGift,
  IconHistogram,
  IconHome,
  IconImage,
  IconKey,
  IconLayers,
  IconPriceTag,
  IconSetting,
  IconUser,
  IconMusic,
} from '@douyinfe/semi-icons';

// 引入 @douyinfe/semi-icons-lab 中的图标
import { IconColoredHome, IconColoredLayers, IconAvatar, IconTimePicker, IconFaq, IconIntro, IconTag, IconForm, IconRating, IconColorPlatte, IconConfig, IconSideSheet } from '@douyinfe/semi-icons-lab';
import { Layout, Nav } from '@douyinfe/semi-ui';
import { setStatusData } from '../helpers/data.js';

// HeaderBar Buttons

const SiderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const defaultIsCollapsed =
    isMobile() || localStorage.getItem('default_collapse_sidebar') === 'true';

  let navigate = useNavigate();
  let location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const systemName = getSystemName();
  const logo = getLogo();
  const [isCollapsed, setIsCollapsed] = useState(defaultIsCollapsed);

  const routerMap = {
    home: '/',
    channel: '/channel',
    token: '/token',
    redemption: '/redemption',
    topup: '/topup',
    user: '/user',
    log: '/log',
    midjourney: '/midjourney',
    setting: '/setting',
    about: '/about',
    chat: '/chat',
    detail: '/detail',
    pricing: '/pricing',
    task: '/task',
    aiSite: '/ai-site', // 新增的路径
  };

  const headerButtons = useMemo(
    () => [
      {
        text: '首页',
        itemKey: 'home',
        to: '/',
        icon: <IconIntro />,
      },
      {
        text: '渠道',
        itemKey: 'channel',
        to: '/channel',
        icon: <IconLayers />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '聊天',
        itemKey: 'chat',
        to: '/chat',
        icon: <IconComment className="custom-color" />,
        className: localStorage.getItem('chat_link')
          ? 'semi-navigation-item-normal'
          : 'tableHiddle',
      },
      {
        text: '令牌',
        itemKey: 'token',
        to: '/token',
        icon: <IconTag />,
      },
      {
        text: '兑换码',
        itemKey: 'redemption',
        to: '/redemption',
        icon: <IconSideSheet />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '钱包',
        itemKey: 'topup',
        to: '/topup',
        icon: <IconCreditCard className="custom-color-1" />,
      },
      {
        text: '日志',
        itemKey: 'logs',
        icon: <IconForm />,
        items: [
          {
            text: '请求日志',
            itemKey: 'log',
            to: '/log',
          },
          {
            text: '数据看板',
            itemKey: 'detail',
            to: '/detail',
            className:
              localStorage.getItem('enable_data_export') === 'true'
                ? 'semi-navigation-item-normal'
                : 'tableHiddle',
          },
          {
            text: '绘画日志',
            itemKey: 'midjourney',
            to: '/midjourney',
            className:
              localStorage.getItem('enable_drawing') === 'true'
                ? 'semi-navigation-item-normal'
                : 'tableHiddle',
          },
          {
            text: '异步任务',
            itemKey: 'task',
            to: '/task',
            className:
              localStorage.getItem('enable_task') === 'true'
                ? 'semi-navigation-item-normal'
                : 'tableHiddle',
          },
        ],
      },
      {
        text: '模型列表',
        itemKey: 'pricing',
        to: '/pricing',
        icon: <IconRating />,
      },
      {
        text: '用户管理',
        itemKey: 'user',
        to: '/user',
        icon: <IconAvatar />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '设置',
        itemKey: 'setting',
        to: '/setting',
        icon: <IconSetting />,
      },
      {
        type: 'divider',
        className: 'custom-divider',
      },
      {
        text: 'Suno歌词生成器',
        itemKey: 'aiSite',
        to: '/ai-site',
        icon: <IconMusic className="IconMusic" />,
      },
      {
           text: '活动福利',
           itemKey: 'about',
           to: '/about',
           icon: <IconGift className="IconGift" />
      }
    ],
    [
      localStorage.getItem('enable_data_export'),
      localStorage.getItem('enable_drawing'),
      localStorage.getItem('enable_task'),
      localStorage.getItem('chat_link'),
      isAdmin(),
    ],
  );

  const loadStatus = async () => {
    const res = await API.get('/api/status');
    if (res === undefined) {
      return;
    }
    const { success, data } = res.data;
    if (success) {
      statusDispatch({ type: 'set', payload: data });
      setStatusData(data);
    } else {
      showError('无法正常连接至服务器！');
    }
  };

  useEffect(() => {
    loadStatus().then(() => {
      setIsCollapsed(
        isMobile() ||
        localStorage.getItem('default_collapse_sidebar') === 'true',
      );
    });

    let localKey = window.location.pathname.split('/')[1];
    if (localKey === '') {
      localKey = 'home';
    }
    setSelectedKeys([localKey]);
  }, []);

  useEffect(() => {
    const pathName = location.pathname.split('/')[1];
    setSelectedKeys([pathName || 'home']);
  }, [location.pathname]);

  return (
    <>
      <Layout>
        <div style={{ height: '100%' }}>
          <Nav
            // bodyStyle={{ maxWidth: 200 }}
            style={{ maxWidth: 200 }}
            defaultIsCollapsed={
              isMobile() ||
              localStorage.getItem('default_collapse_sidebar') === 'true'
            }
            isCollapsed={isCollapsed}
            onCollapseChange={(collapsed) => {
              setIsCollapsed(collapsed);
            }}
            selectedKeys={selectedKeys}
            renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={routerMap[props.itemKey]}
                >
                  {itemElement}
                </Link>
              );
            }}
            items={headerButtons}
            onSelect={(key) => {
              setSelectedKeys([key.itemKey]);
            }}
            header={{
              logo: (
                <img src={logo} alt='logo' style={{ marginRight: '0.75em' }} />
              ),
              text: systemName,
            }}
            // footer={{
            //   text: '© 2021 NekoAPI',
            // }}
          >
            <Nav.Footer collapseButton={true}></Nav.Footer>
          </Nav>
        </div>
      </Layout>
    </>
  );
};

export default SiderBar;