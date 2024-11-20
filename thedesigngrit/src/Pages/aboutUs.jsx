import React from "react";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/heroAbout";
import MeetOurTeam from '../Components/ourTeam';
import { Box} from "@mui/material";
function AboutUsPage(){
    return(
        <Box className="">
            <NavBar/>
            <Box>
            <HeroAbout
        title="About Us" 
        subtitle="Explore thousands of jobs on TDG to reach the next step in your career. Online job vacancies that match your preference. Search, Save, Apply today." 
        image={"Assets/AboutUs.jpg"} 
      /></Box>
    <p className="Caption-AboutUs">Where artistry meets innovation. TheDesignGrit is a platform that empowers local Egyptian brands in the home furnishing industry. We honor Egypt’s legacy of craftsmanship while modernizing its global presence. By unifying brands under one marketplace, we amplify their reach, provide tools for success, and create seamless experiences for both businesses and customers.</p>

       <Box className="ourMission-Section">
        <Box className="urMission-Section-image">
            <img src="Assets/aboutUsContent.png" alt="ImageAbout"/>
        </Box>
        <Box className="ourMission-Section-typo">
        <h2>Our Mission</h2>
            <p>To unite Egypt’s finest home furnishing brands, streamline transactions, and elevate the customer experience with innovation, transparency, and exceptional service.</p>
      
            <h2>Our Vision</h2>
            <p>To ignite the timeless passion of Egyptian design, uniting artistry with innovation and showcasing its mastery to the world.</p>
        </Box>
        </Box>
        <Box className="ourStory-Section-typo">
        <h2> Our Story</h2>
        <p>TheDesignGrit began with a vision: to revive Egypt’s rich design heritage while paving the way for its global future. Inspired by a lack of resources for Egyptian designers, our founders created a platform to elevate local brands, connecting their craft with global audiences. We aim to bridge the gap between timeless artistry and modern innovation, empowering brands and creating an ecosystem where craftsmanship thrives.</p>
        </Box>
        <Box className="ourStory-Section-typo">
             <hr style={{ border: "1px solid #ccc", width: "100%", margin: "60px auto" }} />
             </Box>
        <Box className="OurTeam-section">
            <Box className="OurTeam-section-typo">
            <h2>Meet Our Team</h2>
            <p>Born out of a deep appreciation for design, our founders combine their global expertise in design and operations with a passion for Egyptian artistry. After studying interior design and Milan, they recognized the need for a platform that could spotlight Egypt’s unmatched talent. Their goal is to reshape how Egyptian brands are seen and celebrated worldwide.</p>

                </Box>
                <Box className="ourTeam-Section-image">
                    <MeetOurTeam/>
                   
                </Box>
        </Box>

        </Box>
        
    );
}
export default AboutUsPage;