import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./index.css";
const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const Filter = ({
  setFilteredJobs,
  handleJobFilter,
  handleExperienceFilter,
  searchEvent,
}) => {
  const [checkedState, setCheckedState] = useState(
    new Array(experience.length).fill(false)
  );
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    handleExperienceFilter(updatedCheckedState);
  };

  const handleCategoryClick = (event) => {
    const value = event.target.innerText;
    setSelectedCategory(value);
    handleJobFilter(event);
  };

  return (
    <>
      <div className="filter-page">
        <div className="search-box">
          <div className="search">
            <h3>Search Jobs</h3>
            <div className="job-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="search-term"
                placeholder="Search Here"
                onChange={searchEvent}
              />
            </div>
          </div>
          <div className="filter">
            <div className="job-category">
              <h4>Categories</h4>
              <ul>
                {["Frontend", "Backend", "Devops", "Full Stack", "Digital Marketing"].map((category) => (
                  <li 
                    key={category}
                    onClick={handleCategoryClick}
                    className={selectedCategory === category ? 'selected' : ''}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <div className="job-category">
              <h4>Experience</h4>
              <ul className="checkbox">
                <li>
                  <input
                    name="0-1"
                    type="checkbox"
                    checked={checkedState[0]}
                    onChange={() => handleOnChange(0)}
                  />
                  0-1 year
                </li>
                <li>
                  <input
                    name="2-3"
                    type="checkbox"
                    checked={checkedState[1]}
                    onChange={() => handleOnChange(1)}
                  />
                  2-3 year
                </li>
                <li>
                  <input
                    name="4-5"
                    type="checkbox"
                    checked={checkedState[2]}
                    onChange={() => handleOnChange(2)}
                  />
                  4-5 year
                </li>
                <li>
                  <input
                    name="4-5"
                    type="checkbox"
                    checked={checkedState[3]}
                    onChange={() => handleOnChange(3)}
                  />
                  5+ year
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
