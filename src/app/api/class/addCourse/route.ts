import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { set } from "zod";
/**
 * @swagger
 * /api/class/addCourse:
 *  post:
 *   description: 为班级添加课程
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        class_id:
 *         type: number
 *        course_id:
 *         type: number
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Invalid data
 */
export async function POST(request: NextRequest) {
    var data: {
        class_id: number;
        course_id: number;
    }
    try {
        data = await request.json()
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid json format"
        })
    }
    try {
        const course = await prisma.course.findFirst({
            where: {
                id: data.course_id
            },
            select: {
                classes: {
                    where: {
                        id: data.class_id
                    }
                }
            }
        })
        if(course && course.classes.find((class_) => class_.id === data.class_id) != undefined){
            return Response.json({
                msg: "error",
                error: "class already added, please check again",
                data: course
            })
        }
        const class_info = await prisma.class.update({
            where: {
                id: data.class_id,
            },
            data: {
                courses: {
                    connect: {
                        id: data.course_id,
                    },
                },
            }
        })
        await prisma.$transaction(async (prisma) => {
            const students = await prisma.student.findMany({
              where: {
                classId: data.class_id
              }
            });
          
            await Promise.all(
              students.map(async (student) => {
                await prisma.student.update({
                  where: {
                    id: student.id
                  },
                  data: {
                    courses: {
                      connect: {
                        id: data.course_id
                      }
                    }
                  }
                });
              })
            );
          });
        return Response.json({
            msg: "success",
            data: "class added",
            class_info: class_info
        })
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            details: error
        })
    }
}