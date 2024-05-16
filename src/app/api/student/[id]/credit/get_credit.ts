import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!Number(params.id)) {
        return Response.json({
            msg: "error",
            error: "invalid id",
        });
    }
    try {
        try {
            await prisma.student.findUniqueOrThrow({
                where: {
                    id: Number(params.id),
                },
            });
        } catch (error) {
            return Response.json({
                msg: "error",
                error: "student not found",
            });
        }

        const student_courses = await prisma.course.findMany({
            where: {
                students: {
                    some: {
                        id: Number(params.id),
                    },
                },
            },
            select: {
                id: true,
                name: true,
                credit: true,
            },
        });

        const student_scores = await prisma.score.findMany({
            where: {
                studentId: Number(params.id),
            },
            select: {
                id: true,
                score: true,
                exam: {
                    select: {
                        course: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        return Response.json({
            msg: "success",
            data: {
                student_courses: student_courses,
                student_scores: student_scores,
                earned_credits: student_scores.reduce((acc, score) => {
                    const course = student_courses.find((course) => score.exam.course.find((_course) => _course.id === course.id));
                    return acc + (score.score >= 60 ? course?.credit??0 : 0);
                }, 0),
                total_credits: student_courses.reduce((acc, course) => acc + course.credit, 0),
            },
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid id",
            details: error,
        });
    }
}