import React from "react";
import UserCalendar from "../../components/UserCalendar/UserCalendar"; // Adjust the import path as necessary


const UserCalendarPage: React.FC = () => {
  return (
    <div>
      <div className="mx-auto p-1">
        <div className="flex flex-col w-full">
          <h1 className="text-[40px] font-bold mb-2">User Calendar</h1>
          <UserCalendar/>
        </div>
      </div>
    </div>
  );
};

export default UserCalendarPage;
