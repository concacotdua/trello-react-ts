import Header from "@/components/Header";
import BoardBar from "./BoardBar";
import Board from "./Board";

export default function Boards() {
  return (
    <div className="flex-shink h-screen overflow-x-auto">
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-6">
          <BoardBar />
          <Board />
        </div>
      </div>
    </div>
  );
}
