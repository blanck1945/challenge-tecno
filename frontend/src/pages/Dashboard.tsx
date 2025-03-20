import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import Course from '../models/course/Course';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery('stats', statsService.getStats);
  const { authenticatedUser } = useAuth();

  return (
    <Layout>
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
          <div className="flex flex-col sm:flex-row gap-5">
            {authenticatedUser.role === 'admin' ? (
              <div className="card shadow text-white bg-blue-500 flex-1">
                <h1 className="font-semibold sm:text-4xl text-center mb-3">
                  {data.numberOfUsers}
                </h1>
                <p className="text-center sm:text-lg font-semibold">
                  {t('dashboard.users')}
                </p>
              </div>
            ) : null}
            <div className="card shadow text-white bg-indigo-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfCourses}
              </h1>
              <p className="text-center sm:text-lg font-semibold">
                {t('dashboard.courses')}
              </p>
            </div>
            <div className="card shadow text-white bg-green-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfContents}
              </h1>
              <p className="text-center sm:text-lg font-semibold">
                {t('dashboard.contents')}
              </p>
            </div>
          </div>
        ) : null}

        {data?.latestCourses.length > 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">{t('dashboard.new_courses')}</h2>
            <div className="flex flex-col gap-5">
              {data.latestCourses.map((course: Course) => (
                <div key={course.id} className="card shadow">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{course.name}</h2>
                    <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-sm">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.latestUpdatedCourse.length > 0 && (
          <>
            <hr className="my-5" />
            <h2 className="text-2xl font-bold">
              {t('dashboard.updated_courses')}
            </h2>
            <div className="flex flex-col gap-5">
              {data.latestUpdatedCourse.map((course) => (
                <div key={course.id} className="card shadow">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{course.name}</h2>
                    <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-sm">
                      {new Date(
                        course.createdAt || course.updatedAt,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{course.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
