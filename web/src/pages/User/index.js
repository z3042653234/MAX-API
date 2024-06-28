import React from 'react';
import UsersTable from '../../components/UsersTable';
import { Layout } from '@douyinfe/semi-ui';

const User = () => (
  <>
    <Layout>
      <Layout.Header>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#6262a0' }}>管理用户</h2>
        </div>
      </Layout.Header>
      <Layout.Content>
        <UsersTable />
      </Layout.Content>
    </Layout>
  </>
);

export default User;
