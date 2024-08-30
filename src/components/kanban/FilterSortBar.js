import { FaSortAmountDown, FaFilter } from 'react-icons/fa';

const FilterSortBar = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 text-white bg-gray-800 px-4 py-2 rounded-lg">
          <FaFilter />
          <span>Filter</span>
        </button>
        <button className="flex items-center space-x-2 text-white bg-gray-800 px-4 py-2 rounded-lg">
          <FaSortAmountDown />
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
};

export default FilterSortBar;
