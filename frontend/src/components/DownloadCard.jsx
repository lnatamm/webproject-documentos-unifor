import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Menu, MenuItem,
  CircularProgress, CardActions
} from '@mui/material';
import axios from 'axios';

const DownloadCard = ({ title, options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    if (option) setSelectedDoc(option);
  };

  const handleDownload = async () => {
    if (!selectedDoc) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/playwright/financeiro/mensalidade', {
        params: {
          date: '2025-07-01'
        },
        responseType: 'blob', // obrigatório para downloads de PDF
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Erro ao baixar o documento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 3, backgroundColor: '#FAF9F6', minWidth: 300 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom textAlign={'center'} fontSize={'2rem'}>
          {title}
        </Typography>
        <Button variant="outlined" onClick={handleMenuClick} fullWidth sx={{ mb: 2 }}>
          {selectedDoc ? selectedDoc.label : 'Escolha o tipo de documento'}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleMenuClose(null)}>
          {options.map((option) => (
            <MenuItem key={option.label} onClick={() => handleMenuClose(option)}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedDoc || loading}
          onClick={handleDownload}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Download'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default DownloadCard;