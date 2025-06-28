import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  CardActions,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
// 1. Importe 'startOfMonth' e 'format' do date-fns
import { format, startOfMonth } from 'date-fns';

const DownloadCard = ({ title, options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Inicialize o estado já com o primeiro dia do mês atual
  const [selectedDate, setSelectedDate] = useState(startOfMonth(new Date()));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    if (option) setSelectedDoc(option);
  };

  const handleDownload = async () => {
    if (!selectedDoc || !selectedDate) return;

    // A formatação já enviará a data com o dia 01
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    setLoading(true);
    try {
      const response = await axios.get('/api/playwright/financeiro/mensalidade', {
        params: { date: formattedDate },
        responseType: 'blob',
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
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 300,
        mx: 'auto',
        mt: 3,
        backgroundColor: '#FAF9F6',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography
          variant="h6"
          gutterBottom
          textAlign={'center'}
          fontSize={'2rem'}
          fontWeight="bold"
        >
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

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <DatePicker
            views={['year', 'month']}
            label="Selecione a data"
            value={selectedDate}
            // 3. Modifique o onChange para sempre usar o início do mês
            onChange={(newDate) => {
              if (newDate) {
                setSelectedDate(startOfMonth(newDate));
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  mt: 2,
                  backgroundColor: '#fff',
                  fontSize: '1.1rem',
                  borderRadius: 2,
                },
              },
            }}
            PopperProps={{
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10],
                  },
                },
              ],
            }}
          />
        </LocalizationProvider>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedDoc || loading}
          onClick={handleDownload}
          fullWidth
          sx={{ fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Download'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default DownloadCard;