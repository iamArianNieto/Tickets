import React from 'react';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import * as TbIcons from 'react-icons/tb';
import * as FaIcons from 'react-icons/fa';



export const SidebarData = [
  
  {
    title: 'Tickets',
    path: '/tickets',
    icon: <BsIcons.BsTicketDetailed />,
  },
  {
    title: 'Tickets Abiertos', 
    path: '/abiertos',
    icon: <BiIcons.BiWindowOpen />,
  },
  {
    title: 'Tickets Cerrados',
    path: '/cerrados',
    icon: <BiIcons.BiWindowClose />,
  },
  {
    title: 'Dashboard', 
    path: '/estadisticas',
    icon: <MdIcons.MdOutlineAnalytics />,
  },
  {
    title: 'IP', 
    path: '/ip',
    icon: <TbIcons.TbNetwork />,
  },
  {
    title: 'Ayuda',
    path: '/ayuda',
    icon: <MdIcons.MdOutlineLiveHelp />,
    
  },
  {
    title: 'Cerrar Sesion', 
    path: '/',
    icon: <FaIcons.FaSignInAlt/>,
  },

];




