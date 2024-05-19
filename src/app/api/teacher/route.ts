import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	var data: {
		name: string;
		sex: string;
		title: string | undefined;
		email: string;
        department_name: string;
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
            sex: z.string(),
            title: z.string().optional(),
            email: z.string(),
            department_name: z.string(),
        }).parse(data);
        const teacher = await prisma.teacher.create({
            data: {
                name: data.name,
                sex: data.sex,
                title: data.title,
                email: data.email,
                department: {
                    connect: {
                        id: await prisma.department.findFirst({
                            where: {
                                name: data.department_name,
                            },
                        }).then(async(res) => res?.id?? await prisma.department.create({
                            data: {
                                name: data.department_name,
                            },
                        }).then((res) => res.id)
                        ),
                    },
                },
            },
        })
        return Response.json({
            msg: "success",
            data: {
                id: teacher.id,
                name: teacher.name,
                title: teacher.title,
                email: teacher.email,
                sex: teacher.sex
            },
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            details: error
        });
    }
}

export async function GET(req: NextRequest) {
    return Response.json({
        msg: "success",
        data: await prisma.teacher.findMany({
            select: {
                id: true,
                name: true,
                title: true,
                email: true,
                department: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy:{
                departmentId: "asc"
            }
        })
    });
}

export async function PUT(req: NextRequest) {
    var data: {
        id: number;
        name: string | undefined
        sex: string | undefined;
        title: string | undefined;
        email: string | undefined;
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
            sex: z.string().optional(),
            title: z.string().optional(),
            email: z.string().optional(),
        }).parse(data);
        const teacher = await prisma.teacher.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                sex: data.sex,
                title: data.title,
                email: data.email,
            },
        });
        return Response.json({
            msg: "success",
            data: {
                id: teacher.id,
                name: teacher.name,
                title: teacher.title,
                email: teacher.email,
            }
        });
    }

    catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            details: error
        });
    }
}