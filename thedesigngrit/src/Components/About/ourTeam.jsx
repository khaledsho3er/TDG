import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa"; // Import LinkedIn icon from react-icons

const TeamMember = ({
  image,
  name,
  title,
  subtitle,
  linkedinUrl,
  InstagramUrl,
}) => {
  return (
    <div className="team-member">
      <div className="team-member-image">
        <img src={image} alt={name} />
      </div>
      <div className="team-member-info">
        <h3 className="team-member-name">{name}</h3>
        <div className="team-member-icons">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-icon"
          >
            <FaLinkedin />
          </a>
          <a
            href={InstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-icon"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
      <p className="team-member-subtitle">{subtitle}</p>
    </div>
  );
};

const MeetOurTeam = () => {
  return (
    <div className="meet-our-team">
      <div className="team-members">
        <TeamMember
          image="Assets/founder.webp" // Replace with your image paths
          name="Ibrahim Etman"
          title="CEO"
          subtitle=" The heart of TheDesignGrit. Ibrahim’s passion for architecture and interior design runs deep,
 fueled by a master’s degree in interior design from IED Milano and years of experience transforming spaces with his vision. With a sharp eye for detail and an unwavering dedication to
 craftsmanship, Ibrahim ensures every piece on TheDesignGrit tells a story, showcasing this
 mastery on a grand stage worthy of its brilliance.
"
          linkedinUrl="https://www.linkedin.com/in/johndoe"
          InstagramUrl="https://www.instagram.com/johndoe"
        />
        <TeamMember
          image="Assets/founder.webp" // Replace with your image paths
          name="Khaled Megahed"
          title="CEO"
          subtitle=" The engine behind the operation. Khaled is an industrial engineer with a degree from the
 University of Toronto and extensive experience as an Operations Engineer at Amazon in North
 America. He leads the development of multimillion-dollar robotic and manual fulfillment
 centers, mastering the art of designing seamless systems. Khaled’s strategic expertise and passion
 for precision drive TheDesignGrit’s innovative platform, ensuring every process runs as
 smoothly as the designs it celebrates."
          linkedinUrl="https://www.linkedin.com/in/janesmith"
          InstagramUrl="https://www.instagram.com/johndoe"
        />
      </div>
    </div>
  );
};

export default MeetOurTeam;
