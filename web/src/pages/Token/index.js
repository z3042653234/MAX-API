import React from 'react';
import TokensTable from '../../components/TokensTable';
import { Layout, Banner } from '@douyinfe/semi-ui';

const Token = () => {
  // 获取当前 URL
  const currentUrl = window.location.origin;
  const newUrl = currentUrl.replace(/^http:/, 'https:');

  return (
    <Layout>
      <Layout.Header>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#6262a0' }}>我的令牌</h2>
        </div>
      </Layout.Header>
      <Layout.Content>
        <div style={{ margin: '20px', display: 'flex', justifyContent: 'center' }}>
          <Banner
            fullMode={false}
            type="success"
            description={(
              <div style={{ textAlign: 'center' }}>
                将 OpenAI API 基础地址 <span style={{ textDecoration: 'underline' }}>https://api.openai.com</span> 替换为 <span style={{ textDecoration: 'underline' }}>{newUrl}</span> ，复制下面的密钥或点击聊天即可使用
              </div>
            )}
            closeIcon={null} // 如果不需要关闭按钮，可以设置为 null
            icon={null} // 去掉默认的 icon
          />
        </div>
        <TokensTable />
      </Layout.Content>
    </Layout>
  );
};

export default Token;
