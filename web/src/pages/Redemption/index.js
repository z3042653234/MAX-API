import React from 'react';
import RedemptionsTable from '../../components/RedemptionsTable';
import { Layout } from '@douyinfe/semi-ui';

const Redemption = () => (
  <>
    <Layout>
      <Layout.Header>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#6262a0' }}>管理兑换码</h2>
        </div>
      </Layout.Header>
      <Layout.Content>
        <RedemptionsTable />
      </Layout.Content>
    </Layout>
  </>
);

export default Redemption;
