import { useQuery } from 'react-query';

import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import statsService from '../services/StatsService';
import UserService from '../services/UserService';

export default function Dashboard() {
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
                <p className="text-center sm:text-lg font-semibold">Users</p>
              </div>
            ) : null}
            <div className="card shadow text-white bg-indigo-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfCourses}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Courses</p>
            </div>
            <div className="card shadow text-white bg-green-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfContents}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Contents</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Latest Courses</h2>
          <div className="flex flex-col gap-5">
            {data?.latestCourses.map((course) => (
              <div key={course.id} className="card shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-sm">
                    {new Date(course.dateCreated).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>

          <hr className="my-5" />
          <h2 className="text-2xl font-bold">Latest Updated Course</h2>
          <div className="flex flex-col gap-5">
            {data?.latestUpdatedCourse.map((course) => (
              <div key={course.id} className="card shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-sm">
                    {new Date(
                      course.dateUpdated || course.dateCreated,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
