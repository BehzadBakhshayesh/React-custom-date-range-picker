import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "./doubleRangePicker.css";

const DoubleRangePicker: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleDayClick = (day: number, month: Dayjs) => {
    const selectedDate = month.date(day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (selectedDate.isBefore(startDate)) {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
  };

  const renderDays = (month: Dayjs) => {
    const daysInMonth = month.daysInMonth();
    const firstDayOfMonth = month.startOf("month").day();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <div key={`empty-${month}-${i}`} className="day empty"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = month.date(day);
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
          onClick={() => handleDayClick(day, month)}
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
    <div>
      <div className="dual-calendar-container">
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>‹</button>
            <span>{currentMonth.format("MMMM YYYY")}</span>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="day-name">
                {day}
              </div>
            ))}
            {renderDays(currentMonth)}
          </div>
        </div>

        <div className="calendar">
          <div className="calendar-header">
            <span>{currentMonth.add(1, "month").format("MMMM YYYY")}</span>
            <button onClick={handleNextMonth}>›</button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="day-name">
                {day}
              </div>
            ))}
            {renderDays(currentMonth.add(1, "month"))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        {startDate && endDate && (
          <p className="range-info">
            Selected Range: {startDate.format("YYYY-MM-DD")} to{" "}
            {endDate.format("YYYY-MM-DD")}
          </p>
        )}
      </div>
    </div>
  );
};

export default DoubleRangePicker;
