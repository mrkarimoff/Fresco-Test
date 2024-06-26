import { AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/AlertDialog';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/Alert';
import type { Interview } from '@prisma/client';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { deleteInterviews } from '~/actions/interviews';

type DeleteInterviewsDialog = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  interviewsToDelete: Interview[];
};

export const DeleteInterviewsDialog = ({
  open,
  setOpen,
  interviewsToDelete,
}: DeleteInterviewsDialog) => {
  const [hasUnexported, setHasUnexported] = useState<boolean>(false);

  useEffect(() => {
    setHasUnexported(
      interviewsToDelete?.some((interview) => !interview.exportTime),
    );
  }, [interviewsToDelete]);

  const handleConfirm = async () => {
    await deleteInterviews(interviewsToDelete.map((d) => ({ id: d.id })));
    setHasUnexported(false);

    setOpen(false);
  };

  const handleCancelDialog = () => {
    setHasUnexported(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <strong>
              {interviewsToDelete.length}{' '}
              {interviewsToDelete.length > 1 ? (
                <>interviews.</>
              ) : (
                <>interview.</>
              )}
            </strong>
          </AlertDialogDescription>
          {hasUnexported && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                {interviewsToDelete.length > 1 ? (
                  <>
                    One or more of the selected interviews
                    <strong> has not yet been exported.</strong>
                  </>
                ) : (
                  <>
                    The selected interview
                    <strong> has not yet been exported.</strong>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelDialog}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={() => void handleConfirm()} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
