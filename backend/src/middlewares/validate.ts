import {Request, Response, NextFunction} from 'express';
import {z, ZodError} from 'zod';

export const validate =
    (schema: z.ZodObject<any>) => async (req: Request, res: Response, next: NextFunction) => {
        try {

            const valData = await schema.parseAsync(req.body)

            if ('id' in req.body) {
                valData.id = Number.parseInt(req.body.id);
            }
            req.body = valData;

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    errors: z.formatError(err),
                    // summary: z.prettifyError(err)
                });
            }
            return res.status(500).json({status: 'error', message: 'Internal Server Error'});
        }
    };

export const validateParams =
    (schema: z.ZodObject<any>) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.params);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    errors: z.formatError(err),
                    // summary: z.prettifyError(err)
                });
            }
            return res.status(500).json({status: 'error', message: 'Internal Server Error'});
        }
    };

export const validateQueryString =
    (schema: z.ZodObject<any>) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.query);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    errors: z.formatError(err),
                    // summary: z.prettifyError(err)
                });
            }
            return res.status(500).json({status: 'error', message: 'Internal Server Error'});
        }
    };
