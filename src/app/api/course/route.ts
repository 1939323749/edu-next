import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
    return Response.json({
		msg: "success",
		data: await prisma.course.findMany({
            select: {   
                name: true,
                description: true,
                students: {
                    select: {
                        name: true,
                    }
                },
                teachers: {
                    select: {
                        name: true,
                    }
                },
                classes: {
                    select: {
                        name: true,
                        students: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
            }
        }),
	});
}

export async function POST(req: NextRequest) {
	var data: {
		name: string;
		description: string | undefined;
        credit: number | undefined;
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
			name: z.string(),
			description: z.string().optional(),
		}).parse(data);
		const course = await prisma.course.create({
			data: {
				name: data.name,
				description: data.description,
                credit: data.credit,
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
            },
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "invalid data",
		});
	}
}

export async function PUT(req: NextRequest) {
    var data: {
        id: number;
        name: string | undefined;
        description: string | undefined;
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
            id: z.number(),
            name: z.string().optional(),
            description: z.string().optional(),
        }).parse(data);
        await prisma.course.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                description: data.description,
            },
        });
        return Response.json({
            msg: "success",
            data: "course updated",
            updated_at: await prisma.course.findUnique({
                where: {
                    id: data.id,
                },
                select: {
                    updatedAt: true,
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

