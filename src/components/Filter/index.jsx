import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import "./index.css";

const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const salaryRanges = [
  { label: "Below 30K", min: 0, max: 30000 },
  { label: "30K-50K", min: 30000, max: 50000 },
  { label: "50K-80K", min: 50000, max: 80000 },
  { label: "80K-100K", min: 80000, max: 100000 },
  { label: "Above 100K", min: 100000, max: Infinity }
];

const Filter = ({
  setFilteredJobs,
  handleJobFilter,
  handleExperienceFilter,
  searchEvent,
}) => {
  const [searchParams] = useSearchParams();
  const [checkedExperience, setCheckedExperience] = useState(
    new Array(experience.length).fill(false)
  );
  const [checkedSalary, setCheckedSalary] = useState(
    new Array(salaryRanges.length).fill(false)
  );

  const handleExperienceChange = (position) => {
    const updatedCheckedState = checkedExperience.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedExperience(updatedCheckedState);
    handleExperienceFilter(updatedCheckedState);
  };

  const handleSalaryChange = (position) => {
    const updatedCheckedState = checkedSalary.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedSalary(updatedCheckedState);
    // Update this to handle salary filtering in your parent component
    handleJobFilter({ target: { name: 'salary', checkedRanges: updatedCheckedState } });
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
                defaultValue={searchParams.get('search') || ""}
                onChange={searchEvent}
              />
            </div>
          </div>
          <div className="filter">
            <div className="job-category">
              <h4>Salary Range</h4>
              <ul className="checkbox">
                {salaryRanges.map((range, index) => (
                  <li key={range.label}>
                    <input
                      type="checkbox"
                      checked={checkedSalary[index]}
                      onChange={() => handleSalaryChange(index)}
                    />
                    {range.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="job-category">
              <h4>Experience</h4>
              <ul className="checkbox">
                <li>
                  <input
                    type="checkbox"
                    checked={checkedExperience[0]}
                    onChange={() => handleExperienceChange(0)}
                  />
                  0-1 year
                </li>
                <li>
                  <input
                    type="checkbox"
                    checked={checkedExperience[1]}
                    onChange={() => handleExperienceChange(1)}
                  />
                  2-3 year
                </li>
                <li>
                  <input
                    type="checkbox"
                    checked={checkedExperience[2]}
                    onChange={() => handleExperienceChange(2)}
                  />
                  4-5 year
                </li>
                <li>
                  <input
                    type="checkbox"
                    checked={checkedExperience[3]}
                    onChange={() => handleExperienceChange(3)}
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
