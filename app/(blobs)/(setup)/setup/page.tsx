import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import {
  getAnonymousRecruitmentStatus,
  getLimitInterviewsStatus,
  requireAppNotExpired,
} from '~/queries/appSettings';
import { getServerSession } from '~/utils/auth';
import { prisma } from '~/utils/db';
import Setup from './Setup';

async function getSetupData() {
  const session = await getServerSession();
  const allowAnonymousRecruitment = await getAnonymousRecruitmentStatus();
  const limitInterviews = await getLimitInterviewsStatus();
  const otherData = await prisma.$transaction([
    prisma.protocol.count(),
    prisma.participant.count(),
  ]);

  return {
    hasAuth: !!session,
    allowAnonymousRecruitment,
    limitInterviews,
    hasProtocol: otherData[0] > 0,
    hasParticipants: otherData[1] > 0,
  };
}

export type SetupData = ReturnType<typeof getSetupData>;

export const dynamic = 'force-dynamic';

export default async function Page() {
  await requireAppNotExpired(true);

  const setupDataPromise = getSetupData();

  return (
    <Suspense
      fallback={<Loader2 className="h-10 w-10 animate-spin text-background" />}
    >
      <Setup setupDataPromise={setupDataPromise} />
    </Suspense>
  );
}
