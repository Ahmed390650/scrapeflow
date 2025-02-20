export const GetApiUrl = (url: string) => {
  const appURL = process.env.NEXT_PUBLIC_APP_URL!;
  return `${appURL}/${url}`;
};
