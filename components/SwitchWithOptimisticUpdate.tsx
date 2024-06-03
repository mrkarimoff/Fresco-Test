'use client';

import { Switch as SwitchUI } from '~/components/ui/switch';
import { useOptimistic, useTransition } from 'react';

const SwitchWithOptimisticUpdate = ({
  initialValue,
  name,
  action,
}: {
  initialValue: boolean;
  name: string;
  action: (value: boolean) => Promise<boolean>;
}) => {
  const [isTransitioning, startTransition] = useTransition();
  const [optimisticIsActive, setOptimisticIsActive] = useOptimistic(
    initialValue,
    (_, newValue: boolean) => newValue,
  );

  const updateIsActive = async (newValue: boolean) => {
    setOptimisticIsActive(newValue);
    await action(newValue); // this is a server action which calls `revalidateTag`
  };

  return (
    <SwitchUI
      name={name}
      checked={optimisticIsActive}
      onCheckedChange={(checked) =>
        startTransition(() => updateIsActive(checked))
      }
      disabled={isTransitioning}
    />
  );
};

export default SwitchWithOptimisticUpdate;
