import React from 'react';
import { useSetAtom } from 'jotai';
import { deleteUserAtom } from '@/store/TodoAtom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

export function DeleteTodoModal({ id, name }: { id: number; name: string }) {
  const deleteUser = useSetAtom(deleteUserAtom);
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    await deleteUser(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete To-Do</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
