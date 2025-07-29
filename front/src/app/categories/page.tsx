'use client';

import { useCategories } from '@/hooks/useCategories';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const CategoriesPage: React.FC = () => {
  const { categories, loading, error, deleteCategory } = useCategories();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully", {
        style: {
          background: "#4CAF50",
          color: "#FFFFFF",
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/categories/create">
          <Button>+ Create New Category</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {categories.map((category) => (
          <Card key={category.id} className="shadow-md flex justify-between">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mt-4 gap-5">
                <Link href={`/categories/edit/${category.id}`}>
                  <Button variant="secondary" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle></AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <h2 className="text-lg font-bold">Confirm Deletion</h2>
                    <p>Are you sure you want to delete the category "{category.title}"?</p>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
