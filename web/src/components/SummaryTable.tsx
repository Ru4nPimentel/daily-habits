import React from "react";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import HabitDay from "./HabitDay";

function SummaryTable() {
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const summaryDates = generateDatesFromYearBeginning();
  const minimumSummryDatesSize = 18 * 7;
  const amountOfDaysToFill = minimumSummryDatesSize - summaryDates.length;

  return (
    <div className="w-full flex ">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => {
          return (
            <div
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((date) => {
          return <HabitDay key={date.toString()} />;
        })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_i, index) => {
            return (
              <div
                className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                key={index}
              />
            );
          })}
      </div>
    </div>
  );
}

export default SummaryTable;
