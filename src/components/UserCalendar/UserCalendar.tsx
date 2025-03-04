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
  <div className="event-container">
    <div className="event-time">
      {moment(event.start).format("h:mm A")} -{" "}
      {moment(event.end).format("h:mm A")}
    </div>
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
          pageSize: 10,
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
    <div className="relative p-4 bg-none h-screen overflow-y-auto">
      <div className="h-full bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4"></div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={["week", "day", "month"]}
          date={date}
          onNavigate={setDate}
          className="h-full"
          components={{ event: EventComponent }}
        />
      </div>
    </div>
  );
};

export default UserCalendar;
