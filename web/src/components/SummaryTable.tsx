import React, { useEffect, useState } from "react";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import HabitDay from "./HabitDay";
import { api } from "../lib/axios";
import dayjs from "dayjs";

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

function SummaryTable() {
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const [summary, setSummary] = useState<Summary>([]);

  const summaryDates = generateDatesFromYearBeginning();
  const minimumSummryDatesSize = 18 * 7;
  const amountOfDaysToFill = minimumSummryDatesSize - summaryDates.length;

  useEffect(() => {
    api.get("/summary").then((response) => {
      setSummary(response.data);
    });
  }, []);

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
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            );
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
