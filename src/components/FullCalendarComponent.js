// components/FullCalendarComponent.js
import { useEffect } from 'react';
import Head from 'next/head';

const FullCalendarComponent = () => {
  useEffect(() => {
    // Make sure the script is loaded
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const calendarEl = document.getElementById('calendar');
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
      });
      calendar.render();
    };

    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.min.css"
        />
      </Head>
      <div id="calendar"></div>
    </>
  );
};

export default FullCalendarComponent;
