import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @sawgger
 * /api/loca:
 *  post:
 *   description: 添加教室
 *  requestBody:
 *   content:
 *    application/json:
 *     schema:
 *      type: object
 *      properties:
 *       name:
 *        type: string
 *        description: 教室名称
 *        example: 101
 *       address:
 *        type: string
 *        description: 教室地址
 *        example: 1号楼
 *  responses:
 *   200:
 *    description: Success
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        msg:
 *         type: string
 *         example: success
 *        data:
 *         type: object
 *         properties:
 *          id:
 *           type: number
 *          name:
 *           type: string
 *          address:
 *           type: string
 *   400:
 *    description: Invalid data
 */
export async function POST(req: NextRequest) {
    var data:{
        name: string;
        address: string;
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
            name: z.string(),
            address: z.string(),
        }).parse(data);

        const location = await prisma.location.create({
            data: {
                name: data.name,
                address: data.address,
            }
        });

        return NextResponse.json({
            msg: "success",
            data: location,
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
        await prisma.location.delete({
            where: {
                id: data.id,
            }
        });
        return NextResponse.json({
            msg: "success",
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
        name: string | undefined;
        address: string | undefined;
    };
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
            id: z.number(),
            name: z.string().optional(),
            address: z.string().optional(),
        }).parse(data);
        const location = await prisma.location.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                address: data.address,
            }
        });

        return NextResponse.json({
            msg: "success",
            data: location,
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

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({
            msg: "success",
            data: (await prisma.location.findMany()).map((location) => {
                return {
                    id: location.id,
                    name: location.name,
                    address: location.address,
                }
            })
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