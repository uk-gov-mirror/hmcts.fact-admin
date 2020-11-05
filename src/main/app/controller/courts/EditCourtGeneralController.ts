import { Response } from 'express';
import autobind from 'autobind-decorator';
import { AuthedRequest } from '../../../types/AuthedRequest';

@autobind
export class EditCourtGeneralController {
  public async get(req: AuthedRequest, res: Response): Promise<void> {
    const slug: string = req.params.slug as string;
    const court = await req.scope.cradle.api.getCourtGeneral(slug);

    res.render('courts/edit-court-general', { court });
  }

  public async post(req: AuthedRequest, res: Response): Promise<void> {
    const court = req.body;
    const slug: string = req.params.slug as string;
    const updateCourt = await req.scope.cradle.api.updateCourtGeneral(slug, court);

    return res.render('courts/edit-court-general', { court: updateCourt, updated: true });
  }
}
