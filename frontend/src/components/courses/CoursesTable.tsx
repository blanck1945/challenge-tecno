import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import { Paginator } from '../../models/core/Paginator';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import EnrollService from '../../services/EnrollService';
import TablePaginator from '../core/TablePaginator';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface UsersTableProps {
  data: Paginator<Course>;
  isLoading: boolean;
  limit: number;
  refetch: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export default function CoursesTable({
  data,
  isLoading,
  limit,
  refetch,
  setPage,
  setLimit,
}: UsersTableProps) {
  const { t } = useTranslation();
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const { data: userEnrolledCourses } = useQuery(
    ['userEnrolledCourses'],
    () => EnrollService.findAllEnrolledCoursesByUserId(authenticatedUser.id),
    {
      enabled: authenticatedUser.role === 'user',
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourseId);
      setDeleteShow(false);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await courseService.update(selectedCourseId, updateCourseRequest);
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
            t('courses.course_table.name'),
            t('courses.course_table.description'),
            t('courses.course_table.language'),
            t('courses.course_table.created'),
          ]}
        >
          {isLoading
            ? null
            : data.results.map(
                ({ id, name, description, createdAt, language }) => {
                  let isEnrolled = false;
                  if (authenticatedUser.role === 'user') {
                    isEnrolled = userEnrolledCourses.includes(id);
                  }
                  return (
                    <tr key={id} className={isEnrolled ? 'bg-green-100' : ''}>
                      <TableItem>
                        <Link to={`/courses/${id}`}>
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Link>
                      </TableItem>
                      <TableItem>
                        {description.charAt(0).toUpperCase() +
                          description.slice(1)}
                      </TableItem>
                      <TableItem>{language}</TableItem>
                      <TableItem>
                        {new Date(createdAt).toLocaleDateString()}
                      </TableItem>
                      <TableItem className="text-right">
                        {isEnrolled && (
                          <span className="badge bg-green-500 text-white mr-2 px-2 py-1 rounded-md">
                            {t('courses.course_table.user_enrolled')}
                          </span>
                        )}
                        {['admin', 'editor'].includes(
                          authenticatedUser.role,
                        ) ? (
                          <button
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                            onClick={() => {
                              setSelectedCourseId(id);

                              setValue('name', name);
                              setValue('description', description);
                              setValue('language', language);
                              setUpdateShow(true);
                            }}
                          >
                            {t('courses.course_table.edit')}
                          </button>
                        ) : null}
                        {authenticatedUser.role === 'admin' ? (
                          <button
                            className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                            onClick={() => {
                              setSelectedCourseId(id);
                              setDeleteShow(true);
                            }}
                          >
                            {t('courses.course_table.delete')}
                          </button>
                        ) : null}
                      </TableItem>
                    </tr>
                  );
                },
              )}
        </Table>

        {!isLoading && data.results.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>{t('courses.course_table.empty')}</h1>
          </div>
        ) : null}

        {/* Paginator */}
        <TablePaginator
          data={data}
          limit={limit}
          setLimit={setLimit}
          setPage={setPage}
          refetch={refetch}
        />
      </div>

      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">
            {t('courses.delete_course.header')}
          </h3>
          <hr />
          <p className="mt-2">
            {t('courses.delete_course.message')}
            <br />
            {t('courses.delete_course.warning')}
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
            {t('courses.delete_course.cancel')}
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              t('courses.delete_course.delete')
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>
      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">
            {t('courses.update_course.header')}
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
            placeholder={t('courses.name')}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder={t('courses.description')}
            required
            disabled={isSubmitting}
            {...register('description')}
          />
          <select className="input" {...register('language')}>
            <option value="" selected disabled hidden>
              {t('courses.language')}
            </option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              t('courses.save')
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
