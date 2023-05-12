export const isValidClientId = async (clientId: string) => {
  const response = await fetch(`https://www.paypal.com/sdk/js?client-id=${clientId}`);
  return response.ok;
};
