import ScoreGradeMap from "@/app/config/score_grade_map";
import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!Number(params.id)) {
            return Response.json({
                msg: "error",
                error: "invalid id",
            });
        }
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid id",
        });
    }

    return Response.json({
        msg: "success",
        data: await prisma.score.findMany({
            where: {
                student: {
                    id: Number(params.id),
                }
            },
            select: {
                id: true,
                score: true,
                exam: {
                    select: {
                        name: true,
                    },
                },
            },
        }).then((data) => {
            return data.map((score) => {
                return {
                    id: score.id,
                    score: score.score,
                    exam: score.exam,
                    grade: ScoreGradeMap(score.score),
                };
            });
        }),
    });
}