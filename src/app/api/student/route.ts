import prisma from "@/app/db";

export async function GET(req: Request) {
  return Response.json({
    msg: "success",
    data: await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        courses: {
          select: {
            name: true,
          },
        },
        class: {
            select: {
                name: true,
            },
        },
      },
    }),
  });
}

export async function POST(req: Request) {
    var data: {
        name: string;
        sex: string;
        email: string;
        birthday: string;
        enrolled_time: string;
        class_name: string;
    };
    try {
        data = await req.json();
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid json format",
        });
    }
    try {
        const student = await prisma.student.create({
            data: {
                name: data.name,
                sex: data.sex,
                email: data.email,
                birthday: new Date(data.birthday).toISOString(),
                enrolled_time: new Date(data.enrolled_time).toISOString(),
                classId: await prisma.class.findFirst({
                    where: {
                        name: data.class_name
                    },
                    select: {
                        id: true
                    }
                }).then((data)=>data?.id) ?? await prisma.class.create({
                    data: {
                        name: data.class_name
                    }
                }).then((data)=>data.id),
            },
        });

        return Response.json({
            msg: "success",
            student: {
                id: student.id,
                name: student.name,
                sex: student.sex,
                email: student.email,
                class: student.classId,
            }
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            detail: error,
            data: data,
        });
    }
}
