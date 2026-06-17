import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSetAtom } from 'jotai';
import { editUserAtom } from '../../store/TodoAtom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

const validationSchema = Yup.object({
  id: Yup.mixed(),
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  isCompleted: Yup.boolean(),
});

interface TodoFormValues {
  id: any;
  name: string;
  description: string;
  isCompleted?: boolean;
}

export function EditTodoModal({ todo }: { todo: any }) {
  const editUser = useSetAtom(editUserAtom);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: yupResolver(validationSchema) as any,
    values: {
      id: todo.id,
      name: todo.name,
      description: todo.description,
      isCompleted: todo.isCompleted,
    },
  });

  const onSubmit = async (values: TodoFormValues) => {
    await editUser(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                className="col-span-3"
                {...register('name')}
              />
            </div>
            {errors.name ? (
              <div className="text-red-500 text-sm text-right">{errors.name.message}</div>
            ) : null}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                className="col-span-3"
                {...register('description')}
              />
            </div>
            {errors.description ? (
              <div className="text-red-500 text-sm text-right">{errors.description.message}</div>
            ) : null}
            <div className="flex items-center space-x-2">
              <Controller
                name="isCompleted"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isCompleted"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isCompleted">Is Completed</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
