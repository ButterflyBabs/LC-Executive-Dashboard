"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";

interface DraggableCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onRemove?: () => void;
  className?: string;
  color?: string;
}

export function DraggableCard({
  id,
  title,
  children,
  defaultExpanded = true,
  onRemove,
  className = "",
  color = "#1a2b4a",
}: DraggableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl soft-shadow overflow-hidden ${className} ${
        isDragging ? "shadow-2xl ring-2 ring-gold" : ""
      }`}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5 text-soft-taupe" />
          </button>
          
          {/* Color Indicator */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          
          {/* Title */}
          <h3 className="font-serif text-lg text-navy">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Expand/Collapse */}
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-soft-taupe" />
            ) : (
              <ChevronDown className="w-5 h-5 text-soft-taupe" />
            )}
          </button>
          
          {/* Remove */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 hover:bg-red-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-soft-taupe hover:text-red-500" />
            </button>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}
