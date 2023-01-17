import { Icon, Menu, MenuItem } from '@mui/material';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useScanner from '../../../hooks/scanner.hook';

const ScannerInput = ({ onScan }: { onScan: (file: File) => void }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: Event, index?: number) => {
    event.stopPropagation();
    setAnchorEl(null);
    if (index !== undefined) {
      selectScanner(index);
    }
  };
  const {
    scanners,
    scannedDocument,
    scan,
    selectedScannerId,
    selectScanner,
    loading: scannerLoading,
    autoCrop,
    toggleAutoCrop,
  } = useScanner();

  useEffect(() => {
    if (!scannedDocument) {
      return;
    }
    const img = new Image();
    img.src = URL.createObjectURL(scannedDocument);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      canvas.toBlob(blob => {
        if (!blob) {
          return;
        }
        const file = new File([blob], `${dayjs().format('YYYYMMDDHHmm_ss')}.jpg`, {
          type: 'image/jpeg',
        });
        onScan(file);
      });
    };
  }, [scannedDocument, onScan]);

  return scanners?.length ? (
    <div
      className='access-printer'
      onClick={() => {
        scan();
      }}
    >
      {scannerLoading ? <CircularProgress /> : <Icon>print</Icon>}
      <p>{t('curator.scan')}</p>
      <div
        className='scanner-select'
        onClick={event => {
          event.stopPropagation();
          handleClick(event);
        }}
      >
        <span>{scanners[selectedScannerId]}</span>
      </div>
      {!scannerLoading && (
        <div
          className='scanner-autocrop'
          onClick={event => {
            event.stopPropagation();
            toggleAutoCrop();
          }}
        >
          <Icon>{autoCrop ? 'check_box' : 'check_box_outline_blank'}</Icon>
          {t('curator.autoCrop')}
        </div>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={event => handleClose(event as Event)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {scanners.map((scanner, index) => (
          <MenuItem key={index} onClick={event => handleClose(event as unknown as Event, index)}>
            {scanner}
          </MenuItem>
        ))}
      </Menu>
    </div>
  ) : (
    <div
      className='access-printer'
      onClick={() => {
        window.open('/scan.service.zip', '_blank');
      }}
    >
      <Icon>help_circle</Icon>
      <p style={{ whiteSpace: 'pre-line' }}>{t('curator.noScannerFound')}</p>
    </div>
  );
};

export default ScannerInput;
