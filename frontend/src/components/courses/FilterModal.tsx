import { X } from 'react-feather';
import { useForm } from 'react-hook-form';

import Modal from '../shared/Modal';

export default function FilterModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal show={show}>
      <div className="flex">
        <h1 className="font-semibold mb-3">Filter Courses</h1>
        <button
          className="ml-auto focus:outline-none"
          onClick={() => {
            reset();
            onHide();
          }}
        >
          <X size={30} />
        </button>
      </div>
      <hr />
      <form
        className="flex flex-col gap-5 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="block mb-2">Language</label>
          <select className="input" {...register('language')}>
            <option value="" selected hidden>
              Select Language
            </option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Score</label>
          <input
            type="number"
            className="input"
            placeholder="Score"
            {...register('score')}
          />
        </div>
        <div>
          <label className="block mb-2">Certified</label>
          <select className="input" {...register('certified')}>
            <option value="" selected hidden>
              Select Certification
            </option>
            <option value="true">Certified</option>
            <option value="false">Not Certified</option>
          </select>
        </div>
        <button type="submit" className="btn mt-4">
          Apply Filters
        </button>
      </form>
    </Modal>
  );
}
