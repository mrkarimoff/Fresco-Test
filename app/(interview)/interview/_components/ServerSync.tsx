'use client';

import { isEqual } from 'lodash';
import { type ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounceCallback } from 'usehooks-ts';
import usePrevious from '~/hooks/usePrevious';
import { getActiveSession } from '~/lib/interviewer/selectors/session';
import { api } from '~/trpc/client';

// The job of ServerSync is to listen to actions in the redux store, and to sync
// data with the server.
const ServerSync = ({
  interviewId,
  children,
}: {
  interviewId: string;
  children: ReactNode;
}) => {
  const [init, setInit] = useState(false);
  // Current stage
  const currentSession = useSelector(getActiveSession);
  const prevCurrentSession = usePrevious(currentSession);
  const { mutate: syncSessionWithServer } = api.interview.sync.useMutation({
    onMutate: () => {
      // eslint-disable-next-line no-console
      console.log(`⬆️ Syncing session with server...`);
    },
  });

  const debouncedSyncSessionWithServer = useDebounceCallback(
    syncSessionWithServer,
    2000,
    {
      leading: false,
      trailing: true,
      maxWait: 10000,
    },
  );

  useEffect(() => {
    if (!init) {
      setInit(true);
      return;
    }

    if (
      isEqual(currentSession, prevCurrentSession) ||
      !currentSession ||
      !prevCurrentSession
    ) {
      return;
    }

    // eslint-disable-next-line no-console
    debouncedSyncSessionWithServer({
      id: interviewId,
      network: currentSession.network,
      currentStep: currentSession.currentStep ?? 0,
    });
  }, [
    currentSession,
    prevCurrentSession,
    interviewId,
    debouncedSyncSessionWithServer,
    init,
  ]);

  if (!init) {
    return <div>Sync Loading (no init)...</div>;
  }

  return children;
};

export default ServerSync;
