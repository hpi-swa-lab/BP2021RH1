import { FlatTag } from '../../../../../types/additionalFlatTypes';
import { ArrowRight } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SingleTagElement = ({
  tagSupertagList,
  option,
  label,
  highlighted,
}: {
  tagSupertagList?: { [k: string]: FlatTag[][] };
  option: any;
  label: string;
  highlighted?: boolean;
}) => {
  const { t } = useTranslation();

  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div className='recommendation-item-container'>
      <div className='recommendation-item-content'>
        {tagSupertagList &&
        typeof option.id === 'string' &&
        tagSupertagList[option.id].length > 0 ? (
          <>
            {tagSupertagList[option.id].length > 1 ? (
              // multiple paths tag
              <div
                className='recommendation-item-parents'
                onMouseLeave={() => {
                  setIsHover(false);
                }}
              >
                <div
                  className='recommendation-item-multiple-paths'
                  onMouseEnter={() => {
                    setIsHover(true);
                  }}
                >
                  {t('tag-panel.multiple-paths')}
                </div>
                <ArrowRight />
                <div className='recommendation-item-name'>{option.name}</div>
                {(highlighted || (typeof highlighted === 'undefined' && isHover)) && (
                  <>
                    {tagSupertagList[option.id].map((path, i) => {
                      return (
                        <div className='recommendation-item-parents' key={i}>
                          <div className='recommendation-item-separator'></div>
                          {path.map((tag, j) => {
                            return (
                              <div key={j} className='recommendation-item'>
                                {j >= 1 && <ArrowRight />}
                                <div className='recommendation-item-name'>{tag.name}</div>
                              </div>
                            );
                          })}
                          {path.length ? <ArrowRight /> : <></>}
                          <div className='recommendation-item-name'>{option.name}</div>
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
                {tagSupertagList[option.id][0].length ? <ArrowRight /> : <></>}
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
    </div>
  );
};

export default SingleTagElement;
