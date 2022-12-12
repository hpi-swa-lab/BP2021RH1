const defaultJoditConfig = {
  preset: 'inline',
  enter: 'BR' as 'br', //Not 'P' to avoid addition of <p> to descriptions
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
};

export default defaultJoditConfig;
