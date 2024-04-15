import prisma from "@/app/db";
import exp from "constants";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	var data: {
		student_id: number;
		course_id: number;
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
		z.object({
			student_id: z.number(),
			course_id: z.number(),
		}).parse(data);

        const course = await prisma.course.findFirstOrThrow({
            where: {
                id: data.course_id
            },
            select: {
                students: {
                    where: {
                        id: data.student_id
                    }
                }
            }
        })

        if(course && course.students.find((student) => student.id === data.student_id) != undefined){
            return Response.json({
                msg: "error",
                error: "course already added, please check again",
            });
        }

		await prisma.student.update({
			where: {
				id: data.student_id,
			},
			data: {
				courses: {
					connect: {
						id: data.course_id,
					},
				},
			},
		});

		return Response.json({
			msg: "success",
			couses: await prisma.student.findUnique({
				where: {
					id: data.student_id,
				},
				select: {
					id: true,
                    name: true,
					courses: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}),
		});
	} catch (error: any) {
		return Response.json({
			msg: "error",
			error: "invalid data",
            errors: error
		});
	}
}

export async function DELETE(req: NextRequest) {
    var data: {
        student_id: number;
        course_id: number;
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
        z.object({
            student_id: z.number(),
            course_id: z.number(),
        }).parse(data);

        const student = await prisma.student.update({
            where: {
                id: data.student_id,
            },
            data: {
                courses: {
                    disconnect: {
                        id: data.course_id,
                    },
                },
            },
        });

        return Response.json({
            msg: "success",
            data: "course removed",
            courses: await prisma.student.findUnique({
                where: {
                    id: data.student_id,
                },
                select: {
                    id: true,
                    name: true,
                    courses: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }
}
