import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Paginator } from '../../models/core/Paginator';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import User from '../../models/user/User';
import userService from '../../services/UserService';
import TablePaginator from '../core/TablePaginator';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface UsersTableProps {
  data: Paginator<User>;
  isLoading: boolean;
  setPage: (page: number) => void;
  refetch: () => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export default function UsersTable({
  data,
  isLoading,
  setPage,
  refetch,
  limit,
  setLimit,
}: UsersTableProps) {
  const { t } = useTranslation();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await userService.delete(selectedUserId);
      setDeleteShow(false);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await userService.update(selectedUserId, updateUserRequest);
      setUpdateShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    refetch();
  };

  return (
    <>
      <div className="table-container">
        <Table
          columns={[
            t('users.users_table.name'),
            t('users.username'),
            t('users.users_table.status'),
            t('users.role'),
          ]}
        >
          {isLoading
            ? null
            : data.results.map(
                ({ id, firstName, lastName, role, isActive, username }) => (
                  <tr key={id}>
                    <TableItem>{`${firstName} ${lastName}`}</TableItem>
                    <TableItem>{username}</TableItem>
                    <TableItem>
                      {isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {t('users.users_table.status_active')}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {t('users.users_table.status_inactive')}
                        </span>
                      )}
                    </TableItem>
                    <TableItem>{role}</TableItem>
                    <TableItem className="text-right">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);

                          setValue('firstName', firstName);
                          setValue('lastName', lastName);
                          setValue('username', username);
                          setValue('role', role);
                          setValue('isActive', isActive);

                          setUpdateShow(true);
                        }}
                      >
                        {t('users.users_table.edit')}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);
                          setDeleteShow(true);
                        }}
                      >
                        {t('users.users_table.delete')}
                      </button>
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>

        {!isLoading && data.results.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>{t('users.empty')}</h1>
          </div>
        ) : null}

        <TablePaginator
          data={data}
          setPage={handlePageChange}
          limit={limit}
          setLimit={setLimit}
          refetch={refetch}
        />
      </div>
      {/* Delete User Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">
            {t('users.delete_user.header')}
          </h3>
          <hr />
          <p className="mt-2">
            {t('users.delete_user.message')}
            <br />
            {t('users.delete_user.warning')}
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
            {t('users.delete_user.cancel')}
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              t('users.delete_user.delete')
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>
      {/* Update User Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">
            {t('users.update_user.header')}
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
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('users.update_user.first_name')}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('users.update_user.last_name')}
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            placeholder={t('users.update_user.username')}
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            placeholder={t('users.update_user.password')}
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">{t('users.role_options.user')}</option>
            <option value="editor">{t('users.role_options.editor')}</option>
            <option value="admin">{t('users.role_options.admin')}</option>
          </select>
          <div>
            <label className="font-semibold mr-3">
              {t('users.update_user.active')}
            </label>
            <input
              type="checkbox"
              className="input w-5 h-5"
              {...register('isActive')}
            />
          </div>
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
    </>
  );
}
