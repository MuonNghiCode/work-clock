import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";


const localizer = momentLocalizer(moment);

const dummyEvents = [
  {
    title: "project T0",
    start: new Date(2025, 1, 16, 10, 0),
    end: new Date(2025, 1, 16, 13, 0),
  },
  {
    title: "project A",
    start: new Date(2025, 1, 17, 10, 0),
    end: new Date(2025, 1, 17, 18, 0),
  },
  {
    title: "project B",
    start: new Date(2025, 1, 18, 12, 0),
    end: new Date(2025, 1, 18, 15, 0),
  },
  {
    title: "project D",
    start: new Date(2025, 1, 18, 15, 0),
    end: new Date(2025, 1, 18, 20, 0),
  },
  {
    title: "project C",
    start: new Date(2025, 1, 19, 9, 0),
    end: new Date(2025, 1, 19, 17, 0),
  },
  {
    title: "project E",
    start: new Date(2025, 1, 20, 8, 0),
    end: new Date(2025, 1, 20, 16, 0),
  },
  {
    title: "project F",
    start: new Date(2025, 1, 21, 16, 0),
    end: new Date(2025, 1, 21, 20, 0),
  },
  {
    title: "project G",
    start: new Date(2025, 1, 21, 16, 0),
    end: new Date(2025, 1, 21, 22, 0),
  },
  {
    title: "project H",
    start: new Date(2025, 1, 22, 9, 0),
    end: new Date(2025, 1, 22, 17, 0),
  },
  {
    title: "project J",
    start: new Date(2025, 1, 22, 18, 0),
    end: new Date(2025, 1, 22, 22, 0),
  },
];

const UserCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(moment().toDate());

  return (
    <div className="relative p-4 bg-none h-screen overflow-y-auto">
      <div className="h-full bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4"></div>
        <Calendar
          localizer={localizer}
          events={dummyEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={["week", "day", "month"]}
          date={date}
          onNavigate={setDate}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default UserCalendar;

