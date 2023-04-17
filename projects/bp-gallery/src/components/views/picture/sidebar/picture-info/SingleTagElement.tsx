import { useState } from 'react';
import { FlatTag } from '../../../../../types/additionalFlatTypes';
import { ArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SingleTagElement = ({
  tagSupertagList,
  option,
  label,
}: {
  tagSupertagList?: { [k: string]: FlatTag[][] };
  option: any;
  label: string;
}) => {
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div className='recommendation-item-container'>
      {tagSupertagList &&
      typeof option.id === 'string' &&
      option.id !== '-2' &&
      option.id !== '-3' &&
      tagSupertagList[option.id].length > 0 ? (
        <>
          {tagSupertagList[option.id].length > 1 ? (
            // multiple paths tag
            <div className='recommendation-item-parents' onMouseLeave={handleMouseLeave}>
              <div className='recommendation-item-multiple-paths' onMouseEnter={handleMouseEnter}>
                {t('tag-panel.multiple-paths')}
              </div>
              <ArrowRight />
              <div className='recommendation-item-name'>{option.name}</div>
              {isHovering && (
                <>
                  {tagSupertagList[option.id].map((paths, i) => {
                    return (
                      <div className='w-full' key={i}>
                        {i === 0 && <hr />}
                        <div className='recommendation-item-parents'>
                          {paths.map((tag, j) => {
                            return (
                              <div key={j} className='recommendation-item'>
                                {j >= 1 && <ArrowRight />}
                                <div className='recommendation-item-name'>{tag.name}</div>
                              </div>
                            );
                          })}
                          <ArrowRight />
                          <div className='recommendation-item-name'>{option.name}</div>
                        </div>
                        <hr />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            // single path tag
            <div className='recommendation-item-parents'>
              {tagSupertagList[option.id][0].map((tag, index) => {
                return (
                  <div key={index} className='recommendation-item'>
                    {index >= 1 && <ArrowRight />}
                    <div className='recommendation-item-name'>{tag.name}</div>
                  </div>
                );
              })}
              {option.icon ?? ''}
              <ArrowRight />
              <div className='recommendation-item-name'>{label}</div>
            </div>
          )}
        </>
      ) : (
        // root tag
        <div className='recommendation-item-name'>
          {option.icon ?? ''}
          {label}
        </div>
      )}
    </div>
  );
};

export default SingleTagElement;
