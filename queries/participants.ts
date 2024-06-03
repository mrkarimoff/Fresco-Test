import { unstable_cache } from 'next/cache';
import { prisma } from '~/utils/db';
import 'server-only';

export const getParticipants = unstable_cache(
  async () => {
    const participants = await prisma.participant.findMany({
      include: {
        interviews: true,
        _count: { select: { interviews: true } },
      },
    });

    return participants;
  },
  ['getParticipants'],
  {
    tags: ['getParticipants'],
  },
);

type GetParticipantsType = typeof getParticipants;
export type GetParticipantsReturnType = ReturnType<GetParticipantsType>;
