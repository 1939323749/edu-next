import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getStudentCourse(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
    try {
        if (!Number(params.id)) {
            return Response.json({
                msg: "error",
                error: "invalid id",
            });
        }
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid id",
        });
    }

    try {
        const department = await prisma.department.findFirst({
            where: {
                majors: {
                    some: {
                        students: {
                            some: {
                                id: Number(params.id),
                            },
                        },
                    },
                },
            }
        });

        if (!department) {
            return Response.json({
                msg: "error",
                error: "department not found",
            });
        }

        const courses = await prisma.course.findMany({
            where: {
                department: {
                    id: department.id,
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                majors: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                time_blocks: {
                    select: {
                        id: true,
                        start: true,
                        end: true,
                        week_start: true,
                        week_end: true,
                    },
                },
            },
        });

        return Response.json({
            msg: "success",
            data: courses,
        });
        
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "server error",
        });
    }
}