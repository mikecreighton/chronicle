"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DraggableBook from "./DraggableBook";
import EmptySlot from "./EmptySlot";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export default function BookList() {
  const serverBooksRaw = useQuery(api.books.list);
  const serverBooks = useMemo(() => serverBooksRaw ?? [], [serverBooksRaw]);
  const settings = useQuery(api.settings.getSettings);
  const reorder = useMutation(api.books.reorder);

  const [ordered, setOrdered] = useState(serverBooks);
  const [isDragging, setIsDragging] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Keep local list in sync with server when not actively dragging
  const orderedIds = useMemo(() => ordered.map((b) => `${b._id}`), [ordered]);
  const serverIds = useMemo(() => serverBooks.map((b) => `${b._id}`), [serverBooks]);

  useEffect(() => {
    if (isDragging || isReordering) return;
    // Only sync when content actually differs to avoid render loops
    const sameIds = orderedIds.length === serverIds.length && orderedIds.every((id, i) => id === serverIds[i]);
    if (!sameIds) {
      setOrdered(serverBooks);
      return;
    }
    // if ids match, we still may want to sync field updates
    let fieldsDiffer = false;
    for (let i = 0; i < ordered.length; i++) {
      const a = ordered[i];
      const b = serverBooks[i];
      if (
        a.title !== b.title ||
        a.status !== b.status ||
        a.order !== b.order ||
        a.startedAt !== b.startedAt ||
        a.completedAt !== b.completedAt
      ) {
        fieldsDiffer = true;
        break;
      }
    }
    if (fieldsDiffer) setOrdered(serverBooks);
  }, [serverBooks, isDragging, isReordering, ordered, orderedIds, serverIds]);

  // When server order catches up to our optimistic order, release the lock
  useEffect(() => {
    if (!isReordering) return;
    const sameOrder = orderedIds.length === serverIds.length && orderedIds.every((id, i) => id === serverIds[i]);
    if (sameOrder) setIsReordering(false);
  }, [isReordering, orderedIds, serverIds]);

  const goal = settings?.yearGoal ?? 0;
  const placeholders = Math.max(0, goal - ordered.length);
  const sensors = useSensors(
    // Mouse: small distance to avoid accidental drags
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // Touch: press and hold before drag, small tolerance for jitter
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    // Keyboard: a11y support
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragStart() {
    setIsDragging(true);
  }

  function onDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((b) => `${b._id}` === `${active.id}`);
    const newIndex = ordered.findIndex((b) => `${b._id}` === `${over.id}`);
    if (oldIndex < 0 || newIndex < 0) return;
    const moved = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(moved);
    setIsReordering(true);
    const updates = moved.map((b, i) => ({ id: b._id, order: i + 1 }));
    void reorder({ updates });
  }

  const ids = orderedIds;

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-3">
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {ordered.map((b) => (
            <DraggableBook key={b._id} book={b} />
          ))}
        </SortableContext>
        {Array.from({ length: placeholders }).map((_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </div>
    </DndContext>
  );
}
