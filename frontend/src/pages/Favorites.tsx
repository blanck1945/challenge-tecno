import { useQuery } from 'react-query';

import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import UserService from '../services/UserService';

export default function Favorites() {
  const { authenticatedUser } = useAuth();
  const { data, isLoading } = useQuery('favorites', () =>
    UserService.getFavorites(authenticatedUser.id),
  );

  return (
    <Layout header="Favorites">
      <div className="mt-5 flex flex-col gap-5">
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          data.map((favorite) => <div key={favorite.id}>{favorite.name}</div>)
        )}
      </div>
    </Layout>
  );
}
