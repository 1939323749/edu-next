import prisma from "@/app/db";
import exp from "constants";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    var data: {
        course_id: number;
        tb_id: number;
    }
    try {
        data = await req.json();
    } catch(error) {
        return NextResponse.json({
            msg: "error",
            error: "invalid json format",
        });
    }
    try {
        z.object({
            course_id: z.number(),
            tb_id: z.number(),
        }).parse(data);
        const course_tb = await prisma.course.update({
            where: {
                id: data.course_id,
            },
            data: {
                time_blocks: {
                    connect: {
                        id: data.tb_id,
                    }
                }
            },
            include: {
                time_blocks: true,
            }
        });

        return NextResponse.json({
            msg: "success",
            data: course_tb,
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

export async function DELETE(req: NextRequest) {
    var data: {
        course_id: number;
        tb_id: number;
    }
    try {
        data = await req.json();
    } catch(error) {
        return NextResponse.json({
            msg: "error",
            error: "invalid json format",
        });
    }
    try {
        z.object({
            course_id: z.number(),
            tb_id: z.number(),
        }).parse(data);
        const course_tb = await prisma.course.update({
            where: {
                id: data.course_id,
            },
            data: {
                time_blocks: {
                    disconnect: {
                        id: data.tb_id,
                    }
                }
            },
            include: {
                time_blocks: true,
            }
        });

        return NextResponse.json({
            msg: "success",
            data: {
                course: {
                    id: course_tb.id,
                    name: course_tb.name,
                },
                time_blocks: course_tb.time_blocks.map((tb) => {
                    return {
                        week_start: tb.week_start,
                        week_end: tb.week_end,
                        start: tb.start,
                        end: tb.end,
                    }
                })
            }
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

export async function PUT(request: NextRequest){
    var data: {
        course_id: number;
        tb_id: number;
        new_tb_id: number;
    }

    try {
        data = await request.json();
    } catch(error) {
        return NextResponse.json({
            msg: "error",
            error: "invalid json format",
        });
    }

    try {
        z.object({
            course_id: z.number(),
            tb_id: z.number(),
            new_tb_id: z.number(),
        }).parse(data);

        const course_tb = await prisma.course.update({
            where: {
                id: data.course_id,
            },
            data: {
                time_blocks: {
                    disconnect: {
                        id: data.tb_id,
                    },
                    connect: {
                        id: data.new_tb_id,
                    }
                }
            },
            include: {
                time_blocks: true,
            }
        });

        return NextResponse.json({
            msg: "success",
            data: {
                course: {
                    id: course_tb.id,
                    name: course_tb.name,
                },
                time_blocks: course_tb.time_blocks.map((tb) => {
                    return {
                        id: tb.id,
                        week_start: tb.week_start,
                        week_end: tb.week_end,
                        start: tb.start,
                        end: tb.end,
                    }
                })
            }
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