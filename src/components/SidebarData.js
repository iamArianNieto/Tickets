import React from 'react';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import * as TbIcons from 'react-icons/tb';


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
    title: 'Administración',
    path: '/admin',
    icon: <MdIcons.MdAdminPanelSettings />,
    
  },
  {
    title: 'Estadisticas', 
    path: '/estadisticas',
    icon: <MdIcons.MdOutlineAnalytics />,
  },
  {
    title: 'IP', 
    path: '/ip',
    icon: <TbIcons.TbNetwork />,
  },

];


