import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	if (!Number(params.id)) {
		return Response.json({
			msg: "error",
			error: "invalid id",
		});
	}
	try {
		const student = await prisma.student.findUniqueOrThrow({
			where: {
				id: Number(params.id),
			},
			select: {
				id: true,
				name: true,
				sex: true,
				email: true,
                class: {
                    select: {
                        id: true,
                        name: true,
                        courses: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    }
                },
				courses: {
					select: {
                        id: true,
						name: true,
					},
				},
			},
		});
		return Response.json({
			msg: "success",
			data: {
                id: student.id,
                name: student.name,
                calss_name: student.class.name,
                courses: {
                    class_courses: student.class.courses,
                    optional_courses: student.courses,
                },
                selected_courses: student.courses,
            },
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "student not found",
		});
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	var data: {
		name: string;
		sex: string;
		email: string;
		class_name: string;
	};
	try {
		data = await request.json();
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "invalid json format",
		});
	}
	try {
		z.object({
			name: z.string(),
			sex: z.string(),
			email: z.string(),
		}).parse(data);
		const student = await prisma.student.update({
			where: {
				id: Number(params.id),
			},
			data: {
				name: data.name,
				sex: data.sex,
				email: data.email,
				classId:
					(await prisma.class
						.findFirst({
							where: {
								name: data.class_name,
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
			},
		});
		return Response.json({
			msg: "success",
			data: {
				id: student.id,
				name: student.name,
				sex: student.sex,
				email: student.email,
				class: {
					id: student.classId,
					name: data.class_name,
				},
			},
			updatedAt: student.updatedAt,
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "error updating student",
			details: error,
		});
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	if (!Number(params.id)) {
		return Response.json({
			msg: "error",
			error: "invalid id",
		});
	}
	try {
		await prisma.student.delete({
			where: {
				id: Number(params.id),
			},
		});
		return Response.json({
			msg: "success",
			data: "student deleted",
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "student not found",
		});
	}
}
