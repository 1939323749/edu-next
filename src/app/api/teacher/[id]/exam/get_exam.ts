import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getExam(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
   try {
       if(!Number(params.id)){
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

    try {
        const exams = await prisma.exam.findMany({
            where: {
                course: {
                    some: {
                        teachers: {
                            some: {
                                id: Number(params.id)
                            }
                        }
                    }
                },
            },
        })

        return Response.json({
            msg: "success",
            data: exams,
        })
    } catch(error){
        return Response.json({
            msg: "error",
            error: "exam not found",
            details: error
        });
    }
}