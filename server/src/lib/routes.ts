import { FastifyInstance } from "fastify";
import dayjs from "dayjs";
import { prisma } from "./prisma";
import { z } from "zod";

export async function appRoutes(app: FastifyInstance) {
  //prisma ira retorna uma promessa por isso o async na função e await
  app.post("/habit", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      // [0,1,2,3,4,5,6] => dia da semanas 0 = domingo
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf("day").toDate(); //ele vai zerar a hora da insert

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      //ele vai receber uma informaçao e zod vai converter ela
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query); //aqui ele buscar o tipo da request body, query etc

    //todos os habitos possiveis
    //habitos que já foram completos

    const parseDate = dayjs(date).startOf("day");

    const weekDay = parseDate.get("day");

    console.log(date, weekDay);

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parseDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });

    const completeHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    });

    return { possibleHabits, completeHabits };
  });
}
