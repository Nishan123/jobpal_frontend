import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faBriefcase, 
  faStethoscope, 
  faGraduationCap, 
  faChartLine, 
  faTools,
  faPalette,
  faCalculator,
  faLaptop,
  faCamera,
  faFlask,
  faHammer,
  faServer,
  faPencilAlt,
  faMicroscope,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import './FloatingLogos.css';

const FloatingLogos = () => {
  const logos = [
    { icon: faCode },
    { icon: faBriefcase },
    { icon: faStethoscope },
    { icon: faGraduationCap },
    { icon: faChartLine },
    { icon: faTools },
    { icon: faPalette },
    { icon: faCalculator },
    { icon: faLaptop },
    { icon: faCamera },
    { icon: faFlask },
    { icon: faHammer },
    { icon: faServer },
    { icon: faPencilAlt },
    { icon: faMicroscope },
    { icon: faChalkboardTeacher }
  ].map((logo, index) => ({
    ...logo,
    class: `float-${index + 1}`,
    delay: Math.random() * -15
  }));

  return (
    <div className="floating-logos">
      {logos.map((logo, index) => (
        <FontAwesomeIcon 
          key={index} 
          icon={logo.icon} 
          className={`floating-logo ${logo.class}`}
          style={{ animationDelay: `${logo.delay}s` }}
        />
      ))}
    </div>
  );
};

export default FloatingLogos;
