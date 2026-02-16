import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  // eslint-disable-next-line @typescript-eslint/require-await
  async summarizeLead(input: {
    fullName: string;
    email: string;
    phone?: string;
    source: string;
  }): Promise<{ summary: string; next_action: string }> {
    return {
      summary: `Lead ${input.fullName} (${input.email}) imported from ${input.source}.`,
      next_action:
        'Send a personalized outreach message and schedule a follow-up.',
    };
  }
}
