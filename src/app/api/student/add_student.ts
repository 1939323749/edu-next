import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function addStudent(
    req: NextRequest,
){
    var data: {
        name: string,
        sex: string,
        email: string,
        birthday: string,
        enrolled_time: string,
        class_name: string,
        major_name: string,
        department_name: string,
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
            sex: z.string(),
            email: z.string().email(),
            birthday: z.string(),
            enrolled_time: z.string(),
            class_name: z.string(),
            major_name: z.string(),
            department_name: z.string(),
        }).parse(data);
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            details: error,
        });
    }

    const existed_student = await prisma.student.findFirst({
        where: {
            email: data.email,
        },
    });

    if (existed_student) {
        return Response.json({
            msg: "error",
            error: "student already exists",
        });
    }

    const student = await prisma.student.create({
		data: {
			name: data.name,
			sex: data.sex,
			email: data.email,
			birthday: new Date(data.birthday).toISOString(),
			enrolled_time: new Date(data.enrolled_time).toISOString(),
			classId:
				(await prisma.class
					.findFirst({
						where: {
							name: data.class_name,
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.class
					.create({
						data: {
							name: data.class_name,
						},
					})
					.then((data) => data.id)),
			majorId:
				(await prisma.major
					.findFirst({
						where: {
							name: data.major_name,
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.major
					.create({
						data: {
							name: data.major_name,
                            departments: {
                                connect: {
                                    id: await prisma.department.findFirst({
                                        where: {
                                            name: data.department_name,
                                        },
                                        select: {
                                            id: true,
                                        },
                                    }).then((data) => data?.id) ?? await prisma.department.create({
                                        data: {
                                            name: data.department_name,
                                        },
                                    }).then((data) => data.id),
                                }
                            }
						},
					})
					.then((data) => data.id)),
		},
	});

    return Response.json({
        msg: "success",
        data: {
            student_id: student.id,
        },
    });
}