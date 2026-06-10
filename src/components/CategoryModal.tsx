import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAppDispatch } from "../store/hooks";
import { addCategory, updateCategory,type  Category } from "../store/slices/categorySlice";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categoryToEdit }) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (categoryToEdit) {
      setValue("name", categoryToEdit.name);
    } else {
      reset();
    }
  }, [categoryToEdit, isOpen, reset, setValue]);

  const onSubmit = async (data: any) => {
    if (categoryToEdit) {
      await dispatch(updateCategory({ id: categoryToEdit.id, name: data.name }));
    } else {
      await dispatch(addCategory(data.name));
    }
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? "Таҳрири Категория" : "Иловаи Категория"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Номи Категория</Label>
            <Input id="name" {...register("name", { required: true })} placeholder="Масалан: Кор" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Бекор кардан
            </Button>
            <Button type="submit">{categoryToEdit ? "Сабт" : "Илова"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
