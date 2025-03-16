import { useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description, sortBy, page],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
        sortBy: sortBy || undefined,
        page: page || 1,
        limit: limit || 10,
      }),
    // {
    //   refetchInterval: 1000,
    // },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleSelectChange = (e) => {
    console.log(e.target.value);
    setSortBy(e.target.value);
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Layout header="Manage Courses">
      <div className="flex gap-2 mb-5">
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn  flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> Add Course
          </button>
        ) : null}
        <button
          className="btn  flex gap-2 w-full sm:w-auto justify-center "
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      <div className="table-filter flex items-center justify-between">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div>
            <select className="input" onChange={handleSelectChange}>
              <option value="" disabled hidden selected>
                Sort
              </option>
              <option value="name:asc">A-Z</option>
              <option value="name:desc">Z-A</option>
              <option value="dateCreated:desc">Newest</option>
              <option value="dateCreated:asc">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <CoursesTable
        data={data}
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
      />

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
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
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
