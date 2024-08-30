"use client";
import { useState, useEffect } from "react";
import Note from "../../components/Note";

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = () => {
    setNotes([
      ...notes,
      {
        title: "Title",
        content: "",
        position: { top: 50, left: 50 },
      },
    ]);
  };

  const updateNotePosition = (index, position) => {
    setNotes(prevNotes =>
      prevNotes.map((note, i) =>
        i === index ? { ...note, position, isModified: true } : note
      )
    );
  };

  const updateNoteContent = (index, content) => {
    setNotes(prevNotes =>
      prevNotes.map((note, i) =>
        i === index ? { ...note, content, isModified: true } : note
      )
    );
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/fetchCards");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data.map(note => ({ ...note, isModified: false })));
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const saveNotes = async () => {
    const modifiedNotes = notes.filter(note => note.isModified || !note._id);
    if (modifiedNotes.length === 0) {
      alert("No changes to save.");
      return;
    }

    try {
      const response = await fetch("/api/savecards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: modifiedNotes.map(({ _id, title, content, position }) => ({
            _id,
            title,
            content: content.trim(),
            position,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }

      const { notes: updatedNotes } = await response.json();
      setNotes(prevNotes => 
        prevNotes.map(note => {
          const updatedNote = updatedNotes.find(un => un._id === note._id);
          return updatedNote ? { ...updatedNote, isModified: false } : note;
        })
      );

      alert("Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  return (
    <div className="relative min-h-screen h-auto flex flex-wrap justify-center p-4 bg-lime-300">
      <div className="flex flex-wrap justify-center gap-4 mb-16 h-2/5">
        {notes.map((note, index) => (
          <Note
            key={note._id || index}
            title={note.title}
            content={note.content}
            position={note.position}
            onDrag={(position) => updateNotePosition(index, position)}
            onContentChange={(content) => updateNoteContent(index, content)}
          />
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-4">
        <button 
          onClick={saveNotes}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Save
          </span>
        </button>
        <button 
          onClick={addNote}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-1 text-base font-medium text-white backdrop-blur-3xl">
            +
          </span>
        </button>
      </div>
    </div>
  );
}