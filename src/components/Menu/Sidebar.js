import React, { useState } from 'react';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from '../Menu/SidebarData.js';
import SubMenu from './SubMenu.js';
import { IconContext } from 'react-icons/lib';

const Nav = styled.div`
  background: #520d20;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled.div`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const BarsIcon = styled(FaIcons.FaBars)`
  color: #fff;
`;

const CloseIcon = styled(AiIcons.AiOutlineClose)`
  color: #f5f5f5;
`;

const SidebarNav = styled.nav`
  background: #520d20;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.3);
`;

const SidebarWrap = styled.div`
  width: 100%;
`;
const UserName = styled.div`
  color: #fff; 
  font-size: 16px; 
  padding: 10px; 
  text-align: right; 
  margin-left: auto;
  margin-right: 20px; 
  font-weight: bold;
`;

const Sidebar = ({shouldShowSidebar,usuarioNombre }) => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavIcon to='#'>
            {sidebar ? (
              <CloseIcon onClick={showSidebar} />
            ) : (
              <BarsIcon onClick={showSidebar} />
            )}
          </NavIcon>
          <UserName>{usuarioNombre}</UserName>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <CloseIcon onClick={showSidebar} />
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};


export default Sidebar;