import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return Response.json({
        msg: "success",
        data: await prisma.timeBlock.findMany({
            select: {   
                id: true,
                week_start: true,
                week_end: true,
                start: true,
                end: true,
                day_of_week: true,
            }
        }),
    });
}