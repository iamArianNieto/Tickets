import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #f4f4f4;
  justify-content: flex-start;
  align-items: center;
  padding: 25px 32px;
  font-size: 16px;
  text-decoration: none; 
  
  &:hover {
    background: rgba(221, 224, 231, 0.10) !important;
    cursor: pointer;
    text-decoration: none;
    color: #f4f4f4;
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
  color: #f5f5f5;
  font-size: 16px;
  text-decoration: none; /* Anula cualquier estilo heredado de los enlaces */

  &:hover {
    background: #bf3f5c;
    cursor: pointer;
    text-decoration: none;
    color: #f4f4f4;
  }
`;

const IconWrapper = styled.div`
  font-size: 22px;
`;

export {
  SidebarLink,
  SidebarLabel,
  DropdownLink,
  IconWrapper
};


const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <IconWrapper> 
          {item.icon}
        </IconWrapper>
        <SidebarLabel>{item.title}</SidebarLabel>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              <IconWrapper> 
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
