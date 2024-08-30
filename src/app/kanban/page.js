"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AddEditBoardModal from "../../components/kanban/AddEditBoardModal";
import Column from "../../components/kanban/Column";
import EmptyBoard from "../../components/kanban/EmptyBoard";
import Sidebar from "../../components/kanban/Sidebar";

function Home({ isBoardModalOpen, setIsBoardModalOpen }) {
  // Get window size directly in render logic
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  // Handle window resize event if needed
  useEffect(() => {
    const handleWindowResize = () => {
      // Handle window resize logic if needed
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // const boards = useSelector((state) => state.boards);
  // const board = boards.find((board) => board.isActive === true);
  // const columns = board.columns;

  const isSideBarOpen = true; // Set this according to your needs

  return (
    <div
      className={
        windowWidth >= 768 && isSideBarOpen
          ? " bg-[#f4f7fd]  scrollbar-hide h-screen flex dark:bg-[#20212c]  overflow-x-scroll gap-6  ml-[261px]"
          : "bg-[#f4f7fd]  scrollbar-hide h-screen flex    dark:bg-[#20212c] overflow-x-scroll gap-6 "
      }
    >
      {windowWidth >= 768 && (
        <Sidebar
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={() => {}}
        />
      )}

      {/* Columns Section */}
      {/* {columns.length > 0 ? ( */}
        {/* <>
          {columns.map((col, index) => (
            <Column key={index} colIndex={index} />
          ))}
          <div
            onClick={() => {
              setIsBoardModalOpen(true);
            }}
            className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
          >
            + New Column
          </div>
        </> */}
      {/* ) : (
        <EmptyBoard type="edit" />
      )} */}
      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Home;
