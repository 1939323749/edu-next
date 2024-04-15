import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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