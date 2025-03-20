import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import FavoritesService from '../services/FavoritesService';

export default function Favorites() {
  const { t } = useTranslation();
  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery('getFavorites', () =>
    FavoritesService.getFavorites(authenticatedUser.id),
  );

  if (isLoading) {
    return <div>{t('favorites.loading')}</div>;
  }

  const handleRemoveFavorite = async (courseId: string) => {
    await FavoritesService.removeFavorite(authenticatedUser.id, courseId);
    refetch();
  };

  return (
    <Layout header={t('favorites.header')}>
      <div className="mt-5 flex flex-col gap-5">
        {data?.length === 0 ? (
          <div>{t('favorites.empty')}</div>
        ) : (
          data?.map((favorite) => (
            <div
              key={favorite.course.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="bg-gray-100 text-black p-4">
                <h3 className="text-lg font-semibold">
                  <Link to={`/courses/${favorite.course.id}`}>
                    {favorite.course.name}
                  </Link>
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-700">{favorite.course.description}</p>
              </div>
              <div className="bg-gray-100 p-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(favorite.course.id);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  ⭐
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
