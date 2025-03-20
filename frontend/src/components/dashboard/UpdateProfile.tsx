import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';

export default function UpdateProfile() {
  const { t } = useTranslation();
  const { authenticatedUser } = useAuth();
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    `user-${authenticatedUser.id}`,
    () => userService.findOne(authenticatedUser.id),
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      if (updateUserRequest.username === data.username) {
        delete updateUserRequest.username;
      }
      await userService.update(authenticatedUser.id, updateUserRequest);
      setError(null);
      setValue('password', '');
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  if (!isLoading) {
    return (
      <div className="card shadow">
        <form
          className="flex mt-3 flex-col gap-3 justify-center md:w-1/2 lg:w-1/3 mx-auto items-center"
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <h1 className="font-semibold text-4xl mb-10">
            {t('profile.header')}
          </h1>
          <hr />
          <div className="flex gap-3 w-full">
            <div className="w-1/2">
              <label className="font-semibold">{t('profile.name')}</label>
              <input
                type="text"
                className="input w-full mt-1"
                defaultValue={data.firstName}
                disabled={isSubmitting}
                placeholder={t('profile.name')}
                {...register('firstName')}
              />
            </div>
            <div className="w-1/2">
              <label className="font-semibold">{t('profile.last_name')}</label>
              <input
                type="text"
                className="input w-full mt-1"
                defaultValue={data.lastName}
                disabled={isSubmitting}
                placeholder={t('profile.last_name')}
                {...register('lastName')}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="font-semibold">{t('profile.username')}</label>
            <input
              type="text"
              className="input w-full mt-1"
              defaultValue={data.username}
              disabled={isSubmitting}
              placeholder={t('profile.username')}
              {...register('username')}
            />
          </div>
          <div className="w-full">
            <label className="font-semibold">{t('profile.role')}</label>
            <input
              type="text"
              className="input w-full mt-1"
              defaultValue={authenticatedUser.role}
              disabled
              placeholder={t('profile.role')}
            />
          </div>
          <div className="w-full">
            <label className="font-semibold">{t('profile.password')}</label>
            <input
              type="password"
              className="input w-full mt-1"
              placeholder={`${t('profile.password')} (min 6 characters)`}
              disabled={isSubmitting}
              {...register('password')}
            />
          </div>
          <button className="btn w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              t('profile.update')
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    );
  }

  return null;
}
