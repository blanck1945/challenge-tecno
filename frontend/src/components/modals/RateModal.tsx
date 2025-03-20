import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';

import Modal from '../shared/Modal';

interface RateModalProps {
  children: (props: { onHide: () => void }) => React.ReactNode;
  show: boolean;
  onSubmit: (rating: number, message: string) => void;
  onHide: () => void;
}

interface RateCourseRequest {
  rating: number;
  message: string;
}

export default function RateModal({
  children,
  show,
  onSubmit,
  onHide,
}: RateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<RateCourseRequest>();
  const [error, setError] = useState<string>();

  const saveCourse = async (rateCourseRequest: RateCourseRequest) => {
    try {
      onSubmit(+rateCourseRequest.rating, rateCourseRequest.message);
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
      <>
        {children({ onHide: handleClose })}
        <form
          className="flex flex-col gap-3 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <div>
            <label className="font-semibold">Calificación</label>
            <select
              className="input w-full mt-1"
              {...register('rating')}
              required
            >
              <option value="" disabled hidden selected>
                Selecciona una calificación
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Mensaje</label>
            <textarea
              className="input w-full mt-1"
              rows={4}
              placeholder="Deja tu mensaje aquí"
              {...register('message')}
              required
            ></textarea>
          </div>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Enviar'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </>
    </Modal>
  );
}
