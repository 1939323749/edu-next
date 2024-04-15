import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    var data:{
        week_start: number;
        week_end: number;
        start : number;
        end : number;
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
            week_start: z.number(),
            week_end: z.number(),
            start: z.number(),
            end: z.number(),
        }).parse(data);
        const tb = await prisma.timeBlock.create({
            data: {
                week_start: data.week_start,
                week_end: data.week_end,
                start: data.start,
                end: data.end,
            }
        });
        return NextResponse.json({
            msg: "success",
            data: tb,
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
        id: number;
    }
    try {
        data = await req.json();
        z.object({
            id: z.number(),
        }).parse(data);
        await prisma.timeBlock.delete({
            where: {
                id: data.id,
            }
        });
        return NextResponse.json({
            msg: "success",
            data: "time block deleted",
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

export async function PUT(req: NextRequest) {
    var data: {
        id: number;
        week_start: number | undefined;
        week_end: number | undefined;
        start: number | undefined;
        end: number | undefined;
    }
    try {
        data = await req.json();
        z.object({
            id: z.number(),
            week_start: z.number().optional(),
            week_end: z.number().optional(),
            start: z.number().optional(),
            end: z.number().optional(),
        }).parse(data);
        const tb = await prisma.timeBlock.update({
            where: {
                id: data.id,
            },
            data: {
                week_start: data.week_start,
                week_end: data.week_end,
                start: data.start,
                end: data.end,
            }
        });
        return NextResponse.json({
            msg: "success",
            data: tb,
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