// import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
//@ts-ignore
export default function SortableItem({ id}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
        data: { type: 'task' },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '0.5rem',
        border: '1px solid #ccc',
        marginBottom: '0.5rem',
        backgroundColor: '#fff',
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {id}
        </div>
    );
}
