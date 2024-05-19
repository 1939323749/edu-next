import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    var data:{
        week_start: number;
        week_end: number;
        start : number;
        end : number;
        day_of_week: number;
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
            day_of_week: z.number(),
        }).parse(data);

        if (data.week_start > data.week_end) {
            return NextResponse.json({
                msg: "error",
                error: "invalid week range",
            });
        }

        if (data.start > data.end) {
            return NextResponse.json({
                msg: "error",
                error: "invalid time range",
            });
        }

        let tb = await prisma.timeBlock.findFirst({
            where: {
                week_end: {
                    equals: data.week_start,
                },
                week_start: {
                    equals: data.week_end,
                },
                day_of_week: {
                    equals: data.day_of_week,
                },
                start: {
                    equals: data.start,
                },
                end: {
                    equals: data.end,
                },
            },
        });

        if (tb) {
            return NextResponse.json({
                msg: "error",
                error: "time block already exists",
            });
        }


        tb = await prisma.timeBlock.create({
            data: {
                week_start: data.week_start,
                week_end: data.week_end,
                start: data.start,
                end: data.end,
                day_of_week: data.day_of_week,
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