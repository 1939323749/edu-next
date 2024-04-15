import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	var data: {
		week: number;
		day_of_week: number;
		start: number;
		end: number;
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
			week: z.number(),
			day_of_week: z.number(),
			start: z.number(),
			end: z.number(),
		}).parse(data);

		const courses = await prisma.course.findMany({
			where: {
				time_blocks: {
					some: {
						AND: {
							week_start: {
								lte: data.week,
							},
							week_end: {
								gte: data.week,
							},
							day_of_week: data.day_of_week,
							start: {
								lte: data.start,
							},
							end: {
								gte: data.end,
							},
						},
					},
				},
			},
			include: {
                time_blocks: true,
                locations: true,
            },
		});

        const available = await prisma.location.findMany({
            where: {
                NOT: {
                    courses: {
                        some: {
                            id: {
                                in: courses.map((course) => course.id),
                            },
                        },
                    },
                },
            },
        });
		return Response.json({
			msg: "success",
			data: available.map((location) => {
                return {
                    name: location.name,
                    address: location.address,
                }
            })
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "invalid data",
		});
	}
}
