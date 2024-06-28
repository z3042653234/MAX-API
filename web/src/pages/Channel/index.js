import React from 'react';
import ChannelsTable from '../../components/ChannelsTable';
import { Layout } from '@douyinfe/semi-ui';

const File = () => (
  <>
    <Layout>
      <Layout.Header>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#6262a0' }}>管理渠道</h2>
        </div>
      </Layout.Header>
      <Layout.Content>
        <ChannelsTable />
      </Layout.Content>
    </Layout>
  </>
);

export default File;
