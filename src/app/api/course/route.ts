import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
    return Response.json({
		msg: "success",
		data: await prisma.course.findMany({
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
            }
        }),
	});
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

        try {
            await prisma.course.findUnique({
                where: {
                    id: data.id,
                },
            });
        } catch (error) {
            return Response.json({
                msg: "error",
                error: "course not found",
            });
        }
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
            error: error
        });
    }
}

export { addCourse as POST } from './add_course'