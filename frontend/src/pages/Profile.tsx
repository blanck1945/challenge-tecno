import { useTranslation } from 'react-i18next';

import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';

export default function Profile() {
  const { t } = useTranslation();
  return (
    <Layout header={t('profile.header')}>
      <UpdateProfile />
    </Layout>
  );
}
