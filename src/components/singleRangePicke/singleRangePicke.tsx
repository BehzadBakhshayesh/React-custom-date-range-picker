import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "./singleRangePicke.css"; // Custom CSS for styling

const SingleRangePicke: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf("month").day(); // 0 = Sunday, 1 = Monday, ...

  const handleDayClick = (day: number) => {
    const selectedDate = currentMonth.date(day);
    if (!startDate || (startDate && endDate)) {
      // Set start date if not set, or reset if both dates are already set
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (selectedDate.isBefore(startDate)) {
      // If the selected date is before the start date, reset the start date
      setStartDate(selectedDate);
    } else {
      // Set the end date if it’s after the start date
      setEndDate(selectedDate);
    }
  };

  const renderDays = () => {
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentMonth.date(day);
      const isSelected =
        (startDate && date.isSame(startDate, "day")) ||
        (endDate && date.isSame(endDate, "day"));
      const isInRange =
        startDate &&
        endDate &&
        date.isAfter(startDate) &&
        date.isBefore(endDate);

      daysArray.push(
        <div
          key={day}
          className={`day ${isSelected ? "selected" : ""} ${
            isInRange ? "in-range" : ""
          }`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }
    return daysArray;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>‹</button>
        <span>{currentMonth.format("MMMM YYYY")}</span>
        <button onClick={handleNextMonth}>›</button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
      {startDate && endDate && (
        <p>
          Selected Range: {startDate.format("YYYY-MM-DD")} to{" "}
          {endDate.format("YYYY-MM-DD")}
        </p>
      )}
    </div>
  );
};

export default SingleRangePicke;
