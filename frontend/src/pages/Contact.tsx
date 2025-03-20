import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Layout from '../components/layout';
import emailService from '../services/emailService';

export default function Contact() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await emailService.sendEmail(data.email, data.name, data.message);
    reset();
  };

  return (
    <Layout header={t('contact.header')}>
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
          className="mt-4 p-2 bg-blue-500 text-white rounded-md bg-[#c1292e] hover:bg-[#a12124] transition-colors"
        >
          {t('contact.send')}
        </button>
      </form>
    </Layout>
  );
}
