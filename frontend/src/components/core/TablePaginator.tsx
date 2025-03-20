import { useTranslation } from 'react-i18next';

import { Paginator as PaginatorType } from '../../models/core/Paginator';

interface PaginatorProps {
  data: PaginatorType<any>;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  refetch: () => void;
}

export default function TablePaginator({
  data,
  setPage,
  limit,
  setLimit,
  refetch,
}: PaginatorProps) {
  const { t } = useTranslation();

  const handlePageChange = (page: number) => {
    setPage(page);
    refetch();
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
    refetch();
  };

  if (data?.results?.length === 0) {
    return null;
  }

  return (
    <>
      {data?.results?.length > 0 && (
        <div className="flex justify-between items-center mt-4 border-t p-4">
          <div className="text-sm text-gray-700">
            {t('courses.paginator.showing')} {data?.page}{' '}
            {t('courses.paginator.of')} {data?.lastPage}
          </div>
          <div>
            <select
              className="input cursor-pointer"
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              value={limit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className={`${
                data?.page === 1
                  ? 'bg-gray-300 p-4 rounded-md cursor-not-allowed opacity-50'
                  : 'btn'
              }`}
              disabled={data?.page === 1}
              onClick={() => handlePageChange(data?.page - 1)}
            >
              {t('courses.paginator.previous')}
            </button>
            <button
              className={`${
                data?.page === data?.lastPage
                  ? 'bg-gray-300 p-4 rounded-md cursor-not-allowed opacity-50'
                  : 'btn'
              }`}
              disabled={data?.page === data?.lastPage}
              onClick={() => handlePageChange(data?.page + 1)}
            >
              {t('courses.paginator.next')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
