import Board from './components/Board';
import Column from './components/Column';
import SAMPLE_DATA from './constants/data';

function App() {
  return (
    <div className="h-screen">
      <Board title={SAMPLE_DATA.title}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {SAMPLE_DATA.columns.map((column, index) => (
            <Column key={index} {...column} />
          ))}
        </div>
      </Board>
    </div>
  );
}

export default App;
