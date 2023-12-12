import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SidebarLink = styled(Link)`
  display: flex;
  color: #f4f4f4;
  justify-content: flex-start;
  align-items: center;
  padding: 25px 32px;
  text-decoration: none;
  font-size: 16px;
  
  &:hover {
    background: rgba(221, 224, 231, 0.10) !important; ;
    cursor: pointer;
  }
`;



const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #babdc7;
  height: 60px;
  padding-left: 2.5rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 16px;

  &:hover {
    background: #bf3f5c;
    cursor: pointer;
  }
`;

const IconWrapper = styled.div`
  font-size: 22px; /* Ajusta el tamaño del ícono según tus preferencias */
  
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <IconWrapper> {/* Envuelve el ícono en un div */}
          {item.icon}
        </IconWrapper>
        <SidebarLabel>{item.title}</SidebarLabel>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              <IconWrapper> {/* Envuelve el ícono en un div */}
                {item.icon}
              </IconWrapper>
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
