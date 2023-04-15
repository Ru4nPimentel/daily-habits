import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { ProgressBar } from "./ProgressBar";
import { Check } from "phosphor-react";
import dayjs from "dayjs";

interface HabitDayProps {
  date: Date;
  completed?: number;
  amount?: number;
}

function HabitDay({ completed = 0, amount = 0, date }: HabitDayProps) {
  const completedPorcentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMounth = dayjs(date).format("DD/MM"); // formata do dia
  const dayOfWeek = dayjs(date).format("dddd"); // Dia da semana

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx("w-10 h-10  rounded-lg", {
          "bg-zinc-900 border border-zinc-800": completedPorcentage === 0,
          "bg-violet-900 border-violet-700":
            completedPorcentage > 0 && completedPorcentage < 20,
          "bg-violet-800 border-violet-600":
            completedPorcentage >= 20 && completedPorcentage < 40,
          "bg-violet-700 border-violet-500":
            completedPorcentage >= 40 && completedPorcentage < 60,
          "bg-violet-600 border-violet-500":
            completedPorcentage >= 60 && completedPorcentage < 80,
          "bg-violet-500 border-violet-400": completedPorcentage >= 80,
        })}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] w-full p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMounth}
          </span>

          <ProgressBar progress={completedPorcentage} />

          <div className="mt-6 flex flex-col gap-3">
            <Checkbox.Root className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                BEBER 2 litros
              </span>
            </Checkbox.Root>
          </div>

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default HabitDay;
