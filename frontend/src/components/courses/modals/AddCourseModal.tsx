import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CreateCourseRequest from '../../../models/course/CreateCourseRequest';
import Modal from '../../shared/Modal';

export interface AddCourseModalProps {
  children: (props: { onHide: () => void }) => React.ReactNode;
  show: boolean;
  onSubmit: (course: CreateCourseRequest) => void;
  onHide: () => void;
}

export default function AddCourseModal({
  children,
  show,
  onSubmit,
  onHide,
}: AddCourseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<CreateCourseRequest>();
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      onSubmit(createCourseRequest);
      reset();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleClose = () => {
    reset();
    setError(undefined);
    onHide();
  };

  return (
    <Modal show={show}>
      {children({ onHide: handleClose })}
      <form
        className="flex flex-col gap-5 mt-5"
        onSubmit={handleSubmit(saveCourse)}
      >
        <input
          type="text"
          className="input"
          placeholder={t('courses.add_course.header')}
          disabled={isSubmitting}
          required
          {...register('name')}
        />
        <input
          type="text"
          className="input"
          placeholder={t('courses.add_course.description')}
          disabled={isSubmitting}
          required
          {...register('description')}
        />
        <select
          className="input"
          disabled={isSubmitting}
          required
          {...register('language')}
        >
          <option value="en">{t('courses.language_options.en')}</option>
          <option value="es">{t('courses.language_options.es')}</option>
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
  );
}
