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
						locations: {
							select: {
								id: true,
								name: true,
								address: true,
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