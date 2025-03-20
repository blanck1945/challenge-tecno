import { useState } from 'react';
import { Calendar, Plus, RefreshCw } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import CoursesTable from '../components/courses/CoursesTable';
import AddCourseModal from '../components/courses/modals/AddCourseModal';
import Layout from '../components/layout';
import ModalHeader from '../components/modals/ModalHeader';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [language, setLanguage] = useState('');
  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description, sortBy, page, limit, language],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
        sortBy: sortBy || undefined,
        page: page || 1,
        limit: limit || 10,
        language: language || undefined,
      }),
  );

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleSelectChange = (e) => {
    setSortBy(e.target.value);
    refetch();
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setPage(1);
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Layout header={t('courses.header')}>
      <div className="flex gap-2 mb-5 items-center justify-between">
        <div className="flex gap-2">
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={handleRefresh}
          >
            <RefreshCw />
          </button>
          <Link
            to="/calendar"
            className="btn flex gap-2 w-full sm:w-auto justify-center"
          >
            <Calendar />
          </Link>
        </div>
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn  flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> {t('courses.add')}
          </button>
        ) : null}
      </div>

      <div className="table-filter flex items-center justify-between">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('courses.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('courses.description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select className="input" onChange={handleLanguageChange}>
            <option value="" selected disabled hidden>
              {t('courses.language')}
            </option>
            <option value="">{t('courses.language_options.all')}</option>
            <option value="en">{t('courses.language_options.en')}</option>
            <option value="es">{t('courses.language_options.es')}</option>
          </select>
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

      <CoursesTable
        data={data}
        isLoading={isLoading}
        limit={limit}
        refetch={refetch}
        setPage={setPage}
        setLimit={setLimit}
      />

      {/* Add Course Modal */}
      <AddCourseModal
        show={addCourseShow}
        onSubmit={saveCourse}
        onHide={() => setAddCourseShow(false)}
      >
        {(props) => (
          <ModalHeader
            title={t('courses.add_course.header')}
            onHide={props.onHide}
          />
        )}
      </AddCourseModal>
    </Layout>
  );
}
