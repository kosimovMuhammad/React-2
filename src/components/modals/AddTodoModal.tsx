import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSetAtom } from 'jotai';
import { addUserAtom } from '@/store/TodoAtom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  images: Yup.mixed().required('Images are required'),
});

interface TodoFormValues {
  name: string;
  description: string;
  images: any;
}

export function AddTodoModal() {
  const addUser = useSetAtom(addUserAtom);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: yupResolver(validationSchema) as any, 
    defaultValues: {
      name: '',
      description: '',
      images: undefined,
    },
  });

  const onSubmit = async (values: TodoFormValues) => {
    const formData = new FormData();
    formData.append('Name', values.name);
    formData.append('Description', values.description);
    
    if (values.images && values.images.length > 0) {
      for (let i = 0; i < values.images.length; i++) {
        formData.append('Images', values.images[i]);
      }
    }
    
    await addUser(formData);
    reset();
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
        <Button variant="outline">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            
            {/* Инупти Ном */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register('name')}
              />
            </div>
            {errors.name ? (
              <div className="text-red-500 text-sm text-right">{errors.name.message}</div>
            ) : null}
            
            {/* Инпути Тавсиф */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-3"
                {...register('description')}
              />
            </div>
            {errors.description ? (
              <div className="text-red-500 text-sm text-right">{errors.description.message as string}</div>
            ) : null}
            
            {/* Инпути Расми */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                className="col-span-3"
                {...register('images')}
              />
            </div>
            {errors.images ? (
              <div className="text-red-500 text-sm text-right">{errors.images.message as string}</div>
            ) : null}
            
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}