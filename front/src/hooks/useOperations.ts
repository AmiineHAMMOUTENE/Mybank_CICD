import { Operation } from '@/types/interfaces';
import { useFetch } from './useFetch';
import { NEXT_PUBLIC_API_BASE_URL } from '@/config/env';
import axios from 'axios';

const url = `${NEXT_PUBLIC_API_BASE_URL}/operations`;

export const useOperations = () => {
    const { data, loading, error, setData } = useFetch<{ member: Operation[] }>(`${url}`);


    const getOperation = async (id: string) => {
        const response = await axios.get(`${url}/${id}`);
        const operation = response.data;
        return operation;
    }

    const createOperation = async (operation: any) => {
        const body = JSON.stringify(operation);
        await axios.post(`${url}`, body, {
            headers: {
                'accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
            }
        });
    };

    const editOperation = async (id: string, operation: Partial<Operation>) => {
        const body = JSON.stringify(operation);
        console.log(body);
        await axios.patch(`${url}/${id}`, body, { headers: {
            'Content-Type': 'application/merge-patch+json',
        } });
        
    };

    const deleteOperation = async (id: number) => {
        try {
            await axios.delete(`${url}/${id}`);
            setData((prev) => ({
                ...prev!,
                member: prev!.member.filter((operation) => operation.id !== id),
            }));
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    return {
        operations: data?.member || [],
        loading,
        error,
        getOperation,
        createOperation,
        editOperation,
        deleteOperation,
    };
};