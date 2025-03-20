import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import emailService from '../services/emailService';

export default function Contact() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await emailService.sendEmail(data.email, data.name, data.message);
      setUserName(data.name);
      setShowModal(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserName('');
  };

  return (
    <Layout header={t('contact.header')}>
      <Modal show={showModal}>
        <h3 className="text-lg font-semibold mb-2">
          {t('contact.modal.thank_you', { name: userName })}
        </h3>
        <p className="mb-4">{t('contact.modal.success_message')}</p>
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 bg-[#c1292e] text-white rounded hover:bg-[#a12124]"
        >
          {t('contact.modal.close')}
        </button>
      </Modal>

      <form
        className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="flex flex-col">
          <label className="text-gray-700">{t('contact.name')}</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md"
            placeholder={t('contact.name')}
            {...register('name')}
          />
        </label>
        <label className="flex flex-col">
          <label className="text-gray-700">{t('contact.email')}</label>
          <input
            type="email"
            className="mt-1 p-2 border rounded-md"
            placeholder={t('contact.email')}
            {...register('email')}
          />
        </label>
        <label className="flex flex-col">
          <label className="text-gray-700">{t('contact.message')}</label>
          <textarea
            className="mt-1 p-2 border rounded-md"
            placeholder={t('contact.message')}
            {...register('message')}
          ></textarea>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 p-2 text-white rounded-md bg-[#E63946] hover:bg-[#B31B1B] transition-colors disabled:opacity-70 flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            t('contact.send')
          )}
        </button>
      </form>
    </Layout>
  );
}
