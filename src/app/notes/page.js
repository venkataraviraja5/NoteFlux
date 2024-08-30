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
      <div className="flex flex-wrap justify-center gap-4 mb-4 h-2/5">
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
      <button
        onClick={addNote}
        className="bg-lime-300 text-black border-black border-2 text-lg rounded-full w-14 h-14 flex items-center justify-center fixed bottom-4 right-4 shadow-lg transition-colors hover:bg-green-400"
      >
        +
      </button>
      <button
        onClick={saveNotes}
        className="bg-lime-300 text-black border-black border-2 rounded-full px-4 py-2 fixed bottom-4 left-4 shadow-lg transition-colors hover:bg-green-400"
      >
        Save
      </button>
    </div>
  );
}