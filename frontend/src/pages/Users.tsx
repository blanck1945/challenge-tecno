import { useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import UsersTable from '../components/users/UsersTable';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    ['users', firstName, lastName, username, role, page, limit],
    async () => {
      return await userService.findAll({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        role: role || undefined,
        page: page || undefined,
        limit: limit || undefined,
      });
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(null);
      reset();
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout header={t('users.header')}>
      <button
        className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
        onClick={() => setAddUserShow(true)}
      >
        <Plus /> {t('users.add')}
      </button>

      <div className="table-filter mt-2">
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="flex flex-row gap-5">
            <input
              type="text"
              className="input"
              placeholder={t('users.first_name')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder={t('users.last_name')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div className="flex flex-row gap-5">
              <input
                type="text"
                className="input"
                placeholder={t('users.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <select
            name=""
            id=""
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">{t('users.role_options.all')}</option>
            <option value="user">{t('users.role_options.user')}</option>
            <option value="editor">{t('users.role_options.editor')}</option>
            <option value="admin">{t('users.role_options.admin')}</option>
          </select>
        </div>
      </div>

      <UsersTable
        data={data}
        isLoading={isLoading}
        setPage={setPage}
        refetch={refetch}
        limit={limit}
        setLimit={setLimit}
      />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">{t('users.add_user.header')}</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('users.update_user.first_name')}
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('users.update_user.last_name')}
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            required
            placeholder={t('users.update_user.username')}
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder={t('users.update_user.password')}
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">{t('users.role_options.user')}</option>
            <option value="editor">{t('users.role_options.editor')}</option>
            <option value="admin">{t('users.role_options.admin')}</option>
          </select>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              t('users.save')
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
