import { OutlinedInput } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObjectURL } from '../../../hooks/url-hook';

interface ArchiveLogoInputProps {
  defaultUrl: string;
  onChange: (file: File | undefined) => void;
}

const ArchiveLogoInput = ({ defaultUrl, onChange }: ArchiveLogoInputProps) => {
  const [logo, setLogo] = useState<File | undefined>();
  const { t } = useTranslation();
  const logoUrl = useObjectURL(logo);

  return (
    <div className='archive-form-div'>
      <label className='archive-form-label' htmlFor='archive-form-logo'>
        {t('archives.edit.logo.label')}
      </label>
      <div>
        <OutlinedInput
          className='archive-form-input'
          id='archive-form-logo'
          type='file'
          name='logo'
          inputProps={{
            accept: 'image/*',
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const logoFile = e.target.files ? e.target.files[0] : undefined;
            setLogo(logoFile);
            onChange(logoFile);
          }}
        />
        {(defaultUrl || logo) && (
          <div>
            {t('archives.edit.logo.preview')}
            <div className='archive-logo-container'>
              <img className='archive-logo' src={logo ? logoUrl : defaultUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveLogoInput;
