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

  app.patch("/habits/:id/toggle", async (request) => {
    //use :id route param => parametro de indentificaçao
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        },
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    });

    if (dayHabit) {
      //remover a marcaçao de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      });
    } else {
      //Completar o habito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      });
    }
  });

  app.get("/summary", async () => {
    //primas ORM: RAW SQL => SQLite

    const summary = await prisma.$queryRaw`
    SELECT
    D.id,
    D.date,
    cast (count(D.id) as float) as completed,
    (
      SELECT
        cast(count(*) as float)
      FROM habit_week_days as HWD
      JOIN  habit H
        ON H.id = HWD.habit_id
      WHERE HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
      AND H.created_at <= D.date
    ) as amount
    FROM days as D
    INNER JOIN day_habits as DH
      ON D.id = DH.day_id
    WHERE DH.day_id = D.id group by D.id
    `;

    /*const summary = await prisma.$queryRaw`
    SELECT
    D.id,
    D.date,
    (
      SELECT
        cast(count(*) as float)
      FROM day_habits as DH
      WHERE DH.day_id = D.id
    ) as campleted,
    (
      SELECT
        cast(count(*) as float)
      FROM habit_week_days as HWD
      JOIN  habit H
        ON H.id = HWD.habit_id
      WHERE HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int) AND H.created_at <= D.date
    ) as amount
    FROM days as D
    `;*/

    return summary;
  });
}
