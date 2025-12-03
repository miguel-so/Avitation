export const getApiBaseUrl = () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined. Please configure env.example -> .env"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
};

