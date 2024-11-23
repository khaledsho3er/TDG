import React from 'react';
import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon from react-icons

const TeamMember = ({ image, name, title, subtitle, linkedinUrl }) => {
  return (
    <div className="team-member">
      <div className="team-member-image">
        <img src={image} alt={name} />
      </div>
      <h3 className="team-member-name">{name}</h3>
      <p className="team-member-subtitle">{subtitle}</p>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="linkedin-icon">
        <FaLinkedin />
      </a>
    </div>
  );
};

const MeetOurTeam = () => {
  return (
    <div className="meet-our-team">
      <div className="team-members">
        <TeamMember
          image="Assets/founder.jpg" // Replace with your image paths
          name="John mDoe"
          title="CEO"
          subtitle="Leader and visionary"
          linkedinUrl="https://www.linkedin.com/in/johndoe"
        />
        <TeamMember
          image="Assets/founder.jpg" // Replace with your image paths
          name="Jane Smith"
          title="CTO"
          subtitle="Tech enthusiast and innovator"
          linkedinUrl="https://www.linkedin.com/in/janesmith"
        />
        <TeamMember
          image="Assets/founder.jpg" // Replace with your image paths
          name="Alice Johnson"
          title="Designer"
          subtitle="Creative mind behind our designs"
          linkedinUrl="https://www.linkedin.com/in/alicejohnson"
        />
      </div>
    </div>
  );
};

export default MeetOurTeam;