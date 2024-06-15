// src/components/Profile.js
import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background: url('/assets/background.jpeg') no-repeat center center; /* 背景图片 */
  background-size: cover;
  height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 250, 240, 0.6); /* 半透明背景 */
  z-index: 1;
`;

const ProfileContent = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto auto;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  border-radius: 15px;
`;

const ProfileImageWrapper = styled.div`
  grid-column: 1 / span 1;
  grid-row: 1 / span 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Motto = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #7a5533;
`;

const Bio = styled.div`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  background-color: #fffaf0;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BioText = styled.p`
  font-size: 1.2rem;
  color: #7a5533;
  text-align: left;
  margin: 0;
`;

const Profile = () => {
  return (
    <ProfileContainer>
      <Overlay />
      <ProfileContent>
        <ProfileImageWrapper>
          <ProfileImage src="/assets/adavator.JPG" alt="Profile" />
        </ProfileImageWrapper>
        <Motto>“If you are doing your best,you will not have to worry about failure.”</Motto>
        <Bio>
          <BioText>
            I'm a dedicated culture critic and blogger located in San Francisco, California. Geraldine DeRuiter's husband Rand has a job that takes him all over the world. After she was laid off from her job, she started tagging along with him and blogging their experiences at The Everywhereist. She says she blogs to help Rand remember where they’ve been and what they’ve seen, but she consistently does see the site set up as doing for the rest of us what she can: making us feel like we’re in on the adventure she’s having.
          </BioText>
        </Bio>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
