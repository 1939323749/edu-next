import prisma from "@/app/db";

/**
 * @swagger
 * /api/overview:
 *  get:
 *   summary: 获取系统概览信息
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         msg:
 *          type: string
 *          example: success
 *          description: 请求结果
 *         data:
 *          type: object
 *          properties:
 *           students_count:
 *            type: number
 *            example: 10
 *            description: 学生数量
 *           teachers_count:
 *            type: number
 *            example: 5
 *            description: 教师数量
 *           courses_count:
 *            type: number
 *            example: 20
 *            description: 课程数量
 *           classes_count:
 *            type: number
 *            example: 10
 *            description: 班级数量
 *           locations_count: 
 *            type: number 
 *            example: 5
 *            description: 教室数量
 *           time_blocks_count:
 *            type: number
 *            example: 10
 *            description: 时间段数量
 *  500:
 *   description: Internal Server Error 
 */
export async function GET(req: Request) {
    return Response.json({
        msg: "success",
        data: {
            students_count: await prisma.student.count(),
            teachers_count: await prisma.teacher.count(),
            courses_count: await prisma.course.count(),
            classes_count: await prisma.class.count(),
            locations_count: await prisma.location.count(),
            time_blocks_count: await prisma.timeBlock.count()
        }
    });
}