import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import { Calendar as ReactCalendar, momentLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import CourseService from '../services/CourseService';

const localizer = momentLocalizer(moment);

export default function Calendar() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(['courses'], () =>
    CourseService.findAll({
      name: undefined,
      description: undefined,
      sortBy: undefined,
      page: 1,
      limit: 100,
      language: undefined,
    }),
  );

  if (isLoading) {
    return <div>{t('calendar.loading')}</div>;
  }

  const convertToDate = (dateString) => {
    return new Date(dateString.replace(' ', 'T'));
  };

  const events = data?.results.map((course) => {
    const startDate = convertToDate(course.createdAt);
    const endDate = new Date(course.createdAt);
    endDate.setHours(23, 59, 59);

    return {
      title: course.name,
      start: startDate,
      end: endDate,
    };
  });

  return (
    <Layout header={t('calendar.header')}>
      <div style={{ height: '100vh' }}>
        <ReactCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    </Layout>
  );
}
