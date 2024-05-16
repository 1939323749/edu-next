import prisma from "@/app/db";

export async function GET(req: Request) {
  return Response.json({
    msg: "success",
    data: await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        class: {
            select: {
                name: true,
            },
        },
      },
    }),
  });
}

export { addStudent as POST } from './add_student'
export { deleteStudent as DELETE } from './delete_sudent'