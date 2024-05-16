/**
 * @swagger
 * /api/ping:
 *  get:
 *   summary: Ping API
 *   parameters: []
 *   responses:
 *    200:
 *      description: Success
 */
export function GET(req: Request, res: Response){
    setTimeout(() => {
        
    }, 1000);
    return Response.json({
        msg: "success",
        data: "pong",
    });
}