import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function addCourse(
    req: NextRequest,
) {
    var data: {
        name: string,
        description: string | undefined,
        credit: number,
        department: string,
    }

    try {
        data = await req.json()
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }

    try {
        z.object({
            name: z.string(),
            description: z.string().optional(),
            credit: z.number(),
            department: z.string(),
        }).parse(data);

        const existed_course = await prisma.course.findFirst({
            where: {
                name: data.name,
                department: {
                    name: data.department,
                },
            },
        });

        if (existed_course) {
            return Response.json({
                msg: "error",
                error: "course already exists",
            });
        }

        const course = await prisma.course.create({
            data: {
                name: data.name,
                description: data.description,
                credit: data.credit,
                department: {
                    connect: {
                        id: await prisma.department.findFirst({
                            where: {
                                name: data.department,
                            },
                        }).then(async (res) => res?.id?? await prisma.department.create({
                            data: {
                                name: data.department,
                            },
                        }).then((res) => res.id)
                        ),
                    },
                }
            },
        });

        return Response.json({
            msg: "success",
            data: "course created",
            course: {
                id: course.id,
                name: course.name,
                description: course.description,
                credit: course.credit,
                department_name: data.department,
            },
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "something went wrong",
        });
    }
}