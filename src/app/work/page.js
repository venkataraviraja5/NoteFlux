"use client"
import React, { useState, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PlusCircle, Type, Image, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CARD_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  NOTE: 'note',
};

const InfiniteCanvas = () => {
  const [cards, setCards] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardType, setNewCardType] = useState(CARD_TYPES.TEXT);

  const handleAddCard = useCallback((pointX, pointY) => {
    const newCard = {
      id: Date.now(),
      type: newCardType,
      content: '',
      x: pointX,
      y: pointY,
    };

    setCards(prevCards => [...prevCards, newCard]);
    setIsAdding(false);
  }, [newCardType]);

  const handleCardContentChange = useCallback((id, content) => {
    setCards(prevCards => prevCards.map(card => card.id === id ? { ...card, content } : card));
  }, []);

  const handleCardMove = useCallback((id, newX, newY) => {
    setCards(prevCards => prevCards.map(card => card.id === id ? { ...card, x: newX, y: newY } : card));
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.1}
        maxScale={3}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <div className="absolute top-4 left-4 z-10 space-x-2">
              <Button onClick={() => setIsAdding(!isAdding)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Card
              </Button>
              {isAdding && (
                <>
                  <Button onClick={() => setNewCardType(CARD_TYPES.TEXT)}>
                    <Type className="mr-2 h-4 w-4" /> Text
                  </Button>
                  <Button onClick={() => setNewCardType(CARD_TYPES.IMAGE)}>
                    <Image className="mr-2 h-4 w-4" /> Image
                  </Button>
                  <Button onClick={() => setNewCardType(CARD_TYPES.NOTE)}>
                    <FileText className="mr-2 h-4 w-4" /> Note
                  </Button>
                </>
              )}
            </div>
            <div className="absolute top-4 right-4 z-10 space-x-2">
              <Button onClick={() => zoomIn()}>
                <ZoomIn className="mr-2 h-4 w-4" /> Zoom In
              </Button>
              <Button onClick={() => zoomOut()}>
                <ZoomOut className="mr-2 h-4 w-4" /> Zoom Out
              </Button>
              <Button onClick={() => resetTransform()}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <div 
                className="w-[10000px] h-[10000px] bg-white relative"
                onClick={(e) => {
                  if (isAdding) {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - bounds.left;
                    const y = e.clientY - bounds.top;
                    handleAddCard(x, y);
                  }
                }}
              >
                {cards.map((card) => (
                  <DraggableCard
                    key={card.id}
                    card={card}
                    onContentChange={handleCardContentChange}
                    onMove={handleCardMove}
                    setTransform={setTransform}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

const DraggableCard = ({ card, onContentChange, onMove, setTransform }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.movementX;
      const dy = e.movementY;
      onMove(card.id, card.x + dx, card.y + dy);
    }
  }, [isDragging, card, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Card
      className="absolute shadow-lg"
      style={{ left: `${card.x}px`, top: `${card.y}px`, width: '300px' }}
    >
      <CardHeader 
        className="cursor-move" 
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setTransform(card.x, card.y, 1)}
      >
        <CardTitle className="flex items-center">
          {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
        </CardTitle>
      </CardHeader>
      <CardContent onClick={(e) => e.stopPropagation()}>
        {card.type === CARD_TYPES.TEXT && (
          <Input
            type="text"
            placeholder="Enter text..."
            value={card.content}
            onChange={(e) => onContentChange(card.id, e.target.value)}
          />
        )}
        {card.type === CARD_TYPES.IMAGE && (
          <Input
            type="text"
            placeholder="Enter image URL..."
            value={card.content}
            onChange={(e) => onContentChange(card.id, e.target.value)}
          />
        )}
        {card.type === CARD_TYPES.NOTE && (
          <textarea
            className="w-full h-32 p-2 border rounded"
            placeholder="Enter note..."
            value={card.content}
            onChange={(e) => onContentChange(card.id, e.target.value)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InfiniteCanvas;