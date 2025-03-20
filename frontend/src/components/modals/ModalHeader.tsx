import { X } from 'react-feather';

export interface ModalHeaderProps {
  title: string;
  onHide: () => void;
}

export default function ModalHeader({ title, onHide }: ModalHeaderProps) {
  return (
    <>
      <div className="flex">
        <h1 className="font-semibold mb-3">{title}</h1>
        <button className="ml-auto focus:outline-none" onClick={() => onHide()}>
          <X size={30} />
        </button>
      </div>
      <hr />
    </>
  );
}
