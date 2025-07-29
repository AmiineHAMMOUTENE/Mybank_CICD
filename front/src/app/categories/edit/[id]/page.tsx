'use client';
import { useCategories } from '@/hooks/useCategories';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { toast } from 'sonner';

const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { categories, updateCategory } = useCategories();
  const category = categories.find((cat) => cat.id === Number(id));
  
  const [title, setTitle] = useState(category?.title || '');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory(Number(id), { title });
      toast.success("Category updated successfully" , {
        style: {
          background: "#4CAF50",
          color: "#FFFFFF",
        },
      }
      );
      router.push('/categories');
    } catch (err) {
      console.log(err);
      setError('Failed to update category. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800">Edit Category</h1>
        {error && (
          <Alert variant="destructive" className="text-sm">
            {error}
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter category title"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditCategoryPage;
