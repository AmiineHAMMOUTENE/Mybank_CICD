"use client";

import OperationForm from "@/components/forms/operation-form";
import { useOperations } from "@/hooks/useOperations";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
    const { id } = useParams<{ id: string }>();
    const [operation, setOperation] = useState<any>();
    const { getOperation } = useOperations();

    useEffect(() => {
        const fetchOperation = async () => {
            try {
                const operation = await getOperation(id);
                setOperation(operation);
            } catch (error) {
                console.error("Error fetching operation:", error);
            }
        };
        if (id) {
            fetchOperation();
        }
    }, [id, getOperation]);

    return (
        <>
            <h1 className="text-2xl font-bold py-5">Edit</h1>
            {operation && (
                <>
                    <div className="max-w-xl mx-auto">
                        <OperationForm operation={operation} />
                    </div>
                </>
            )}
        </>
    );
}

export default Page;
