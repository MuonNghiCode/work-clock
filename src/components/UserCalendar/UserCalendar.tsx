import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getUserClaimsData } from "../../services/claimService";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

const EventComponent = ({ event }: { event: CalendarEvent }) => (
  <div className="rbc-events-container">
    <div className="event-time font-semibold">
      {moment(event.start).format("h:mm A")} -{" "}
      {moment(event.end).format("h:mm A")}
    </div>
    <div className="event-content font-medium text-gray-900">{event.title}</div>
  </div>
);

const UserCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(moment().toDate());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchClaimsData = async () => {
      const request = {
        searchCondition: {
          keyword: "",
          claim_status: "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 1000000,
        },
      };
      const response = await getUserClaimsData(request);
      const formattedEvents = response.data.pageData.map((claim) => ({
        title: claim.claim_name,
        start: new Date(claim.claim_start_date),
        end: new Date(claim.claim_end_date),
      }));
      setEvents(formattedEvents);
    };

    fetchClaimsData();
  }, []);

  return (
    <div className="relative h-screen overflow-y-auto">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={["month", "week", "day"]}
        date={date}
        onNavigate={setDate}
        className="h-[75vh] border border-gray-400 rounded-xl bg-white p-4 shadow-md"
        components={{ event: EventComponent }}
      />
    </div>
  );
};

export default UserCalendar;
