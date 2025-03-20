import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import { EnrolledStatus } from '../../models/enrolled/Enrolled';
import enrollService from '../../services/EnrollService';
import UserService from '../../services/UserService';
import Modal from '../shared/Modal';

export default function EnrollBtn() {
  const { authenticatedUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [isEnrolled, setIsEnrolled] = useState<EnrolledStatus>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  const { data: enrolledStatus, refetch } = useQuery(
    ['enrolledStatus', authenticatedUser.id, id],
    () => UserService.isUserEnrolled(authenticatedUser.id, id),
    {
      enabled: Boolean(authenticatedUser.id && id),
      onSuccess: (data) => {
        setIsEnrolled(data.enrolled);
      },
    },
  );

  const enroll = async () => {
    try {
      if (isEnrolled === EnrolledStatus.NeverEnrolled) {
        await enrollService.enroll(authenticatedUser.id, id);
        setIsEnrolled(EnrolledStatus.Enrolled);
      } else {
        await enrollService.reenroll(authenticatedUser.id, id);
        setIsEnrolled(EnrolledStatus.Enrolled);
      }
      refetch();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error al inscribirse:', error);
    }
  };

  const unenroll = async () => {
    try {
      await enrollService.unenroll(authenticatedUser.id, id);
      setIsEnrolled(EnrolledStatus.NeverEnrolled);
      refetch();
      setShowUnenrollModal(false);
    } catch (error) {
      console.error('Error al desinscribirse:', error);
    }
  };

  if (enrolledStatus?.enrolled === EnrolledStatus.Enrolled) {
    return (
      <>
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setShowUnenrollModal(true)}
        >
          Unenroll
        </button>

        <Modal show={showUnenrollModal} title="Confirmar desinscripción">
          <p className="mb-4">
            ¿Estás seguro que deseas desinscribirte de este curso?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setShowUnenrollModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={unenroll}>
              Confirmar
            </button>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      <button
        className="btn flex gap-2 w-full sm:w-auto justify-center"
        onClick={() => setShowConfirmModal(true)}
      >
        Enroll
      </button>

      <Modal show={showConfirmModal} title="Confirmar inscripción">
        <p className="mb-4">
          ¿Estás seguro que deseas inscribirte en este curso?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={enroll}>
            Confirmar
          </button>
        </div>
      </Modal>
    </>
  );
}
