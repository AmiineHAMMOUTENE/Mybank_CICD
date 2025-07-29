"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Select } from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useOperations } from "@/hooks/useOperations"
import { useCategories } from "@/hooks/useCategories"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { OperationFormSchema } from "@/components/forms/schemas/operation-form-schema"


export default function OperationForm({ operation }: { operation?: any }) {

    const { createOperation, editOperation } = useOperations();
    const { categories, loading: categoriesLoading } = useCategories();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (values: any) => {
        await createOperation(values);
        toast.success("Operation Created successfully", {
            style: {
                background: "#4CAF50",
                color: "#FFFFFF",
            },
        });
    }

    const handleUpdate = async (values: any) => {
        await editOperation(operation.id, values);
        toast.success("Operation Updated successfully", {
            style: {
                background: "#4CAF50",
                color: "#FFFFFF",
            },
        });
    }

    const form = useForm<z.infer<typeof OperationFormSchema>>({
        resolver: zodResolver(OperationFormSchema),
        defaultValues: {
            label: operation?.label || "",
            amount: parseInt(operation?.amount) || 0,
            category: operation?.category?.id ? `/api/categories/${operation.category.id}` : "",
        },
    })

    async function onSubmit(values: z.infer<typeof OperationFormSchema>) {
        try {
            if (operation) {
                await handleUpdate(values);
            }
            else {
                await handleCreate(values);
            }
            router.push('/operations');
        } catch (err) {
            console.log(err);
            setError('Failed to create operation. Please try again.');
        }
    }

    return (
        <Form {...form}>
            {error && (
                <Alert variant="destructive" className="text-sm">
                    {error}
                </Alert>
            )}
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input placeholder="Nom de l'opération" {...field} />
                            </FormControl>
                            <FormDescription>
                                Entrez une description pour cette opération
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>
                                Montant de l'opération en euros
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Date" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                            <FormControl>
                                <Select 
                                    {...field} 
                                    placeholder="Sélectionnez une catégorie"
                                    disabled={categoriesLoading}
                                >
                                    {categories.map((category) => (
                                        <option 
                                            key={category.id} 
                                            value={`/api/categories/${category.id}`}
                                        >
                                            {category.title}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormDescription>
                                {categoriesLoading ? "Chargement des catégories..." : "Choisissez la catégorie pour cette opération"}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn-primary">Submit</Button>
            </form>
        </Form>
    )
}