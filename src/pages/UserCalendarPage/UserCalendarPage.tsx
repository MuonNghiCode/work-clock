import React from "react";
import UserCalendar from "../../components/UserCalendar/UserCalendar"; // Adjust the import path as necessary


const UserCalendarPage: React.FC = () => {
  return (
    <div>
      <div className="w-full flex justify-center">
        <div className="flex flex-col w-11/12">
          <h1 className="text-5xl !py-9">User Calendar</h1>
          <UserCalendar/>
        </div>
      </div>
    </div>
  );
};

export default UserCalendarPage;
