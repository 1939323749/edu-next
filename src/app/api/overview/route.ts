import prisma from "@/app/db";

export async function GET(req: Request) {
    return Response.json({
        msg: "success",
        data: {
            students_count: await prisma.student.count(),
            teachers_count: await prisma.teacher.count(),
            courses_count: await prisma.course.count(),
            classes_count: await prisma.class.count(),
            locations_count: await prisma.location.count(),
            time_blocks_count: await prisma.timeBlock.count(),
        },
    });
}