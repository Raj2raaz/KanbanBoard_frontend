import React from 'react';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SortableItem from './SortableItem';

export default function KanbanColumn({ column, columns, setColumns }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: column.id,
        data: { type: 'column' },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        border: '1px solid #ddd',
        padding: '1rem',
        minWidth: '200px',
        backgroundColor: '#f4f4f4',
    };

    const onDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeIndex = column.items.indexOf(active.id);
        const overIndex = column.items.indexOf(over.id);

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
            const newItems = arrayMove(column.items, activeIndex, overIndex);
            const newColumns = columns.map(col =>
                col.id === column.id ? { ...col, items: newItems } : col
            );
            setColumns(newColumns);
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <h3>{column.title}</h3>
            <SortableContext items={column.items} strategy={verticalListSortingStrategy}>
                {column.items.map((item) => (
                    <SortableItem key={item} id={item} />
                ))}
            </SortableContext>
        </div>
    );
}
