import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useAuth from '../../hooks/useAuth';
import Content from '../../models/content/Content';
import UpdateContentRequest from '../../models/content/UpdateContentRequest';
import { Paginator } from '../../models/core/Paginator';
import contentService from '../../services/ContentService';
import TablePaginator from '../core/TablePaginator';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface ContentsTableProps {
  data: Paginator<Content>;
  courseId: string;
  isLoading: boolean;
  limit: number;
  refetch: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export default function ContentsTable({
  data,
  isLoading,
  courseId,
  limit,
  refetch,
  setPage,
  setLimit,
}: ContentsTableProps) {
  const { authenticatedUser } = useAuth();
  const { t } = useTranslation();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [selectedContentId, setSelectedContentId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateContentRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await contentService.delete(courseId, selectedContentId);
      setDeleteShow(false);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateContentRequest: UpdateContentRequest) => {
    try {
      const formData = new FormData();
      formData.append('name', updateContentRequest.name);
      formData.append('description', updateContentRequest.description);
      formData.append('image', image);

      await contentService.update(courseId, selectedContentId, formData);

      setUpdateShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="table-container">
        <Table
          columns={[
            t('contents.content_table.image'),
            t('contents.content_table.name'),
            t('contents.content_table.description'),
            t('contents.content_table.created'),
          ]}
        >
          {isLoading
            ? null
            : data?.results?.map(
                ({ id, name, description, createdAt, image }) => (
                  <tr key={id}>
                    <TableItem>
                      <img
                        src={
                          image
                            ? `https://ucarecdn.com/${image}/`
                            : 'https://thumbs.dreamstime.com/b/no-image-vector-symbol-missing-available-icon-gallery-moment-placeholder-253126896.jpg'
                        }
                        alt={name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableItem>
                    <TableItem>{name}</TableItem>
                    <TableItem>{description}</TableItem>
                    <TableItem>
                      {new Date(createdAt).toLocaleDateString()}
                    </TableItem>
                    <TableItem className="text-right">
                      {['admin', 'editor'].includes(authenticatedUser.role) ? (
                        <button
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          onClick={() => {
                            setSelectedContentId(id);

                            setValue('name', name);
                            setValue('description', description);
                            setImage(image);

                            setUpdateShow(true);
                          }}
                        >
                          {t('contents.content_table.edit')}
                        </button>
                      ) : null}
                      {authenticatedUser.role === 'admin' ? (
                        <button
                          className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                          onClick={() => {
                            setSelectedContentId(id);
                            setDeleteShow(true);
                          }}
                        >
                          {t('contents.content_table.delete')}
                        </button>
                      ) : null}
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>

        {!isLoading && data?.results?.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>{t('contents.content_table.empty')}</h1>
          </div>
        ) : null}

        <TablePaginator
          data={data}
          limit={limit}
          refetch={refetch}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>

      {/* Delete Content Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">
            {t('contents.delete_content.header')}
          </h3>
          <hr />
          <p className="mt-2">
            {t('contents.delete_content.message')}
            <br />
            {t('contents.delete_content.warning')}
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            {t('contents.delete_content.cancel')}
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              t('contents.delete_content.delete')
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>

      {/* Update Content Modal */}
      {selectedContentId ? (
        <Modal show={updateShow}>
          <div className="flex">
            <h1 className="font-semibold mb-3">
              {t('contents.update_content.header')}
            </h1>
            <button
              className="ml-auto focus:outline-none"
              onClick={() => {
                setUpdateShow(false);
                setError(null);
                reset();
              }}
            >
              <X size={30} />
            </button>
          </div>
          <hr />

          <form
            className="flex flex-col gap-5 mt-5"
            onSubmit={handleSubmit(handleUpdate)}
          >
            <input
              type="text"
              className="input"
              placeholder={t('contents.update_content.name')}
              required
              {...register('name')}
            />
            <input
              type="text"
              className="input"
              placeholder={t('contents.update_content.description')}
              disabled={isSubmitting}
              {...register('description')}
            />
            <input
              type="file"
              className="input"
              placeholder={t('contents.update_content.image')}
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                t('contents.update_content.save')
              )}
            </button>
            {error ? (
              <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
                {error}
              </div>
            ) : null}
          </form>
        </Modal>
      ) : null}
    </>
  );
}
