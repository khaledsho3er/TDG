import React from "react";
import { FaLinkedin } from "react-icons/fa"; // Import LinkedIn icon from react-icons

const TeamMember = ({ image, name, title, subtitle, linkedinUrl }) => {
  return (
    <div className="team-member">
      <div className="team-member-image">
        <img src={image} alt={name} />
      </div>
      <h3 className="team-member-name">{name}</h3>
      <p className="team-member-subtitle">{subtitle}</p>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="linkedin-icon"
      >
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
          name="Ibrahim Etman"
          title="CEO"
          subtitle=" The heart of TheDesignGrit. Ibrahim’s passion for architecture and interior design runs deep,
 fueled by a master’s degree in interior design from IED Milano and years of experience transforming spaces with his vision. With a sharp eye for detail and an unwavering dedication to
 craftsmanship, Ibrahim ensures every piece on TheDesignGrit tells a story, showcasing this
 mastery on a grand stage worthy of its brilliance.
"
          linkedinUrl="https://www.linkedin.com/in/johndoe"
        />
        <TeamMember
          image="Assets/founder.jpg" // Replace with your image paths
          name="Khaled Megahed"
          title="CEO"
          subtitle=" The engine behind the operation. Khaled is an industrial engineer with a degree from the
 University of Toronto and extensive experience as an Operations Engineer at Amazon in North
 America. He leads the development of multimillion-dollar robotic and manual fulfillment
 centers, mastering the art of designing seamless systems. Khaled’s strategic expertise and passion
 for precision drive TheDesignGrit’s innovative platform, ensuring every process runs as
 smoothly as the designs it celebrates"
          linkedinUrl="https://www.linkedin.com/in/janesmith"
        />
        {/* <TeamMember
          image="Assets/founder.jpg" // Replace with your image paths
          name="Alice Johnson"
          title="Designer"
          subtitle="Creative mind behind our designs"
          linkedinUrl="https://www.linkedin.com/in/alicejohnson"
        /> */}
      </div>
    </div>
  );
};

export default MeetOurTeam;
