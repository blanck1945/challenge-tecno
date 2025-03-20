import { useState } from 'react';
import { Loader, Plus, Star, ThumbsUp, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';

import ContentsTable from '../components/content/ContentsTable';
import EnrollBtn from '../components/content/EnrollBtn';
import Layout from '../components/layout';
import ModalHeader from '../components/modals/ModalHeader';
import RateModal from '../components/modals/RateModal';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';
import FavoritesService from '../services/FavoritesService';
import rankingService from '../services/reviewService';
import reviewService from '../services/reviewService';

export default function Course() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [rateCourseShow, setRateCourseShow] = useState<boolean>(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const userQuery = useQuery('user', async () => courseService.findOne(id));
  const { data: isFavorite, refetch } = useQuery(
    'isFavorite',
    () => {
      if (authenticatedUser.role === 'user') {
        return FavoritesService.isFavorite(authenticatedUser.id, id);
      }
      return null;
    },
    {
      enabled: authenticatedUser.role === 'user',
    },
  );

  const {
    data: userHasRankThisCourse,
    refetch: refetchUserHasRankThisCourse,
  } = useQuery(
    'averageRating',
    () => reviewService.getUserHasReviewedThisCourse(id, authenticatedUser.id),
    {
      enabled: authenticatedUser.role === 'user',
    },
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  const { data, isLoading, refetch: refetchContents } = useQuery(
    [`contents-${id}`, name, description, page, limit, sortBy],
    async () =>
      contentService.findAll(id, {
        name: name || undefined,
        description: description || undefined,
        sortBy: sortBy || undefined,
        page: page || undefined,
        limit: limit || undefined,
      }),
  );

  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    const formData = new FormData();
    formData.append('name', createContentRequest.name);
    formData.append('description', createContentRequest.description);
    formData.append('image', createContentRequest.image[0] || '');
    formData.append('courseId', id);

    try {
      await contentService.save(id, formData);
      setAddContentShow(false);
      reset();
      setError(null);
      refetchContents();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await FavoritesService.removeFavorite(authenticatedUser.id, id);
      } else {
        await FavoritesService.addFavorite(authenticatedUser.id, id);
      }
      setShowFavoriteModal(false);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSortBy(e.target.value);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleRateCourse = async (rating: number, message: string) => {
    try {
      await rankingService.save(id, authenticatedUser.id, rating, message);
      refetchUserHasRankThisCourse();
      setRateCourseShow(false);
      reset();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout header={`${userQuery?.data?.name}` || ''}>
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          {authenticatedUser.role !== 'user' ? (
            <button
              className="btn flex gap-2 w-full sm:w-auto justify-center"
              onClick={() => setAddContentShow(true)}
            >
              <Plus /> {t('contents.add_content_btn')}
            </button>
          ) : null}
          {authenticatedUser.role === 'user' && <EnrollBtn />}
          {authenticatedUser.role === 'user' && !userHasRankThisCourse && (
            <button
              className="btn flex gap-2 w-full sm:w-auto justify-center"
              onClick={() => setRateCourseShow(true)}
            >
              <ThumbsUp /> {t('rate.button')}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {authenticatedUser.role === 'user' && (
            <Star
              className={`cursor-pointer ${
                isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'
              }`}
              onClick={() => setShowFavoriteModal(true)}
            />
          )}
          {authenticatedUser.role === 'user' && (
            <div
              className={`flex items-center gap-2 border rounded-md p-2 ${
                userQuery?.data?.averageRating >= 4.5
                  ? 'bg-green-500'
                  : userQuery?.data?.averageRating >= 3
                  ? 'bg-green-300'
                  : userQuery?.data?.averageRating >= 1
                  ? 'bg-red-500'
                  : 'bg-gray-500'
              }`}
            >
              <span className="text-white semibold">
                {userQuery?.data?.averageRating || 0}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="table-filter flex items-center justify-between">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('contents.content_table.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('contents.content_table.description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div>
            <select
              className="input cursor-pointer"
              onChange={handleSelectChange}
            >
              <option value="" disabled hidden selected>
                {t('courses.sort_by')}
              </option>
              <option value="name:asc">
                {t('courses.sort_by_options.az')}
              </option>
              <option value="name:desc">
                {t('courses.sort_by_options.za')}
              </option>
              <option value="createdAt:desc">
                {t('courses.sort_by_options.newest')}
              </option>
              <option value="createdAt:asc">
                {t('courses.sort_by_options.oldest')}
              </option>
            </select>
          </div>
        </div>
      </div>

      <ContentsTable
        data={data}
        isLoading={isLoading}
        courseId={id}
        limit={limit}
        refetch={refetchContents}
        setPage={setPage}
        setLimit={setLimit}
      />

      {/* Rate Course Modal */}
      <RateModal
        show={rateCourseShow}
        onSubmit={handleRateCourse}
        onHide={() => {
          setRateCourseShow(false);
          reset();
        }}
      >
        {(props) => (
          <ModalHeader title={t('rate.header')} onHide={props.onHide} />
        )}
      </RateModal>

      {/* Add Content Modal */}
      <Modal show={addContentShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">
            {t('contents.add_content.header')}
          </h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddContentShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder={t('contents.add_content.name')}
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder={t('contents.add_content.description')}
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <div className="flex flex-col gap-2">
            <label className="font-semibold">
              {t('contents.add_content.image')}
            </label>
            <input
              type="file"
              className="input"
              accept="image/*"
              disabled={isSubmitting}
              {...register('image')}
            />
          </div>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              t('contents.add_content.save')
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>

      {/* Favorite Modal */}
      <Modal show={showFavoriteModal}>
        <div className="flex">
          <h1 className="font-semibold mb-3">
            {isFavorite
              ? t('contents.favorite.remove')
              : t('contents.favorite.add')}
          </h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => setShowFavoriteModal(false)}
          >
            <X size={30} />
          </button>
        </div>
        <hr />
        <div className="mt-5">
          <p>
            {t('contents.favorite.confirm', {
              action: isFavorite
                ? t('contents.favorite.remove_action')
                : t('contents.favorite.add_action'),
            })}
          </p>
          <div className="flex justify-end gap-3 mt-5">
            <button className="btn" onClick={handleFavoriteClick}>
              {t('contents.favorite.confirm_button')}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
