'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Avatar, Menu, MenuItem } from '@mui/material';
import { Search, Bell } from 'lucide-react';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar sx={{ width: 32, height: 32 }}>N</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const Header = ({ title }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: 'background.paper',
        borderBottom: '1px solid #30363d',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.default',
            borderRadius: 1,
            p: '2px 8px',
          }}
        >
          <Search size={18} color="#7d8590" />
          <InputBase placeholder="Search..." sx={{ ml: 1 }} />
        </Box>
        <IconButton>
          <Bell size={18} />
        </IconButton>
        <UserMenu />
      </Box>
    </Box>
  );
};

export default Header;