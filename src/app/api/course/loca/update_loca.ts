import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: NextRequest) {
    var data: {
        course_id: number;
        loca_id: number;
        new_loca_id: number;
    }
    try {
        data = await req.json();
    } catch (error) {
        return NextResponse.json({
            msg: "error",
            error: "invalid json format",
        });
    }

    try {
        z.object({
            course_id: z.number(),
            loca_id: z.number(),
            new_loca_id: z.number(),
        }).parse(data);
        const course_tb = await prisma.course.update({
            where: {
                id: data.course_id,
            },
            data: {
                locations: {
                    disconnect: {
                        id: data.loca_id,
                    },
                    connect: {
                        id: data.new_loca_id,
                    }
                }
            },
            include: {
                locations: true,
            }
        });

        return NextResponse.json({
            msg: "success",
            data: {
                course_id: data.course_id,
                course_name: course_tb.name,
                locations: course_tb.locations.map((loca) => {
                    return {
                        id: loca.id,
                        name: loca.name,
                        address: loca.address,
                    }
                }),
            },
        });
    } catch (error) {
        return NextResponse.json({
            msg: "error",
            error: error,
        }, {
            status: 500,
        });
    }
}