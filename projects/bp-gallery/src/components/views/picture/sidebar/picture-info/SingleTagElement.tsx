import { ArrowRight } from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTag } from '../../../../../types/additionalFlatTypes';

type TagOption = {
  id?: string;
  name: string;
  icon?: ReactNode;
};

const RootTagElement = ({ option, label }: { option: TagOption; label: string }) => {
  return (
    <div className='recommendation-item-name'>
      {option.icon}
      {label}
    </div>
  );
};

const SinglePathTagElement = ({
  tagSupertagList,
  option,
  label,
}: {
  tagSupertagList: { [k: string]: FlatTag[][] };
  option: TagOption;
  label: string;
}) => {
  return (
    <div className='recommendation-item-parents'>
      {tagSupertagList[option.id!][0].map((tag, index) => (
        <div key={index} className='recommendation-item'>
          {index >= 1 && <ArrowRight />}
          <div className='recommendation-item-name'>{tag.name}</div>
        </div>
      ))}
      {option.icon}
      {tagSupertagList[option.id!][0].length ? <ArrowRight /> : null}
      <div className='recommendation-item-name'>{label}</div>
    </div>
  );
};

const MultiPathTagElement = ({
  tagSupertagList,
  option,
  highlighted,
}: {
  tagSupertagList: { [k: string]: FlatTag[][] };
  option: TagOption;
  highlighted?: boolean;
}) => {
  const { t } = useTranslation();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
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
      {(highlighted || (typeof highlighted === 'undefined' && isHover)) &&
        tagSupertagList[option.id!].map((path, i) => (
          <div className='recommendation-item-parents' key={i}>
            <div className='recommendation-item-separator'></div>
            {path.map((tag, j) => (
              <div key={j} className='recommendation-item'>
                {j >= 1 && <ArrowRight />}
                <div className='recommendation-item-name'>{tag.name}</div>
              </div>
            ))}
            {path.length ? <ArrowRight /> : null}
            <div className='recommendation-item-name'>{option.name}</div>
          </div>
        ))}
    </div>
  );
};

const SingleTagElement = ({
  tagSupertagList,
  option,
  label,
  highlighted,
}: {
  tagSupertagList?: { [k: string]: FlatTag[][] };
  option: TagOption;
  label: string;
  highlighted?: boolean;
}) => {
  return (
    <div className='recommendation-item-container'>
      <div className='recommendation-item-content'>
        {tagSupertagList &&
        typeof option.id === 'string' &&
        tagSupertagList[option.id].length > 0 ? (
          <>
            {tagSupertagList[option.id].length > 1 ? (
              <MultiPathTagElement
                tagSupertagList={tagSupertagList}
                option={option}
                highlighted={highlighted}
              />
            ) : (
              <SinglePathTagElement
                tagSupertagList={tagSupertagList}
                option={option}
                label={label}
              />
            )}
          </>
        ) : (
          <RootTagElement option={option} label={label} />
        )}
      </div>
    </div>
  );
};

export default SingleTagElement;
