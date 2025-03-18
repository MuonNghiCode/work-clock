import React from "react";
import UserCalendar from "../../components/UserCalendar/UserCalendar"; // Adjust the import path as necessary

const UserCalendarPage: React.FC = () => {
  return (
    <div>
      <div className="mx-auto p-1">
        <div className="flex flex-col w-full">
          <UserCalendar />
        </div>
      </div>
    </div>
  );
};

export default UserCalendarPage;
